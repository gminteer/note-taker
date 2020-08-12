const DEFAULT_MESSAGES = {
  NOTE_NOT_FOUND: (details) => `"${details.id}" not in notes array`,
  NOTE_FAILED_VALIDATION: () => 'suggested note does not validate',
  NOTE_WRITE_ERROR: (details) => `write failed with "${details.code}"`,
};
class NotesError extends Error {
  constructor(code, details, message, ...params) {
    if (!message && code) message = DEFAULT_MESSAGES[code](details);
    super(message, ...params);
    this.code = code;
    this.details = details;
  }
}

module.exports = {NotesError};
