const MailClient = require('@dibs-tech/mail-client');
const { Op } = require('sequelize');
const ErrorHelper = require('../../../lib/helpers/error-helper');

const mc = new MailClient();

module.exports = async function sparkpostUnsubscribe(req, res) {
  let email;
  try {
    console.log(req.body);
    email = req.body[0].msys.unsubscribe_event.rcpt_to;
    mc.transactions('Sparkpost Unsubscribe', `${JSON.stringify(email)} unsubscribed from emails`);
    const user = await models.dibs_user.findOne({
      where: { email: { [Op.iLike]: email } },
    });
    const suppressionLists = user.suppression_lists;
    suppressionLists.nontransactional = true;
    user.suppression_lists = suppressionLists;
    await user.save();
    await Promise.promisify(mc.suppress, { context: mc })('add', 'NonTransactional', email);
    res.status(204).send();
  } catch (err) {
    ErrorHelper.handleError({
      opsSubject: 'Sparkpost Unsubscribe Error',
      res,
      resStatus: 204,
      resSend: true,
      opsIncludes: `Sparkpost Unsubscribe Error. Email is ${email}`,
    })(err);
  }
};
