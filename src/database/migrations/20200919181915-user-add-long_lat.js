'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'lastLongitude', {
        type: Sequelize.DECIMAL(10,6),
        allowNull: true
      });
      await queryInterface.addColumn('users', 'lastLatitude', {
        type: Sequelize.DECIMAL(10,6),
        allowNull: true
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'lastLongitude');
      await queryInterface.removeColumn('users', 'lastLatitude');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
