const path = require('path');
const {validate: isValidUuid, NIL: nilUuid} = require('uuid');

jest.mock(path.join(__dirname, '../lib/persistent-array'));
const PersistentArray = require('../lib/persistent-array');
const Notes = require('../lib/notes');
const notes = new Notes(new PersistentArray());

beforeEach(() => {
  notes._data.array = [
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
    test('should return an object that matches input', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(newNote.title).toEqual('newNoteTitle');
      expect(newNote.text).toEqual('newNoteText');
    });
    test('should return an object with a valid id', async () => {
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(isValidUuid(newNote.id)).toBeTruthy();
    });
    test('should store the created object in the notes array', async () => {
      const oldLength = notes._data.array.length;
      // eslint-disable-next-line no-unused-vars
      const newNote = await notes.create({title: 'newNoteTitle', text: 'newNoteText'});
      expect(notes._data.array.length).toEqual(oldLength + 1);
    });
    test('should throw an error on invalid input', async () => {
      await expect(notes.create()).rejects.toThrowErrorMatchingSnapshot();
    });
    test('should throw an error if the write fails', async () => {
      notes._data.writeShouldSucceed = false;
      await expect(notes.create({title: 'newNoteTitle', text: 'newNoteText'})).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('.read(id)', () => {
    test('should return all notes when called with no arguments', async () => {
      const noteList = await notes.read();
      expect(noteList.length).toEqual(notes._data.array.length);
    });
    test('should return a note with a matching id if it exists', async () => {
      const note = await notes.read('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(note.title).toEqual('Test1');
      expect(note.text).toEqual('This is a test note.');
    });
    test('should throw an error if no id matches', async () => {
      await expect(notes.read(nilUuid)).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('.update(note)', () => {
    test('should replace the note matching that id if it exists', async () => {
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
    test("shouldn't change the size of the array", async () => {
      const replacementNote = {
        title: 'differentTitle',
        text: 'differentText',
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      const oldLength = notes._data.array.length;
      await notes.update(replacementNote);
      expect(notes._data.array.length).toEqual(oldLength);
    });
    test("should throw an error if id isn't matched", async () => {
      const invalidNote = {title: 'invalidNote', text: 'invalidText', id: nilUuid};
      await expect(notes.update(invalidNote)).rejects.toThrowErrorMatchingSnapshot();
    });
    test('should throw an error if the update is invalid', async () => {
      const invalidUpdate = {
        title: '',
        text: "this shouldn't work",
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      await expect(notes.update(invalidUpdate)).rejects.toThrowErrorMatchingSnapshot();
    });
    test('should throw an error if the write fails', async () => {
      const replacementNote = {
        title: 'differentTitle',
        text: 'differentText',
        id: '70a38567-e3e1-4c44-8777-86647acd5adf',
      };
      notes._data.writeShouldSucceed = false;
      await expect(notes.update(replacementNote)).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('.drop(id)', () => {
    test('should remove the note matching the id', async () => {
      await expect(notes.delete('70a38567-e3e1-4c44-8777-86647acd5adf')).resolves.toBeTruthy();
      await expect(notes.read('70a38567-e3e1-4c44-8777-86647acd5adf')).rejects.toThrowErrorMatchingSnapshot();
    });
    test('notes array should be one element shorter after dropping a note', async () => {
      const oldLength = notes._data.array.length;
      await notes.delete('70a38567-e3e1-4c44-8777-86647acd5adf');
      expect(notes._data.array.length).toEqual(oldLength - 1);
    });
    test("should throw an error if id isn't matched", async () => {
      await expect(notes.delete(nilUuid)).rejects.toThrowErrorMatchingSnapshot();
    });
    test('should throw an error if the write fails', async () => {
      notes._data.writeShouldSucceed = false;
      await expect(notes.delete('70a38567-e3e1-4c44-8777-86647acd5adf')).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
