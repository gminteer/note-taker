const path = require('path');
const router = require('express').Router();

// don't actually need to set a route for '/' because there's a static 'public/index.html' that express is serving as webroot
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/notes.html'));
});

module.exports = router;
