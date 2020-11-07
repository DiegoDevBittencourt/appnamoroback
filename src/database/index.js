const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig');
const connection = new Sequelize(dbConfig);

const User = require('../models/User');
const Contact = require('../models/Contact');
const UserImage = require('../models/UserImage');
const UserMatch = require('../models/UserMatch');

User.init(connection);
Contact.init(connection);
UserImage.init(connection);
UserMatch.init(connection);

User.associate(connection.models);

module.exports = connection;
