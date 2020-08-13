const {v4: uuid, validate: isValidUuid} = require('uuid');

const {NotesError} = require('./errors');

const isNonEmptyString = (str) => str && typeof str === 'string';

function validator(note) {
  if (!isValidUuid(note.id)) throw new NotesError('NOTE_INVALID_ID', {id: note.id});
  const errors = [];
  if (!isNonEmptyString(note.title)) errors.push(' title cannot be blank');
  if (!isNonEmptyString(note.text)) errors.push(' text cannot be blank');
  if (errors.length > 0)
    throw new NotesError('NOTE_FAILED_VALIDATION', note, `suggested note does not validate:${errors.toString()}`);
}

class Notes {
  constructor(data) {
    this._data = data;
  }
  async read(id) {
    if (this._data instanceof Promise) this._data = await this._data;
    if (!id) return this._data.array;
    const item = this._data.array.find((item) => item.id === id);
    if (item) {
      if (!isValidUuid(id)) throw new NotesError('NOTE_INVALID_ID', {id});
      return item;
    } else {
      throw new NotesError('NOTE_NOT_FOUND', {id});
    }
  }
  async create(note = {}) {
    note.id = uuid();
    validator(note);
    this._data.array.push(note);
    const notOk = await this._data.write();
    if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
    return note;
  }
  async update(note) {
    const index = this._data.array.findIndex((item) => item.id === note.id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND', note);
    validator(note);
    this._data.array.splice(index, 1, note);
    const notOk = await this._data.write();
    if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
    return note;
  }
  async delete(id) {
    const index = this._data.array.findIndex((item) => item.id === id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND', {id});
    if (!isValidUuid(id)) throw new NotesError('NOTE_INVALID_ID', {id});
    this._data.array.splice(index, 1);
    const notOk = await this._data.write();
    if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
    return true;
  }
}

module.exports = Notes;
