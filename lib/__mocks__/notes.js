/* global notesMock */
global.notesMock = {
  shouldFind: true,
  shouldValidate: true,
  idShouldValidate: true,
  shouldSysError: false,
  shouldInitError: false,
};

const {NotesError} = require('../errors');

const mock = jest.fn().mockImplementation(() => {
  const fakeError = new Error();
  fakeError.code = 'EMOCKERROR';

  return {
    read: async function (id) {
      if (!notesMock.shouldFind) throw new NotesError('NOTE_NOT_FOUND', {id});
      if (!notesMock.idShouldValidate) throw new NotesError('NOTE_INVALID_ID', {id});
      if (notesMock.shouldSysError) throw fakeError;
      if (notesMock.shouldInitError) throw new NotesError('NOTE_INIT_ERROR', fakeError);
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
      if (!notesMock.shouldValidate) throw new NotesError('NOTE_FAILED_VALIDATION');
      if (notesMock.shouldSysError) throw new NotesError('NOTE_WRITE_ERROR', fakeError);
      if (notesMock.shouldInitError) throw new NotesError('NOTE_INIT_ERROR', fakeError);
      note.id = 0;
      return note;
    },
    update: async function (note) {
      if (!notesMock.shouldFind) throw new NotesError('NOTE_NOT_FOUND', note);
      if (!notesMock.shouldValidate) throw new NotesError('NOTE_FAILED_VALIDATION');
      if (!notesMock.idShouldValidate) throw new NotesError('NOTE_INVALID_ID', {id: note.id});
      if (notesMock.shouldSysError) throw new NotesError('NOTE_WRITE_ERROR', fakeError);
      if (notesMock.shouldInitError) throw new NotesError('NOTE_INIT_ERROR', fakeError);
      return note;
    },
    delete: async function (id) {
      if (!notesMock.shouldFind) throw new NotesError('NOTE_NOT_FOUND', {id});
      if (!notesMock.idShouldValidate) throw new NotesError('NOTE_INVALID_ID', {id});
      if (notesMock.shouldSysError) throw new NotesError('NOTE_WRITE_ERROR', fakeError);
      if (notesMock.shouldInitError) throw new NotesError('NOTE_INIT_ERROR', fakeError);
      return true;
    },
  };
});

module.exports = mock;
