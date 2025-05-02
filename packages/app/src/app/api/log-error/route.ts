import { NextRequest, NextResponse } from "next/server";
import { serverLogger } from "../../lib/serverLogger";

export async function POST(req: NextRequest) {
  try {
    // Parse the error data from the request
    const logData = await req.json();

    // Determine log level and type
    const level = logData.level || 'ERROR';
    const type = logData.type || 'client-error';
    const message = logData.message || 'No message provided';

    // Log the error using the appropriate method based on level
    switch (level) {
      case 'ERROR':
        serverLogger.error(type, message, logData.metadata);
        break;
      case 'WARN':
        serverLogger.warn(type, message, logData.metadata);
        break;
      case 'INFO':
        serverLogger.info(type, message, logData.metadata);
        break;
      case 'DEBUG':
        serverLogger.debug(type, message, logData.metadata);
        break;
      default:
        serverLogger.error(type, message, logData.metadata);
    }

    // Also log API access
    serverLogger.access(req, 200, { logType: 'client-log' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error while logging client error:', error);
    serverLogger.apiError(req, error);

    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}
