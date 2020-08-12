const mock = jest.fn().mockImplementation(() => {
  return {
    array: [],
    writeShouldSucceed: true,
    sync: async function () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        const fakeError = new Error();
        fakeError.code = 'EMOCKERROR';
        return setTimeout(() => (this.writeShouldSucceed ? resolve() : resolve(fakeError), 25));
      });
    },
  };
});

module.exports = mock;
