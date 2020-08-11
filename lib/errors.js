class NotesError extends Error {
  constructor(type = '', details = {}, ...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, NotesError);
    this.type = type;
    this.details = details;
  }
}

module.exports = {NotesError};
