'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'lastTimeSuperLikeWasUsed', {
        type: Sequelize.DATE,
        allowNull: true
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'lastTimeSuperLikeWasUsed');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
