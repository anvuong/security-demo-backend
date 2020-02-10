const { QueryTypes } = require('sequelize');
var models  = require('../models');
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
