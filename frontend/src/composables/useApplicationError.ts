import type { ApplicationError } from '@/types';

export function isApplicationError(errorPayload: any): errorPayload is ApplicationError {
  return errorPayload && errorPayload.error && errorPayload.error.name != undefined && errorPayload.error.message != undefined;
}