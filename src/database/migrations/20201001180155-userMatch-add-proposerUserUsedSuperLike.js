'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('userMatch', 'proposerUserUsedSuperLike', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('userMatch', 'proposerUserUsedSuperLike');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
