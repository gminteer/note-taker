class NotesError extends Error {
  constructor(code = '', details = {}, ...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, NotesError);
    this.code = code;
    this.details = details;
  }
}

module.exports = {NotesError};
