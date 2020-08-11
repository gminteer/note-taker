const fs = require('fs').promises;
const path = require('path');
const db = require('../db/db');

async function write() {
  try {
    await fs.writeFile(path.join(__basedir, 'db/db.json'), JSON.stringify(db, null, 2));
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = {db, write};
