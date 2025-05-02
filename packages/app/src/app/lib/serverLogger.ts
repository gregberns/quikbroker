import fs from 'fs';
import path from 'path';
import { NextRequest } from "next/server";

// Configure log directory - in a real app, use environment variables
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');
const INFO_LOG_FILE = path.join(LOG_DIR, 'info.log');
const ACCESS_LOG_FILE = path.join(LOG_DIR, 'access.log');

// Ensure log directory exists
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Failed to create log directory:', err);
}

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

/**
 * Log severity determines which file the log is written to
 */
export enum LogSeverity {
  ERROR = 'ERROR',
  INFO = 'INFO',
  ACCESS = 'ACCESS',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  type: string;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Write a log entry to the appropriate log file
 */
function writeToLogFile(severity: LogSeverity, logEntry: LogEntry): void {
  try {
    // Choose the appropriate log file
    const logFile = {
      [LogSeverity.ERROR]: ERROR_LOG_FILE,
      [LogSeverity.INFO]: INFO_LOG_FILE,
      [LogSeverity.ACCESS]: ACCESS_LOG_FILE,
    }[severity];

    // Format the log entry as JSON
    const formattedLog = JSON.stringify(logEntry) + '\n';

    // Append to the log file
    fs.appendFileSync(logFile, formattedLog, { encoding: 'utf8' });

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${logEntry.level}] [${logEntry.type}] ${logEntry.message}`);
      if (logEntry.metadata) {
        console.log('Metadata:', logEntry.metadata);
      }
    }
  } catch (err) {
    // If we can't write to the log file, at least log to the console
    console.error('Failed to write to log file:', err);
    console.error('Original log entry:', logEntry);
  }
}

/**
 * Extract useful information from a NextRequest for logging
 */
export function getRequestInfo(req: NextRequest): Record<string, any> {
  return {
    url: req.url,
    method: req.method,
    ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    referer: req.headers.get('referer'),
  };
}

/**
 * Main server-side logger class
 */
export const serverLogger = {
  /**
   * Log an error
   */
  error(type: string, message: string, metadata?: Record<string, any>): void {
    writeToLogFile(LogSeverity.ERROR, {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      type,
      message,
      metadata,
    });
  },

  /**
   * Log a warning
   */
  warn(type: string, message: string, metadata?: Record<string, any>): void {
    writeToLogFile(LogSeverity.ERROR, {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      type,
      message,
      metadata,
    });
  },

  /**
   * Log an informational message
   */
  info(type: string, message: string, metadata?: Record<string, any>): void {
    writeToLogFile(LogSeverity.INFO, {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      type,
      message,
      metadata,
    });
  },

  /**
   * Log a debug message
   */
  debug(type: string, message: string, metadata?: Record<string, any>): void {
    // Only log debug messages in development
    if (process.env.NODE_ENV !== 'production') {
      writeToLogFile(LogSeverity.INFO, {
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        type,
        message,
        metadata,
      });
    }
  },

  /**
   * Log an API access entry
   */
  access(req: NextRequest, statusCode: number, metadata?: Record<string, any>): void {
    writeToLogFile(LogSeverity.ACCESS, {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      type: 'api-access',
      message: `${req.method} ${req.url} ${statusCode}`,
      metadata: {
        ...getRequestInfo(req),
        statusCode,
        ...metadata,
      },
    });
  },

  /**
   * Log an API error
   */
  apiError(req: NextRequest, error: any, statusCode: number = 500): void {
    writeToLogFile(LogSeverity.ERROR, {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      type: 'api-error',
      message: error instanceof Error ? error.message : String(error),
      metadata: {
        ...getRequestInfo(req),
        statusCode,
        stack: error instanceof Error ? error.stack : null,
      },
    });
  },

  /**
   * Log a security event
   */
  security(type: string, message: string, metadata?: Record<string, any>): void {
    writeToLogFile(LogSeverity.ERROR, {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      type: `security-${type}`,
      message,
      metadata,
    });
  },
};