const {v4: uuid, validate: isValidUuid} = require('uuid');

// const _data = require('./data');
const {NotesError} = require('./errors');

const isNonEmptyString = (str) => str && typeof str === 'string';
const isValid = (note) => isNonEmptyString(note.title) && isNonEmptyString(note.text) && isValidUuid(note.id);

class Notes {
  constructor(data) {
    this._data = data;
  }
  async read(id) {
    if (!id) return this._data.array;
    const item = this._data.array.find((item) => item.id === id);
    if (item) return item;
    else throw new NotesError('NOTE_NOT_FOUND');
  }
  async create(note = {}) {
    note.id = uuid();
    if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
    this._data.array.push(note);
    const err = await this._data.sync();
    if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
    return note;
  }
  async update(note) {
    const index = this._data.array.findIndex((item) => item.id === note.id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
    if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
    this._data.array.splice(index, 1, note);
    const notOk = await this._data.sync();
    if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
    return note;
  }
  async drop(id) {
    const index = this._data.array.findIndex((item) => item.id === id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
    this._data.array.splice(index, 1);
    const err = await this._data.sync();
    if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
    return true;
  }
}

module.exports = Notes;
