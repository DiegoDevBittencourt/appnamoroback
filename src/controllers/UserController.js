const aws = require('aws-sdk');
const { Op } = require("sequelize");

const User = require('../models/User');
const UserImage = require('../models/UserImage');
const Contact = require('../models/Contact');
const UserMatch = require('../models/UserMatch');
const messages = require('../helpers/messages');

const S3 = new aws.S3();//automagic this lib uses the credentials from .env file
const userAttributes = [
    'id',
    'oauthUId',
    'method',
    'firstName',
    'lastName',
    'email',
    'verifiedEmail',
    'emailNotification',
    'pushNotification',
    'birthday',
    'gender',
    'phone',
    'maxDistance',
    'searchingBy',
    'ageRange',
    'showMeOnApp',
    'profileComplete',
    'schooling',
    'company',
    'position',
    'about',
    'lastLongitude',
    'lastLatitude',
    'lastTimeSuperLikeWasUsed'
];

module.exports = {
    async getUser(req, res) {

        const { id } = req.params;

        try {
            User.findOne({

                attributes: userAttributes,
                where: { id },
                include: [{
                    model: UserImage,
                    required: false
                }]

            }).then((user) => {

                if (user) {
                    user.birthday = user.birthday.toString() !== 'Invalid Date' ? user.birthday : new Date();
                    return res.status(200).send(user);
                }
                else
                    return res.status(404).send('User not found');
            })
        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async insertUserImage(req, res) {
        if (req.file) {
            const { userId } = req.params;
            const { location: url = '', key: amazonImageKey } = req.file;

            try {
                const userImage = new UserImage();

                userImage.userId = userId;
                userImage.imageUrl = url;
                userImage.amazonImageKey = amazonImageKey;

                await UserImage.create(userImage.dataValues);
                return res.status(200).send('Success!');

            } catch (err) {
                return res.status(400).send(err);
            }
        }
    },

    async deleteUserImage(req, res) {
        const { id } = req.params;

        try {
            const userImage = await UserImage.findByPk(id);

            if (userImage) {

                await S3.deleteObject({
                    Bucket: process.env.AMAZON_BUCKET_NAME,
                    Key: userImage.amazonImageKey
                }).promise();

                await userImage.destroy();
                return res && res.status(200).send('Success!');
            }
            else
                return res.status(404).send('Not found');

        } catch (err) {
            return res && res.status(400).send(err);
        }
    },

    async unmatch(req, res) {
        const { userId, profileId } = req.body;

        try {
            const userMatch = await UserMatch.findOne({
                where: {
                    [Op.or]: [
                        { proposerUserId: profileId, accepterUserId: userId },
                        { proposerUserId: userId, accepterUserId: profileId }
                    ],
                }
            });

            if (userMatch) {
                await userMatch.destroy();
                return res.status(200).send('Success!');
            }
            else
                return res.status(404).send('Not found');

        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async updateUser(req, res) {

        const {
            id,
            firstName,
            lastName,
            email,
            verifiedEmail,
            emailVerificationToken,
            emailNotification,
            pushNotification,
            method,
            oauthUId,
            birthday,
            gender,
            phone,
            maxDistance,
            searchingBy,
            ageRange,
            showMeOnApp,
            profileComplete,
            schooling,
            company,
            position,
            about,
            lasLongitude,
            lastLatitude
        } = req.body.user;

        try {
            const user = await User.findOne({ where: { id } });

            user.firstName = firstName && firstName;
            user.lastName = lastName && lastName;
            user.email = email && email;
            user.verifiedEmail = verifiedEmail && verifiedEmail;
            user.emailVerificationToken = emailVerificationToken && emailVerificationToken;
            user.emailNotification = emailNotification && emailNotification;
            user.pushNotification = pushNotification && pushNotification;
            user.method = method && method;
            user.oauthUId = oauthUId && oauthUId;
            user.birthday = birthday && birthday;
            user.gender = gender && gender;
            user.phone = phone && phone;
            user.maxDistance = maxDistance && maxDistance;
            user.searchingBy = searchingBy && searchingBy;
            user.ageRange = ageRange && ageRange;
            user.showMeOnApp = showMeOnApp && showMeOnApp;
            user.profileComplete = profileComplete && profileComplete;
            user.schooling = schooling && schooling;
            user.company = company && company;
            user.position = position && position;
            user.about = about && about;
            user.lasLongitude = lasLongitude && lasLongitude;
            user.lastLatitude = lastLatitude && lastLatitude;

            await user.save();

            return res.status(200).send('Usuario atualizado com sucesso!');
        }
        catch (error) {
            res.status(400).send(messages.weFoundAnError + '\nRef: ' + error);
        }
    },

    async newUserContact(req, res) {
        try {
            const contact = req.body;

            await Contact.create(contact).then((e) => {
                return res.status(200).send('Contact successfully created!');
            });
        }
        catch (error) {
            res.status(400).send(messages.weFoundAnError + '\nRef: ' + error);
        }
    },

    async createOrUpdateUserMatch(req, res) {
        try {
            const { userId, profileId, superLike } = req.body;

            const userMatch = await UserMatch.findAll({
                where: {
                    [Op.or]: [
                        { proposerUserId: profileId, accepterUserId: userId },
                        { accepterUserId: profileId, proposerUserId: userId }
                    ]
                }
            });

            if (userMatch.length === 0) {

                superLike && User.update({ lastTimeSuperLikeWasUsed: new Date() },
                    { where: { id: userId } });

                UserMatch.create({
                    proposerUserId: userId,
                    accepterUserId: profileId,
                    proposerUserUsedSuperLike: superLike ? 1 : 0
                });

                res.status(200).send('userMatch successfully created!');
            }
            else {

                UserMatch.update({ bothAccepted: 1, updatedAt: new Date() }, {
                    where: {
                        [Op.or]: [
                            { proposerUserId: profileId, accepterUserId: userId },
                            { accepterUserId: profileId, proposerUserId: userId }
                        ]
                    }
                });

                res.status(200).send('you have a match!');
            }
        }
        catch (error) {
            res.status(400).send(messages.weFoundAnError + '\nRef: ' + error);
        }
    },

    async getMatchProfiles(req, res) {
        const { userId } = req.params;

        try {

            //stores all users that was matched with currently user
            const usersMatch = await UserMatch.findAll({
                where: {
                    bothAccepted: 1,
                    [Op.or]: { proposerUserId: userId, accepterUserId: userId }
                }
            });

            const usersIdsToSelect = usersMatch.map(item =>
                item.dataValues.proposerUserId === parseInt(userId) ?
                    item.dataValues.accepterUserId
                    :
                    item.dataValues.proposerUserId
            );

            await User.findAll({
                attributes: userAttributes,
                where: {
                    id: { [Op.in]: usersIdsToSelect },
                },
                include: [{
                    model: UserImage,
                    required: false
                }]
            }).then(users => {/*now I'm going to add the UserMatch property to the records... didn't added before
            cause sequelize has issues when dealing with a table associated with 2 FK. FUCK SEQUELIZE!*/

                UserMatch.findAll({
                    where: {
                        [Op.or]: [
                            { proposerUserId: userId, accepterUserId: { [Op.in]: usersIdsToSelect } },
                            { accepterUserId: userId, proposerUserId: { [Op.in]: usersIdsToSelect } }
                        ],
                    }
                }).then(userMatch => {

                    const usersHelper = users.map(user => ({
                        ...user.dataValues,
                        UserMatch: userMatch.filter(userMatch =>
                            user.id == userMatch.proposerUserId || user.id == userMatch.accepterUserId &&
                            userMatch.dataValues
                        )
                    }));

                    return res.status(200).send(usersHelper);
                });
            });

        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async getProfileToTheMatchSearcher(req, res) {
        const {
            currentlyLongitude: lng,
            currentlyLatitude: lat,
            maxDistance: distance,
            userId,
            alreadyDownloadedProfileIds,
            searchingBy,
            ageRange
        } = req.body;

        const now = new Date();//the 55 verification here is in case that the user select 55+, it will bring everyone higher than 55:
        const ageA = new Date(`${(now.getFullYear() - (ageRange[1] == 55 ? 120 : ageRange[1])).toString()}/${now.getMonth() + 1}/${now.getDate()}`)
        const ageB = new Date(`${(now.getFullYear() - ageRange[0]).toString()}/${now.getMonth() + 1}/${now.getDate()}`)

        try {
            //stores all userIds that was already liked by currently user to exclude then when search by profiles
            const usersMatch = await UserMatch.findAll({
                where: {
                    [Op.or]: { proposerUserId: userId, accepterUserId: userId }
                }
            });

            const usersToExclude = usersMatch.map(item =>
                item.dataValues.proposerUserId === userId ?
                    item.dataValues.accepterUserId//this profile already appear to the user
                    :
                    item.dataValues.bothAccepted === 1 &&//this means that the match was already done, so don't need to show the profile again
                    item.dataValues.proposerUserId
            );

            User.findOne({
                where: User.sequelize.and(
                    { id: { [Op.ne]: userId } },
                    { id: { [Op.notIn]: alreadyDownloadedProfileIds } },
                    { id: { [Op.notIn]: usersToExclude } },
                    { birthday: { [Op.between]: [ageA, ageB] } },
                    { showMeOnApp: 1 },
                    searchingBy != 2 && { gender: searchingBy },//2 means all
                    lat && lng && distance ? User.sequelize.where(
                        User.sequelize.literal(`
                        6371 * acos(cos(radians(${lat})) *
                        cos(radians(lastLatitude)) *
                        cos(radians(${lng}) -
                        radians(lastLongitude)) +
                        sin(radians(${lat})) *
                        sin(radians(lastLatitude))
                        )`), '<=',
                        distance === 500 ? 999999 : distance,
                    ) : null,
                ),
                include: [{
                    model: UserMatch, as: 'UserMatch',
                    where: {
                        /*if a userMatch exists, it will not be someone that the user already liked
                        (cause the idea is to hide profiles liked by the user), so it MUST be someone that
                        liked the user first, in this case, the user can only be the accepterUserId.
                        This is why the FK is accepterUserId and not proposerUserId*/
                        accepterUserId: userId
                    },
                    required: false
                },
                {
                    model: UserImage,
                    required: false
                }],
                order: User.sequelize.literal('rand()'),

            }).then((user) => {

                res.status(200).send({ user });
            })

        } catch (error) {
            res.status(400).send(messages.weFoundAnError + '\nRef: ' + error);
        }
    },
}
