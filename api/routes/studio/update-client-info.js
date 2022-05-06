const models = require('@dibs-tech/models');

async function updateClientInfo(req, res) {
    let errormsg;
    try {
        let count = 1;
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
        console.log(`console ${count}`);
        count += 1;
        if (!user) {
            errormsg = 'user not found';
            return res.status(200).send({
                msg: 'Unable to update',
                error: errormsg
            });
        }
        if (email) {
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
            console.log(`console ${count}`);
            count += 1;
            if (bademail) {
                errormsg = `email is already in use`;
                const nameofuser = `${bademail.firstName} ${bademail.lastName}`;
                // errormsg = `This email address is already in use within Dibs network.${multilinebreak}Name: ${bademail.firstName} ${bademail.lastName}\nEmail:${bademail.email} <br><br>${multilinebreak}Navigate to their existing account by searching for their email address. If the account does not yet exist on your system, you can port the account by creating a new account using this email address. That will automatically transfer all of the client's information.`;
                return res.status(200).send({
                    msg: 'Unable to update',
                    error: errormsg,
                    nameofuser
                });
            }
        }
        if (phone) {
            console.log(`\n\n\n\n\n\napi call was made to updateClientInfo with phone = ${phone}`);
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
            console.log(`console ${count}`);
            count += 1;
            const phonetotest = `1${phone}`;
            const badphoneWithOne = await models.dibs_user.findOne(
                {
                    where: {
                        mobilephone: phonetotest,
                        id: {
                            [models.Sequelize.Op.ne]: userid
                        }
                    }
                },
                {
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }
            );
            console.log(`\n\n\nbadphone = ${JSON.stringify(badphoneWithOne)}`);
            console.log(`\n\n\nbadphoneWithOne = ${JSON.stringify(badphoneWithOne)}`);
            if (badphone) {
                console.log(`console ${count}`);
                count += 1;
                errormsg = `Phone number ${badphone.mobilephone} is already in use by another client (${badphone.firstName} ${badphone.lastName}) in the Dibs network and cannot be attached to this account.`;
                const nameofuser = `${badphone.firstName} ${badphone.lastName}`;
                const emailofuser = `${badphone.email}`;
                return res.status(200).send({
                    msg: 'Unable to update',
                    error: errormsg,
                    errorType: 'phone',
                    nameofuser,
                    emailofuser
                });
            }
            console.log(`console ${count}`);
            count += 1;
            if (badphoneWithOne) {
                console.log(`badphonewithone - inside of this if statement ${badphoneWithOne.firstName}`);
                errormsg = `Phone number ${badphoneWithOne.mobilephone} is already in use by another client (${badphoneWithOne.firstName} ${badphoneWithOne.lastName}) in the Dibs network and cannot be attached to this account.`;
                const nameofuser = `${badphoneWithOne.firstName} ${badphoneWithOne.lastName}`;
                const emailofuser = `${badphoneWithOne.email}`;
                return res.status(200).send({
                    msg: 'Unable to update',
                    error: errormsg,
                    errorType: 'phone',
                    nameofuser,
                    emailofuser
                });
            }
            console.log(`console ${count}`);
            count += 1;
        }
        if (user) {
            if (email) user.email = email;
            if (name) user.name = name;
            if (phone) user.mobilephone = phone;
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
