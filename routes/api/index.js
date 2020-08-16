function errorHandler(err, res) {
  switch (err.code) {
    case 'NOTE_NOT_FOUND':
      return res.sendStatus(404);
    case 'NOTE_FAILED_VALIDATION':
      return res.set('Content-Type', 'text/plain').status(400).send(err.message);
    case 'NOTE_WRITE_ERROR':
    case 'NOTE_INVALID_ID':
    case 'NOTE_INIT_ERROR':
      return res.set('Content-Type', 'text/plain').status(500).send(err.message);
  }
  if (process.env.NODE_ENV !== 'production') return res.status(500).json(err);
  else return res.sendStatus(500);
}

function buildApiRoutes(notes) {
  const router = require('express').Router();

  // Read
  router.get('/notes', async (req, res) => {
    try {
      res.json(await notes.read());
    } catch (err) {
      errorHandler(err, res);
    }
  });
  router.get('/notes/:id', async (req, res) => {
    try {
      res.json(await notes.read(req.params.id));
    } catch (err) {
      errorHandler(err, res);
    }
  });

  // Create
  router.post('/notes', async (req, res) => {
    try {
      const note = await notes.create(req.body);
      res.append('Location', `notes/${note.id}`).status(201).json(note);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  // Update
  router.put('/notes/:id', async (req, res) => {
    try {
      res.send(await notes.update(req.body));
    } catch (err) {
      errorHandler(err, res);
    }
  });

  // Delete
  router.delete('/notes/:id', async (req, res) => {
    try {
      await notes.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      errorHandler(err, res);
    }
  });
  return router;
}

module.exports = buildApiRoutes;
