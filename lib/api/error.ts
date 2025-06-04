/**
 * AuthError
 * Error to be thrown from route functions, used for consistent error responses
 */
export class ApiAuthError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiAuthError.prototype);
    this.name = 'AuthError';
  }
}
/**
 * AuthNotAllowedError
 * Error to be thrown from route functions when a functionality is requested that
 * the authenticated user must not use.
 */
export class ApiAuthNotAllowed extends ApiAuthError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiAuthNotAllowed.prototype);
    this.name = 'AuthNotAllowedError';
  }
}
/**
 * ParameterError
 * Error to be thrown from route functions.
 * This error indicates that the route was not able to process the request because of bad
 * parameters.
 */
export class ApiParameterError extends Error {
  public details: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, ApiParameterError.prototype);
    this.name = 'ParameterError';
    this.details = details;
  }
}
/**
 * NotFoundError
 * Error to be thrown from route functions.
 * This error indicates that the route tried to modify a instance that is not available in the
 * storage
 */
export class ApiNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiNotFoundError.prototype);
    this.name = 'NotFoundError';
  }
}
/**
 * Conflict Error
 * Error to be thrown from route functions.
 * This error indicates that the route tried to modify a instance with data that is in
 * conflict with the current state.
 */
export class ApiConflictError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiConflictError.prototype);
    this.name = 'ConflictError';
  }
}
/**
 * Upstream Error
 * Error to be thrown from route functions.
 * This error indicates that the route tried to call a upstream service and failed
 */
export class ApiUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiUpstreamError.prototype);
    this.name = 'UpstreamError';
  }
}
/**
 * Integrity Error
 * Error to be thrown from route functions.
 * This error indicates that the route tried to modify a instance that does not match
 * integrity checks
 */
export class ApiIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiIntegrityError.prototype);
    this.name = 'IntegrityError';
  }
}
