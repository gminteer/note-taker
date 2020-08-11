const {validate: isValidUuid, NIL: nilUuid} = require('uuid');

// eslint-disable-next-line no-unused-vars
const data = require('../lib/data');
jest.mock('../lib/data');
const notes = require('../lib/notes');
beforeEach(() => {
  notes._data.db = [
    {
      title: 'Test1',
      text: 'This is a test note.',
      id: '70a38567-e3e1-4c44-8777-86647acd5adf',
    },
    {
      title: 'Test2',
      text: 'This is also a test note.',
      id: '7fe3a135-568d-4c56-9fc6-3fb9f30bf8ab',
    },
    {
      title: 'Test3',
      text: 'This is a third test note.',
      id: 'f42aaa07-7ca6-431d-b7f9-0e1d58f906ec',
    },
  ];
});

describe('lib/notes.js', () => {
  describe('.create(note)', () => {
    test('should return an object', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(newNote).toEqual(expect.any(Object));
    });
    test('title and text should match input', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(newNote.title).toEqual('newNoteTitle');
      expect(newNote.text).toEqual('newNoteText');
    });
    test('should have a valid UUID as an id', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(isValidUuid(newNote.id)).toBeTruthy();
    });
    test('notes array should be one element longer after creating a note', async () => {
      const oldLength = notes._data.db.length;
      // eslint-disable-next-line no-unused-vars
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(notes._data.db.length).toEqual(oldLength + 1);
    });
  });

  describe('.read', () => {
    test('() should return all notes when called with no arguments', async () => {
      const noteList = await notes.read();
      expect(noteList.length).toEqual(notes._data.db.length);
    });
    test('(id) should return the note with matching id if it exists', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      const [getNote] = await notes.read(newNote.id);
      expect(getNote).toEqual(newNote);
    });
    test('(id) should return an empty array if no id matches', async () => {
      const getNote = await notes.read(nilUuid);
      expect(getNote).toEqual([]);
    });
  });

  describe('.update(note)', () => {
    test('should replace the note matching that id', async () => {
      const replacementNote = {
        title: 'differentTitle',
        text: 'differentText',
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      const result = await notes.update(replacementNote);
      expect(result).toBeTruthy();
      const [getNote] = await notes.read('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(getNote.title).toEqual('differentTitle');
      expect(getNote.text).toEqual('differentText');
    });
    test('should return false if no note matches that id', async () => {
      const invalidNote = {title: 'invalidNote', text: 'invalidText', id: nilUuid};
      expect(await notes.update(invalidNote)).toBeFalsy();
    });
    test('should return false if write fails', async () => {
      const replacementNote = {
        title: 'differentTitle',
        text: 'differentText',
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      notes._data.writeShouldSucceed = false;
      expect(await notes.update(replacementNote)).toBeFalsy();
    });
  });

  describe('.drop(id)', () => {
    test('should remove the note matching the id', async () => {
      await notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(await notes.read('70a38567-e3e1-4c44-8777-86647acd5adf')).toEqual([]);
    });
    test('notes array should be one element shorter after dropping a note', async () => {
      const oldLength = notes._data.db.length;
      await notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(notes._data.db.length).toEqual(oldLength - 1);
    });
    test('should return false if no note matches that id', async () => {
      expect(await notes.drop(nilUuid)).toBeFalsy();
    });
    test('should return false if write fails', async () => {
      expect(await notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf')).toBeFalsy();
    });
  });
});
