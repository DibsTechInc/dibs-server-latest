const models = require('@dibs-tech/models');
const { Op, sequelize } = require('sequelize');
const moment = require('moment-timezone');

async function getAvailablePasses(req, res) {
    try {
        const passestoreturn = [];
        const passes = await models.passes.findAll({
            attributes: ['id', 'studio_package_id', 'expiresAt', 'autopay', 'totalUses', 'usesCount', 'passValue', 'canceledAt'],
            where: {
                userid: req.body.userid,
                dibs_studio_id: req.body.dibsStudioId,
                expiresAt: {
                    [Op.gte]: moment()
                }
            },
            include: [
                {
                    model: models.studio_packages,
                    as: 'studioPackage',
                    attributes: ['id', 'name', 'private', 'on_demand_access']
                }
            ]
        });
        const addPassesToArray = async (pass) =>
            new Promise((resolve, reject) => {
                console.log(`pass is: ${JSON.stringify(pass)}`);
                const expiresAtDate = moment.utc(pass.expiresAt, 'YYYY-MM-DD HH:mm:ss');
                const formattedExp = expiresAtDate.format('M/D/YY');
                let doesRenew = false;
                let includePass = false;
                let totalClasses = `${pass.totalUses} Classes`;
                if (pass.autopay === true) totalClasses = 'Unlimited Classes';
                if (pass.totalUses === 1) totalClasses = '1 Class';
                if (pass.autopay === true && pass.canceledAt === null) doesRenew = true;
                let specialnotes = '';
                let expirationstring = `Exp: ${formattedExp}`;
                console.log(`passid: ${pass.id} doesrenew is: ${doesRenew}`);
                if (doesRenew) {
                    expirationstring = `Auto-renews on ${formattedExp}`;
                }
                let classStatement = `${pass.totalUses - pass.usesCount} classes remain`;
                if (pass.totalUses - pass.usesCount === 1) {
                    classStatement = '1 class remains';
                }
                if (pass.totalUses === 999 || pass.totalUses === null) {
                    classStatement = `${pass.usesCount} classes used`;
                    includePass = true;
                }
                if (pass.totalUses > pass.usesCount) {
                    includePass = true;
                }
                if (pass.studioPackage.private === true) {
                    console.log(`passid: ${pass.id} is private`);
                    specialnotes = 'Applies to private classes';
                }
                if (pass.studioPackage.on_demand_access === true) {
                    console.log(`passid: ${pass.id} is on demand`);
                    specialnotes = 'Includes access to VOD classes';
                }
                if (includePass) {
                    passestoreturn.push({
                        passid: pass.id,
                        passName: pass.studioPackage.name,
                        expiresAt: pass.expiresAt,
                        autopay: pass.autopay,
                        totalUses: pass.totalUses,
                        usesCount: pass.usesCount,
                        passValue: pass.passValue,
                        canceledAt: pass.canceledAt,
                        renewalDate: expirationstring,
                        classStatement,
                        totalClasses,
                        specialnotes,
                        doesRenew
                    });
                }
                resolve();
            });
        const promises = [];
        passes.forEach((pass) => {
            promises.push(addPassesToArray(pass));
        });
        Promise.all(promises).then(() => {
            console.log(`passestoreturn are: ${JSON.stringify(passestoreturn)}`);
            // passestoreturn.sort((a, b) => (a.totalUses === null || a.totalUses < b.totalUses ? 1 : -1));
            passestoreturn.sort((a, b) => {
                if (a.autopay === true && b.autopay === false) {
                    return -1;
                }
                if (a.autopay === true && b.autopay === true) {
                    return b.expiresAt - a.expiresAt;
                }
                if (a.totalUses < b.totalUses) {
                    return b.totalUses - a.totalUses;
                }
                return a.expiresAt > b.expiresAt ? 1 : -1;
            });
            res.json({
                msg: 'success',
                availablePasses: passestoreturn
            });
        });
    } catch (err) {
        console.log(`error in getAvailablePasses api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getAvailablePasses' };
}

module.exports = getAvailablePasses;
