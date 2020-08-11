const path = require('path');
const router = require('express').Router();
const notes = require(path.join(__basedir, 'lib/notes'));

router.get('/notes', async (req, res) => {
  res.json(await notes.read());
});
router.get('/notes/:id', async (req, res) => {
  const result = await notes.read(req.params.id);
  if (result.length > 0) res.json(result);
  else res.sendStatus(404);
});

router.post('/notes', async (req, res) => {
  const note = await notes.create(req.body);
  if (note) res.json(note);
  else res.sendStatus(400);
});

router.post('/notes/:id', async (req, res) => {
  const ok = await notes.update(req.body);
  if (ok) res.status(200).send(req.body);
  else res.sendStatus(400);
});

router.delete('/notes/:id', async (req, res) => {
  const ok = await notes.drop(req.params.id);
  if (ok) res.sendStatus(204);
  else res.sendStatus(400);
});
module.exports = router;
