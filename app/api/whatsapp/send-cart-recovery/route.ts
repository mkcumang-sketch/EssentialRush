import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireSuperAdmin } from "@/lib/auth";
import { AbandonedCart } from "@/models/AbandonedCart";
import { validateAndFormatPhone, getWhatsAppUrl } from "@/lib/phone";
import {
  CART_CONFIG,
  URLS,
  WHATSAPP_MESSAGES,
  ERROR_MESSAGES,
  HTTP_STATUS,
} from "@/lib/constants";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PostRequestBody {
  leadId?: string;
}

interface SuccessResponse {
  success: true;
  url: string;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

/**
 * Validates the request body
 */
function validateRequest(body: unknown): {
  isValid: boolean;
  leadId?: string;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_LEAD_ID };
  }

  const { leadId } = body as PostRequestBody;

  if (!leadId || typeof leadId !== "string" || leadId.trim().length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_LEAD_ID };
  }

  return { isValid: true, leadId: leadId.trim() };
}

/**
 * POST /api/whatsapp/send-cart-recovery
 * Generates a WhatsApp recovery link for an abandoned cart
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1. Authentication check
    const isAuthorized = await requireSuperAdmin(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // 2. Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // 3. Connect to database
    await connectDB();

    // 4. Fetch lead from database
    const lead = await AbandonedCart.findById(validation.leadId).lean();

    if (!lead) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.LEAD_NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // 5. Validate and format phone number
    const phoneValidation = validateAndFormatPhone(lead.phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // 6. Generate recovery link
    const appUrl = process.env.NEXTAUTH_URL || URLS.DEFAULT_APP_URL;
    const recoveryLink = `${appUrl}${URLS.CART_RECOVERY}`;

    // 7. Generate WhatsApp message
    const clientName = lead.name || CART_CONFIG.DEFAULT_NAME;
    const message = WHATSAPP_MESSAGES.CART_RECOVERY(clientName, recoveryLink);

    // 8. Generate WhatsApp URL
    const whatsappUrl = getWhatsAppUrl(phoneValidation.formattedNumber, message);

    // 9. Log successful operation (optional: update lead status in DB)
    console.log(`WhatsApp link generated for lead: ${validation.leadId}`);

    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        url: whatsappUrl,
        message: "WhatsApp link generated successfully",
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("Error in cart recovery endpoint:", error);

    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: HTTP_STATUS.INTERNAL_ERROR }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}