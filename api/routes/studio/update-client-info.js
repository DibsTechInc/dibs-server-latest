const models = require('@dibs-tech/models');

async function updateClientInfo(req, res) {
    let errormsg;
    try {
        const { userid, birthday, email, name, phone } = req.body;
        console.log(`req.body = ${JSON.stringify(req.body)}`);
        const user = await models.dibs_user.findOne(
            {
                where: {
                    id: userid,
                    deletedAt: null
                }
            },
            {
                attributes: ['id', 'email', 'name', 'phone', 'birthday']
            }
        );
        if (!user) {
            errormsg = 'user not found';
            return res.status(200).send({
                msg: 'Unable to update',
                error: errormsg
            });
        }
        const bademail = await models.dibs_user.findOne(
            {
                where: {
                    email,
                    id: {
                        [models.Sequelize.Op.ne]: userid
                    }
                }
            },
            {
                attributes: ['id', 'email', 'firstName', 'lastName']
            }
        );
        if (bademail) {
            errormsg = `Email ${bademail.email} is already in use by another client (${bademail.firstName} ${bademail.lastName}) in the Dibs network. You have 2 options: 1) Create a new account using the same email address to port them into your system OR 2) Choose a different email address.`;
            return res.status(200).send({
                msg: 'Unable to update',
                error: errormsg
            });
        }
        const badphone = await models.dibs_user.findOne(
            {
                where: {
                    mobilephone: phone,
                    id: {
                        [models.Sequelize.Op.ne]: userid
                    }
                }
            },
            {
                attributes: ['id', 'email', 'firstName', 'lastName']
            }
        );
        if (badphone) {
            errormsg = `Phone number ${badphone.phone} is already in use by another client (${badphone.firstName} ${badphone.lastName}) in the Dibs network and cannot be attached to this account.`;
            return res.status(200).send({
                msg: 'Unable to update',
                error: errormsg
            });
        }
        if (user) {
            if (email) user.email = email;
            if (name) user.name = name;
            if (phone) user.phone = phone;
            if (birthday) user.birthday = birthday;
            await user.save();
            return res.status(200).send({
                msg: 'success'
            });
        }
        return res.status(200).send({
            msg: 'Unable to update',
            error: errormsg
        });
    } catch (err) {
        console.log(`\n\n\n\nerror in updateClientInfo api call: ${err}`);
        console.log(errormsg);
        return res.status(400).send({
            msg: 'Unable to update client information',
            error: errormsg
        });
    }
}

module.exports = updateClientInfo;
