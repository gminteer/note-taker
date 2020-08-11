const {v4: uuid, validate: isValidUuid} = require('uuid');

const _data = require('./data');
const {NotesError} = require('./errors');

const isNonEmptyString = (str) => str && typeof str === 'string';
const isValid = (note) => isNonEmptyString(note.title) && isNonEmptyString(note.text) && isValidUuid(note.id);

function indexOf(id) {
  for (let i = 0; i < _data.db.length; i++) if (_data.db[i].id === id) return i;
  return -1;
}

async function create(note = {}) {
  note.id = uuid();
  if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
  _data.db.push(note);
  const err = await _data.write();
  if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
  return note;
}

async function read(id = null) {
  if (!id) return _data.db;
  const filtered = _data.db.filter((item) => item.id === id);
  if (filtered.length < 1) throw new NotesError('NOTE_NOT_FOUND');
  else return filtered;
}

async function update(note) {
  const index = indexOf(note.id);
  if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
  if (!isValid(note)) throw new NotesError('NOTE_FAILED_VALIDATION');
  _data.db.splice(index, 1, note);
  const notOk = await _data.write();
  if (notOk) throw new NotesError('NOTE_WRITE_ERROR', notOk);
  return note;
}

async function drop(id) {
  const index = indexOf(id);
  if (index < 0) throw new NotesError('NOTE_NOT_FOUND');
  _data.db.splice(index, 1);
  const err = await _data.write();
  if (err) throw new NotesError('NOTE_WRITE_ERROR', err);
  return true;
}

module.exports = {_data, create, read, update, drop};
