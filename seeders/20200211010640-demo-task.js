'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [{
      title: 'task1_user1',
      UserId: '1',
    },{
      title: 'task2_user1',
      UserId: '1',
    },{
      title: 'task3_user1',
      UserId: '1',
    },{
      title: 'task1_user2',
      UserId: '2',
    },{
      title: 'task2_user2',
      UserId: '2',
    },{
      title: 'task3_user2',
      UserId: '2',
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
