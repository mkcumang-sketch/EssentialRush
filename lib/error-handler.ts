// 🔧 NEW: Type-safe error handler

export interface APIErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: Record<string, string>;
}

export interface APISuccessResponse<T = any> {
  success: true;
  data: T;
  statusCode: number;
}

export type APIResponse<T = any> = APISuccessResponse<T> | APIErrorResponse;

/**
 * 🔧 Type-safe error handler for try-catch blocks
 * Usage: const error = handleError(err);
 */
export function handleError(error: unknown): {
  message: string;
  statusCode: number;
  details?: Record<string, string>;
} {
  // Handle Mongoose validation errors
  if (error instanceof Error) {
    // Check if it's a Mongoose ValidationError
    if ('errors' in error && typeof error.errors === 'object') {
      const details: Record<string, string> = {};
      for (const [key, value] of Object.entries(error.errors)) {
        if (value && typeof value === 'object' && 'message' in value) {
          details[key] = String(value.message);
        }
      }
      return {
        message: error.message || 'Validation failed',
        statusCode: 400,
        details
      };
    }

    // Handle general Error instances
    return {
      message: error.message || 'Internal server error',
      statusCode: 500
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      statusCode: 500
    };
  }

  // Handle unknown errors
  return {
    message: 'An unknown error occurred',
    statusCode: 500
  };
}

/**
 * 🔧 Helper to check if error is of a specific type
 */
export function isMongooseError(error: unknown): boolean {
  return (
    error instanceof Error &&
    ('errors' in error || error.name === 'ValidationError' || error.name === 'CastError')
  );
}

/**
 * 🔧 Safe JSON parsing with error handling
 */
export async function safeJsonParse<T = any>(text: string): Promise<T> {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}