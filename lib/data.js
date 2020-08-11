const fs = require('fs');
const FILENAME = require('path').join(__basedir, 'db/db.json');

let db = [];

async function write() {
  try {
    await fs.writeFile(FILENAME, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error(err);
    return err;
  }
}

try {
  db = JSON.parse(fs.readFileSync(FILENAME));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

module.exports = {db, write};
