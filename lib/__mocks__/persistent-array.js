const mock = jest.fn().mockImplementation((array) => {
  return {
    array,
    writeShouldSucceed: true,
    write: async function () {
      return new Promise((resolve) => {
        const fakeError = new Error();
        fakeError.code = 'EMOCKERROR';
        return setTimeout(() => (this.writeShouldSucceed ? resolve() : resolve(fakeError), 25));
      });
    },
  };
});

module.exports = mock;
