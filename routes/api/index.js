const path = require('path');
const router = require('express').Router();
const notes = require(path.join(__basedir, 'lib/notes'));

router.get('/notes', async (req, res) => {
  try {
    res.json(await notes.read());
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get('/notes/:id', async (req, res) => {
  try {
    res.json(await notes.read(req.params.id));
  } catch (err) {
    if (err.type === 'notFound') res.sendStatus(404);
    else res.status(500).send(err);
  }
});

router.post('/notes', async (req, res) => {
  try {
    res.json(await notes.create(req.body));
  } catch (err) {
    if (err.type === 'failedValidation') res.sendStatus(400);
    else res.status(500).send(err);
  }
});

router.post('/notes/:id', async (req, res) => {
  try {
    res.send(await notes.update(req.body));
  } catch (err) {
    if (err.type) {
      switch (err.type) {
        case 'notFound': {
          res.sendStatus(404);
          break;
        }
        case 'failedValidation': {
          res.sendStatus(400);
          break;
        }
        default: {
          res.status(500).send(err);
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
    if (err.type === 'notFound') res.sendStatus(404);
    else res.status(500).send(err);
  }
});
module.exports = router;
