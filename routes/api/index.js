const router = require('express').Router();
const path = require('path');

const Notes = require('../../lib/notes');
const PersistentArray = require('../../lib/persistent-array');

const isReady = (async () => {
  // Setting up the routes is wrapped in an async IIFE to avoid reading in the JSON file synchronously
  const data = await PersistentArray.build(path.join(__dirname, '../../db/db.json'));
  const notes = new Notes(data);

  // Read
  router.get('/notes', async (req, res) => {
    res.json(await notes.read());
  });
  router.get('/notes/:id', async (req, res) => {
    try {
      res.json(await notes.read(req.params.id));
    } catch (err) {
      if (err.code === 'NOTE_NOT_FOUND') res.sendStatus(404);
      else res.status(500).json(err);
    }
  });

  // Create
  router.post('/notes', async (req, res) => {
    try {
      const note = await notes.create(req.body);
      res.append('Location', `/notes/${note.id}`);
      res.status(201).json(note);
    } catch (err) {
      if (err.code === 'NOTE_FAILED_VALIDATION') res.sendStatus(400);
      else res.status(500).json(err);
    }
  });

  // Update
  router.put('/notes/:id', async (req, res) => {
    try {
      res.send(await notes.update(req.body));
    } catch (err) {
      if (err.code) {
        switch (err.code) {
          case 'NOTE_NOT_FOUND':
            return res.sendStatus(404);
          case 'NOTE_FAILED_VALIDATION':
            return res.sendStatus(400);
        }
      }
      return res.status(500).json(err);
    }
  });

  // Delete
  router.delete('/notes/:id', async (req, res) => {
    try {
      await notes.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      if (err.code === 'NOTE_NOT_FOUND') res.sendStatus(404);
      else res.status(500).json(err);
    }
  });
  return true;
})();

module.exports = {router, isReady};
