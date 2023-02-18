const { Model, DataTypes } = require('sequelize')

class Contact extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            subject: DataTypes.STRING,
            message: DataTypes.STRING(8000)
        }, {
            sequelize,//conexão
            tableName: 'contact',
            underscored: false
        })
    }
}

module.exports = Contact;
