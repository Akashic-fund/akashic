import { NextResponse } from 'next/server';
import {
  ApiUpstreamError,
  ApiAuthError,
  ApiAuthNotAllowed,
  ApiParameterError,
  ApiNotFoundError,
  ApiIntegrityError,
  ApiConflictError,
} from './error';

export async function response(data: unknown) {
  return NextResponse.json(data, { status: 200 });
}

export async function handleError(error: unknown) {
  if (error instanceof ApiAuthError) {
    return notAuthorized();
  }
  if (error instanceof ApiAuthNotAllowed) {
    return notAllowed();
  }
  if (error instanceof ApiIntegrityError) {
    return NextResponse.json(
      {
        success: false,
        error: 'ApplicationError, data integrity failure: ' + error?.message,
      },
      { status: 500 },
    );
  }
  if (error instanceof ApiConflictError) {
    return NextResponse.json(
      {
        success: false,
        error: 'ApplicationError, data conflict: ' + error?.message,
      },
      { status: 409 },
    );
  }
  if (error instanceof ApiParameterError) {
    return NextResponse.json(
      {
        success: false,
        error: 'ApplicationError, invalid parameters: ' + error?.message,
        details: error.details,
      },
      { status: 400 },
    );
  }
  if (error instanceof ApiNotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: 'ApplicationError, instance not found: ' + error?.message,
      },
      { status: 404 },
    );
  }
  if (error instanceof ApiUpstreamError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Service Error, upstream failure: ' + error?.message,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }
  let message = 'Unknown Error';
  if (error instanceof Error && 'message' in error) {
    message = error.message;
  }
  return NextResponse.json(
    { success: false, error: 'ApplicationError: ' + message },
    { status: 500 },
  );
}
/**
 * not authorized: the resource accessed requires authorization but
 *                 the required header was not found
 */
export async function notAuthorized() {
  return NextResponse.json(
    { success: false, error: 'Not authorized' },
    { status: 401 },
  );
}
/**
 * not authorized: the resource accessed is not accessible to the
 *                 authorization provided.
 */
export async function notAllowed() {
  return NextResponse.json(
    { success: false, error: 'No permission to access resource' },
    { status: 403 },
  );
}
