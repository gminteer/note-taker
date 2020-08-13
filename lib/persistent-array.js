const fs = require('fs');

class PersistentArray {
  constructor(filename, array) {
    this.filename = filename;
    this.array = array;
  }
  static async build(filename) {
    if (!filename) throw new ReferenceError('no filename provided');
    let data;
    try {
      data = await fs.promises.readFile(filename);
    } catch (err) {
      if (err.code === 'ENOENT') data = [];
      else throw err;
    }
    return new PersistentArray(filename, data);
  }
  async write() {
    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(this.array, null, 2));
    } catch (err) {
      return err;
    }
  }
}

module.exports = PersistentArray;
