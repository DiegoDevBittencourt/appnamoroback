const { Model, DataTypes } = require('sequelize')

class UserMatch extends Model {
    static init(sequelize) {
        super.init({
            proposerUserId: {
                type: DataTypes.STRING,
                //references: "users",
                //referencesKey: "id",
                primaryKey: true
            },
            accepterUserId: {
                type: DataTypes.STRING,
                //references: "users",
                //referencesKey: "id",
                primaryKey: true
            },
            bothAccepted: DataTypes.INTEGER,
            proposerUserUsedSuperLike: DataTypes.INTEGER,
        }, {
            sequelize,//conexão
            tableName: 'userMatch',
            underscored: false
        })
    }
}

module.exports = UserMatch;
