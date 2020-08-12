const path = require('path');
const {validate: isValidUuid, NIL: nilUuid} = require('uuid');

// eslint-disable-next-line no-unused-vars
const data = require(path.join(__dirname, '../lib/data'));
jest.mock(path.join(__dirname, '../lib/data'));
const Notes = require(path.join(__dirname, '../lib/notes'));
const notes = new Notes();

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
  notes._data.writeShouldSucceed = true;
});

describe('lib/notes.js', () => {
  describe('.create(note)', () => {
    test('should return an object', async () => {
      await expect(notes.create({title: 'newNoteTitle', text: 'newNoteText'})).resolves.toEqual(expect.any(Object));
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
    test('should throw an error on invalid input', async () => {
      await expect(notes.create()).rejects.toThrow();
    });
    test('should throw an error if the write fails', async () => {
      notes._data.writeShouldSucceed = false;
      await expect(notes.create({title: 'newNoteTitle', text: 'newNoteText'})).rejects.toThrow();
    });
  });

  describe('.read(id)', () => {
    test('should return all notes when called with no arguments', async () => {
      const noteList = await notes.read();
      expect(noteList.length).toEqual(notes._data.db.length);
    });
    test('should return the note with matching id if it exists', async () => {
      const note = await notes.read('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(note.title).toEqual('Test1');
      expect(note.text).toEqual('This is a test note.');
    });
    test('should throw an error if no id matches', async () => {
      await expect(notes.read(nilUuid)).rejects.toThrow();
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
      expect(result).toEqual(replacementNote);
      const getNote = await notes.read('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(getNote.title).toEqual('differentTitle');
      expect(getNote.text).toEqual('differentText');
    });
    test("should throw an error if id isn't matched", async () => {
      const invalidNote = {title: 'invalidNote', text: 'invalidText', id: nilUuid};
      await expect(notes.update(invalidNote)).rejects.toThrow();
    });
    test('should throw an error if the write fails', async () => {
      const replacementNote = {
        title: 'differentTitle',
        text: 'differentText',
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      notes._data.writeShouldSucceed = false;
      await expect(notes.update(replacementNote)).rejects.toThrow();
    });
  });

  describe('.drop(id)', () => {
    test('should remove the note matching the id', async () => {
      await expect(notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf')).resolves.toBeTruthy();
      await expect(notes.read('70a38567-e3e1-4c44-8777-86647acd5adf')).rejects.toThrow();
    });
    test('notes array should be one element shorter after dropping a note', async () => {
      const oldLength = notes._data.db.length;
      await notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(notes._data.db.length).toEqual(oldLength - 1);
    });
    test("should throw an error if id isn't matched", async () => {
      await expect(notes.drop(nilUuid)).rejects.toThrow();
    });
    test('should throw an error if the write fails', async () => {
      notes._data.writeShouldSucceed = false;
      await expect(notes.drop('70a38567-e3e1-4c44-8777-86647acd5adf')).rejects.toThrow();
    });
  });
});
