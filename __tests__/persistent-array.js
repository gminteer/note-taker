const PersistentArray = require('../lib/persistent-array');
const fs = require('fs');

describe('PersistentArray', () => {
  test('.build(filename) should throw an error if no filename is provided', async () => {
    await expect(PersistentArray.build()).rejects.toThrow();
  });
  test(".build(filename) should provide an empty array if the filename provided doesn't exist", async () => {
    const notFound = new Error();
    notFound.code = 'ENOENT';
    const spy = jest.spyOn(fs.promises, 'readFile').mockImplementation(() => Promise.reject(notFound));
    await expect(PersistentArray.build('test')).resolves.toEqual(new PersistentArray('test', []));
    spy.mockRestore();
  });
  test('.build(filename) should throw an error on any other error', async () => {
    const fakeError = new Error();
    fakeError.code = 'EMOCKERROR';
    const spy = jest.spyOn(fs.promises, 'readFile').mockImplementation(() => Promise.reject(fakeError));
    await expect(PersistentArray.build('test')).rejects.toThrow();
  });
  test('.write() should return falsy on success', async () => {
    const spy = jest.spyOn(fs.promises, 'writeFile').mockImplementation(() => Promise.resolve());
    const testArray = new PersistentArray('test', []);
    await expect(testArray.write()).resolves.toBeFalsy();
    spy.mockRestore();
  });
  test('.write() should return an error if it caught one', async () => {
    const testError = new Error('testError');
    const testArray = new PersistentArray('test', []);
    const spy = jest.spyOn(fs.promises, 'writeFile').mockImplementation(() => Promise.reject(testError));
    await expect(testArray.write()).resolves.toBe(testError);
    spy.mockRestore();
  });
});
