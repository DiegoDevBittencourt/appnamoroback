const { Model, DataTypes } = require('sequelize')

class User extends Model {
    static init(sequelize) {
        super.init({
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            verifiedEmail: DataTypes.INTEGER,
            emailVerificationToken: DataTypes.STRING,
            emailNotification: DataTypes.INTEGER,
            pushNotification: DataTypes.INTEGER,
            method: DataTypes.STRING,
            password: DataTypes.STRING,
            oauthUId: DataTypes.STRING,
            birthday: DataTypes.DATE,
            gender: DataTypes.INTEGER,
            phone: DataTypes.STRING,
            maxDistance: DataTypes.INTEGER,
            searchingBy: DataTypes.INTEGER,
            ageRange: DataTypes.STRING,
            showMeOnApp: DataTypes.INTEGER,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE,
            profileComplete: DataTypes.INTEGER,
            schooling: DataTypes.INTEGER,
            company: DataTypes.STRING,
            position: DataTypes.STRING,
            about: DataTypes.STRING,
            lastLongitude: DataTypes.DECIMAL(10, 6),
            lastLatitude: DataTypes.DECIMAL(10, 6),
            lastTimeSuperLikeWasUsed: DataTypes.DATE,
        }, {
            sequelize,//conexão
            tableName: 'users',
            underscored: false
        })
    }

    static associate(models) {
        this.hasMany(models.UserMatch, { foreignKey: 'proposerUserId', as: 'matchInfo' });
        this.hasMany(models.UserImage, { foreignKey: 'userId', as: 'userImages' });
    }
}

module.exports = User;
