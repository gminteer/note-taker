const {v4: uuid, validate: isValidUuid} = require('uuid');

const _data = require('./data');
const {NotesError} = require('./errors');

const isNonEmptyString = (str) => str && typeof str === 'string';
const isValid = (note) => isNonEmptyString(note.title) && isNonEmptyString(note.text) && isValidUuid(note.id);

function getIndex(item) {
  for (let i = 0; i < _data.db.length; i++) if (_data.db[i].id === item.id) return i;
  return -1;
}

async function create(note = {}) {
  note.id = uuid();
  if (!isValid(note)) throw new NotesError('failedValidation');
  _data.db.push(note);
  const err = await _data.write();
  if (err) throw new NotesError('writeError', err);
  console.debug(`New note: ${note.title} (${note.id})`);
  return note;
}

async function read(id = null) {
  if (!id) return _data.db;
  const filtered = _data.db.filter((item) => item.id === id);
  if (filtered.length < 1) throw new NotesError('notFound');
  else return filtered;
}

async function update(note) {
  const index = getIndex(note);
  if (index < 0) throw new NotesError('notFound');
  if (!isValid(note)) throw new NotesError('failedValidation');
  _data.db.splice(index, 1, note);
  const notOk = await _data.write();
  if (notOk) throw new NotesError('writeError', notOk);
  console.debug(`Updated note: ${note.title} (${note.id})`);
  return note;
}

async function drop(id) {
  const index = getIndex({id});
  if (index < 0) throw new NotesError('notFound');
  _data.db.splice(index, 1);
  const err = await _data.write();
  if (err) throw new NotesError('writeError', err);
  console.debug(`Dropped note: (${id})`);
  return true;
}

module.exports = {_data, create, read, update, drop};
