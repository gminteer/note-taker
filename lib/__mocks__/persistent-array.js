const mock = jest.fn().mockImplementation(() => {
  return {
    array: [],
    writeShouldSucceed: true,
    write: async function () {
      return new Promise((resolve, reject) => {
        const fakeError = new Error();
        fakeError.code = 'EMOCKERROR';
        return setTimeout(() => (this.writeShouldSucceed ? resolve() : resolve(fakeError), 25));
      });
    },
  };
});

module.exports = mock;
