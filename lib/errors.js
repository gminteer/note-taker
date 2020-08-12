class NotesError extends Error {
  constructor(code = '', details = {}, message, ...params) {
    if (!message && code) {
      switch (code) {
        case 'NOTE_NOT_FOUND': {
          message = `"${details.id}" not in notes array`;
          break;
        }
        case 'NOTE_FAILED_VALIDATION': {
          message = 'suggested note does not validate';
          break;
        }
        case 'NOTE_WRITE_ERROR': {
          message = `write failed with "${details.code}"`;
          break;
        }
      }
    }
    super(message, ...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, NotesError);
    this.code = code;
    this.details = details;
  }
}

module.exports = {NotesError};
