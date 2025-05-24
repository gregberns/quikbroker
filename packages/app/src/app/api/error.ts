"use client";

import { NextRequest, NextResponse } from "next/server";

export function notFound(req: NextRequest) {
  return NextResponse.json(
    { error: { message: "Not found", code: "NOT_FOUND" } },
    { status: 404 }
  );
}

export function methodNotAllowed(req: NextRequest) {
  return NextResponse.json(
    {
      error: {
        message: `Method ${req.method} not allowed`,
        code: "METHOD_NOT_ALLOWED",
      },
    },
    { status: 405 }
  );
}

export function internalServerError(req: NextRequest, error?: Error) {
  console.error(`API Error [${req.method} ${req.nextUrl.pathname}]:`, error);

  // Log details to server logs
  if (error) {
    console.error(error.stack || error.message);
  }

  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
    },
    { status: 500 }
  );
}
