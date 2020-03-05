const { QueryTypes } = require('sequelize');
var HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var models  = require('../models');
var config = require('../config/config');
var { auth } = require('../middlewares/auth');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/destroy', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.set('X-Frame-Options', 'SAMEORIGIN').render('login');
});

router.get('/search', auth, function(req, res) {
  const { name } = req.query;
  models.User.findAll({
    where: {
      username: {
        [models.Sequelize.Op.like]: `${name}%`,
      },
    },
    attributes: ['id', 'username', 'createdAt'],
  }).then(function(users) {
    res.render('search-users', {
      title: `Users whose username starts with ${name}`,
      users,
    });
  });
});

router.get('/:user_id', function(req, res, next) {
  models.sequelize.query('SELECT username, u.createdAt FROM `Users` u WHERE id = \'' + req.params.user_id + '\'', {
    type: QueryTypes.SELECT,
  }).then(function(users) {
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
    if (user) {
      res.json(user);
    } else {
      res.send('No user found!');
    }
  }).catch(function(error) {
    next(error);
  });

  // Prevent SQL injection by escaping user's input before inserting it into the query. (using "replacements" in sequelize)
  // ※ https://sequelize.org/master/manual/raw-queries.html
  // models.sequelize.query('SELECT username, u.createdAt FROM `Users` u WHERE id = :userId', {
  //   replacements: { userId: req.params.user_id },
  //   type: QueryTypes.SELECT,
  // }).then(function(users) {
  //   const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
  //   if (user) {
  //     res.json(user);
  //   } else {
  //     res.send('No user found!');
  //   }
  // }).catch(function(error) {
  //   next(error);
  // });

  // Prevent SQL injection by using prepared statement. (using "bind" in sequelize)
  // ※ https://sequelize.org/master/manual/raw-queries.html
  // models.sequelize.query('SELECT username, u.createdAt FROM `Users` u WHERE id = $1', {
  //   bind: [req.params.user_id],
  //   type: QueryTypes.SELECT,
  // }).then(function(users) {
  //   const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
  //   if (user) {
  //     res.json(user);
  //   } else {
  //     res.send('No user found!');
  //   }
  // }).catch(function(error) {
  //   next(error);
  // });

  // Prevent SQL injection by using data mapper pattern, without writing any SQL codes
  // models.User.findByPk(req.params.user_id, {
  //   attributes: ['username', 'createdAt']
  // }).then(user => {
  //   if (user) {
  //     res.json(user);
  //   } else {
  //     res.send('No user found!');
  //   }
  // });
});

router.post('/login', function (req, res, next) {
  models.sequelize.query('SELECT id, username, "createdAt" FROM `Users` WHERE username = \'' + req.body.username + '\' AND password = \'' + req.body.password + '\'', {
    type: QueryTypes.SELECT,
  }).then(function(users) {
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
    if (user) {
      const expireTimeInSec = 3600; // 1 hour
      jwt.sign(user, config.tokenSecretKey, { algorithm: 'HS256', expiresIn: expireTimeInSec }, function(err, token) {
        if (err) {
          console.log(JSON.stringify({ user, err }, null, 2));
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Could not generate token');
        } else {
          res.cookie('token', token, { maxAge: expireTimeInSec * 1000 }).send({ token });
        }
      });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send('Login failed');
    }
  }).catch(function(error) {
    next(error);
  });
});

router.post('/:user_id/tasks/create', function (req, res) {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
