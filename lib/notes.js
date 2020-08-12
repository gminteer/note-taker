const {v4: uuid, validate: isValidUuid} = require('uuid');

const _data = require('./data');
const {NotesError} = require('./errors');

const isNonEmptyString = (str) => str && typeof str === 'string';
const isValid = (note) => isNonEmptyString(note.title) && isNonEmptyString(note.text) && isValidUuid(note.id);

class Notes {
  constructor() {
    this._data = _data;
  }
  async read(id = null) {
    if (!id) return _data.db;
    const item = _data.db.find((item) => item.id === id);
    if (item) return item;
    else throw new NotesError('NOTE_NOT_FOUND');
  }
  async create(note = {}) {
    note.id = uuid();
    if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
    _data.db.push(note);
    const err = await _data.write();
    if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
    return note;
  }
  async update(note) {
    const index = _data.db.findIndex((item) => item.id === note.id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
    if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
    _data.db.splice(index, 1, note);
    const notOk = await _data.write();
    if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
    return note;
  }
  async drop(id) {
    const index = _data.db.findIndex((item) => item.id === id);
    if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
    _data.db.splice(index, 1);
    const err = await _data.write();
    if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
    return true;
  }
}

module.exports = Notes;
