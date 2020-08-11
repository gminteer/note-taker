const db = require('../db/db');
const fs = require('fs').promises;

async function write() {
  try {
    await fs.writeFile('../db/db.json', JSON.stringify(db, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return;
  }
}

module.exports = {db, write};
