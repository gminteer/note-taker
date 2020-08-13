/* global shouldBeFound, shouldValidate, writeShouldSucceed */
global.shouldBeFound = true;
global.shouldValidate = true;
global.writeShouldSucceed = true;
const {NotesError} = require('../errors');

const mock = jest.fn().mockImplementation(() => {
  const fakeError = new Error();
  fakeError.code = 'EMOCKERROR';

  return {
    read: async function (id) {
      if (!shouldBeFound) throw new NotesError('NOTE_NOT_FOUND', {id});
      if (!writeShouldSucceed) throw fakeError;
      if (id) {
        return {title: 'testNote1', text: 'testText1', id: 0};
      } else {
        return [
          {title: 'testNote1', text: 'testText1', id: 0},
          {title: 'testNote2', text: 'testText2', id: 1},
          {title: 'testNote3', text: 'testText3', id: 2},
        ];
      }
    },
    create: async function (note) {
      if (!shouldValidate) throw new NotesError('NOTE_FAILED_VALIDATION');
      if (!writeShouldSucceed) throw new new NotesError('NOTE_WRITE_ERROR', fakeError)();
      note.id = 0;
      return note;
    },
    update: async function (note) {
      if (!shouldBeFound) throw new NotesError('NOTE_NOT_FOUND', note);
      if (!shouldValidate) throw new NotesError('NOTE_FAILED_VALIDATION');
      if (!writeShouldSucceed) throw new new NotesError('NOTE_WRITE_ERROR', fakeError)();
      return note;
    },
    delete: async function (id) {
      if (!shouldBeFound) throw new NotesError('NOTE_NOT_FOUND', {id});
      if (!writeShouldSucceed) throw new new NotesError('NOTE_WRITE_ERROR', fakeError)();
      return true;
    },
  };
});

module.exports = mock;
