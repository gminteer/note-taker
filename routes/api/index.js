const path = require('path');
const router = require('express').Router();
const notes = require(path.join(__dirname, '../../lib/notes'));

// Read
router.get('/notes', async (req, res) => {
  try {
    res.json(await notes.read());
  } catch (err) {
    res.status(500).json(err);
  }
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
        case 'NOTE_NOT_FOUND': {
          res.sendStatus(404);
          break;
        }
        case 'NOTE_FAILED_VALIDATION': {
          res.sendStatus(400);
          break;
        }
        default: {
          res.status(500).json(err);
          break;
        }
      }
    }
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    await notes.drop(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    if (err.code === 'NOTE_NOT_FOUND') res.sendStatus(404);
    else res.status(500).json(err);
  }
});

module.exports = router;
