var  { exec }  = require('child_process');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  const { domain } = req.query;
  if (domain) {
    exec(`nslookup ${domain}`, (error, stdout, stderr) => {
      if (error) {
        res.send({ error: error.message || `${error}` });
      } else if (stderr) {
        res.send({ stderr });
      } else {
        res.send({ stdout });
      }
    });
  } else {
    res.send('No domain specified');
  }
});

module.exports = router;
