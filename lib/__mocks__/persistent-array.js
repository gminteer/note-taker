const mock = jest.fn().mockImplementation(() => {
  return {
    array: [],
    writeShouldSucceed: true,
    sync: async function () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return setTimeout(() => (this.writeShouldSucceed ? resolve() : resolve(new Error()), 25));
      });
    },
  };
});

module.exports = mock;
