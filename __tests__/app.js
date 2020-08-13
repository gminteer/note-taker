/* global shouldBeFound:writable, shouldValidate:writable, writeShouldSucceed:writable */
// using globals since I don't think there's an easy way to grab a reference to the mock Notes object the app has.
const request = require('supertest');

jest.mock('../lib/notes');
// eslint-disable-next-line no-unused-vars
const Notes = require('../lib/notes');
const app = require('../app');

beforeEach(() => {
  shouldBeFound = true;
  shouldValidate = true;
  writeShouldSucceed = true;
});

// API routes

describe('GET /api/notes', () => {
  test('should respond 200 with body containing notes array', async () => {
    const response = await request(app).get('/api/notes').expect(200);
    expect(response.body).toEqual([
      {title: 'testNote1', text: 'testText1', id: 0},
      {title: 'testNote2', text: 'testText2', id: 1},
      {title: 'testNote3', text: 'testText3', id: 2},
    ]);
  });
});

describe('GET /api/notes/:id', () => {
  test('should respond 200 with body containing a note if found on success', async () => {
    const response = await request(app).get('/api/notes/test').expect(200);
    expect(response.body).toEqual({title: 'testNote1', text: 'testText1', id: 0});
  });
  test('should respond 404 if not found', async () => {
    shouldBeFound = false;
    await request(app).get('/api/notes/test').expect(404);
  });
  test('should respond 500 if anything else goes wrong', async () => {
    writeShouldSucceed = false;
    await request(app).get('/api/notes/test').expect(500);
  });
});

describe('POST /api/notes', () => {
  test('should respond 201 with location header and body containing created note on success', async () => {
    const response = await request(app).post('/api/notes').send({test: 'test'}).expect(201);
    expect(response.header.location).toEqual('./0');
    expect(response.body).toEqual({test: 'test', id: 0});
  });
  test('should respond 400 if body fails validation', async () => {
    shouldValidate = false;
    await request(app).post('/api/notes').send({test: 'test'}).expect(400);
  });
  test('should respond 500 if write fails', async () => {
    writeShouldSucceed = false;
    await request(app).post('/api/notes').send({test: 'test'}).expect(500);
  });
});

describe('PUT /api/notes/:id', () => {
  test('should respond 200 with body containing updated note on success', async () => {
    const response = await request(app).put('/api/notes/test').send({test: 'test'}).expect(200);
    expect(response.body).toEqual({test: 'test'});
  });
  test('should respond 400 if body fails validation', async () => {
    shouldValidate = false;
    await request(app).put('/api/notes/test').send({test: 'test'}).expect(400);
  });
  test('should respond 404 if not found', async () => {
    shouldBeFound = false;
    await request(app).put('/api/notes/test').send({test: 'test'}).expect(404);
  });
  test('should respond 500 if write fails', async () => {
    writeShouldSucceed = false;
    await request(app).put('/api/notes/test').send({test: 'test'}).expect(500);
  });
});

describe('DELETE /api/notes/:id', () => {
  test('should respond 204 on success', async () => {
    await request(app).delete('/api/notes/test').expect(204);
  });
  test('should respond 404 if not found', async () => {
    shouldBeFound = false;
    await request(app).delete('/api/notes/test').expect(404);
  });
  test('should respond 500 if write fails', async () => {
    writeShouldSucceed = false;
    await request(app).delete('/api/notes/test').expect(500);
  });
});

// HTML routes
describe('GET /', () => {
  test('should respond 200', async () => {
    await request(app).get('/').expect(200);
  });
});
describe('GET /notes', () => {
  test('should respond 200', async () => {
    await request(app).get('/notes').expect(200);
  });
});
