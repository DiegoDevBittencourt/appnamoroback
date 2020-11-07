'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      oauthUId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifiedEmail: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      emailVerificationToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailNotification: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pushNotification: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passwordResetExpires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      maxDistance: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      searchingBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ageRange: {
        type: Sequelize.STRING,
        allowNull: false
      },
      showMeOnApp: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      profileComplete: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      about: {
        type: Sequelize.STRING(8000),
        allowNull: true
      },
      schooling: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true
      },
      position: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deletedAccount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
