const mockObject = {
  db: [],
  writeShouldSucceed: true,
  async write() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return setTimeout(() => (this.writeShouldSucceed ? resolve() : resolve(new Error()), 50));
    });
  },
};

module.exports = mockObject;
