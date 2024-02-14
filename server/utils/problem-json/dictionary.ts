export const commonErrorDictionaty = {
  IllegalArgumentError: {
    type: `urn:problem-type:illegal-argument-error`,
    title: 'Bad Request',
    description: 'ILLEGAL_ARGUMENT',
    status: 400
  },

  IvaIllegalArgumentRequestError: {
    type: 'urn:problem-type:iva-illegal-argument-request-error',
    title: 'Bad Request',
    status: 400
  }
};
