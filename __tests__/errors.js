const {NotesError} = require('../lib/errors');
describe('NotesError', () => {
  test("shouldn't replace message if one is provided to contructor", () => {
    const testError = new NotesError(null, null, 'test message');
    expect(testError.message).toEqual('test message');
  });
  test('should set a message based on provided error code if no message is provided', () => {
    const notFoundError = new NotesError('NOTE_NOT_FOUND', {id: 'test'});
    expect(notFoundError).toMatchSnapshot();
    const failedValidationError = new NotesError('NOTE_FAILED_VALIDATION');
    expect(failedValidationError).toMatchSnapshot();
    const writeError = new NotesError('NOTE_WRITE_ERROR', {code: 'test'});
    expect(writeError).toMatchSnapshot();
  });
});
