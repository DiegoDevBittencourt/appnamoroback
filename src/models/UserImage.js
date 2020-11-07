const { Model, DataTypes } = require('sequelize')

class UserImage extends Model {
    static init(sequelize) {
        super.init({
            userId: DataTypes.INTEGER,
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
