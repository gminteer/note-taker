const {v4: uuid, validate: isValidUuid} = require('uuid');

const _data = require('./data');

const isNonEmptyString = (str) => str && typeof str === 'string';
const isValid = (note) => isNonEmptyString(note.title) && isNonEmptyString(note.text) && isValidUuid(note.id);

function getIndex(item) {
  for (let i = 0; i < _data.db.length; i++) if (_data.db[i].id === item.id) return i;
  return -1;
}

async function create(note) {
  note.id = uuid();
  if (!isValid(note)) return;
  _data.db.push(note);
  if (!(await _data.write())) return;
  console.debug(`New note: ${note.title} (${note.id})`);
  return note;
}

async function read(id = null) {
  if (!id) return _data.db;
  return _data.db.filter((item) => item.id === id);
}

async function update(note) {
  const index = getIndex(note);
  if (index < 0) return false;
  _data.db.splice(index, 1, note);
  if (!(await _data.write())) return;
  console.debug(`Updated note: ${note.title} (${note.id})`);
  return true;
}

async function drop(id) {
  const index = getIndex({id});
  if (index < 0) return false;
  _data.db.splice(index, 1);
  if (!(await _data.write())) return;
  console.debug(`Dropped note: (${id})`);
  return true;
}

module.exports = {_data, create, read, update, drop};
