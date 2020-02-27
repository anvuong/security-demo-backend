var  { exec, spawn }  = require('child_process');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  const { domain } = req.query;
  if (domain) {
    // Use "spawn" to execute command to prevent code execution vulnerability, because "domain" is considered as the parameter of the command
    const lookupProcess = spawn('nslookup', [domain]);
    lookupProcess.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    lookupProcess.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    lookupProcess.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    lookupProcess.on('close', code => {
      console.log(`child process exited with code ${code}`);
      // Using "exec" to execute command makes a vulnerability for an attacker to use command execution againts the system, by specifying arbitrary commands in "domain"
      exec(`nslookup ${domain}`, (error, stdout, stderr) => {
        if (error) {
          res.send({ error: error.message || `${error}` });
        } else if (stderr) {
          res.send({ stderr });
        } else {
          res.send({ stdout });
        }
      });
    });
  } else {
    res.send('No domain specified');
  }
});

module.exports = router;
