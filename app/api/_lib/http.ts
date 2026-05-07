import { NextResponse } from 'next/server';
import { z } from 'zod';

export type ApiErrorCode = 'bad_request' | 'not_found' | 'internal_error';

export const UuidSchema = z.string().uuid();

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true as const, data }, { status: 200, ...init });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json({ success: true as const, data }, { status: 201 });
}

export function jsonError(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ success: false as const, error: { code, message } }, { status });
}

export async function parseJson<T extends z.ZodTypeAny>(request: Request, schema: T) {
  const body = await request.json().catch(() => undefined);
  return schema.safeParse(body);
}
