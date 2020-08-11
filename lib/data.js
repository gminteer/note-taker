const fs = require('fs').promises;
const FILENAME = require('path').join('db/db.json');

let db = [];

async function write() {
  try {
    await fs.writeFile(FILENAME, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error(err);
    return err;
  }
}
(async () => {
  try {
    db = JSON.parse(await fs.readFile(FILENAME));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
})();

module.exports = {db, write};
