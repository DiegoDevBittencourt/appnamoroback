const { Model, DataTypes } = require('sequelize')

class UserImage extends Model {
    static init(sequelize) {
        super.init({
            id: { type: DataTypes.STRING, primaryKey: true },
            userId: DataTypes.STRING,
            imageUrl: DataTypes.STRING,
            amazonImageKey: DataTypes.STRING
        }, {
            sequelize,//conexão
            tableName: 'userImage',
            underscored: false
        })
    }
}

module.exports = UserImage;
