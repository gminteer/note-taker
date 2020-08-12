const fs = require('fs');

class PersistentArray {
  constructor(filename, array) {
    this.filename = filename;
    this.array = array;
  }
  static async build(filename) {
    if (!filename) throw new TypeError('need a filename');
    return new PersistentArray(filename, JSON.parse(await fs.promises.readFile(filename)));
  }
  async sync() {
    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(this.array, null, 2));
    } catch (err) {
      return err;
    }
  }
}

module.exports = PersistentArray;
