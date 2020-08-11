const db = require('../db/db');
const fs = require('fs').promises;
const path = require('path');

async function write() {
  try {
    await fs.writeFile(path.join(__basedir, 'db/db.json'), JSON.stringify(db, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return;
  }
}

module.exports = {db, write};
