const ErrorHelper = require('../../../../../lib/helpers/error-helper');
const autopayEmailLib = require('../../../../../lib/emails/autopay');

/**
 * paymentUpcoming - Description
 *
 * @param {type} req Description
 * @param {type} res Description
 *
 * @returns {type} Description
 */
async function paymentFailed(req, res) {
  const event = req.body;
  const invoice = event.data.object;
  const subscription = invoice.subscription;
  try {
    if (!subscription || (!event.livemode && process.env.NODE_ENV === 'production')) return res.status(204).send();

    const autopaySubscription = await models.dibs_user_autopay_packages.findOne({
      include: [{
        model: models.studio_packages,
        as: 'studio_package',
        include: [{
          model: models.dibs_studio,
          as: 'studio',
          include: [{
            model: models.whitelabel_custom_email_text,
            as: 'custom_email_text',
            key: 'dibs_studio_id',
          },
          {
            model: models.dibs_config,
            as: 'dibs_config',
          }],
        }],
      }, {
        model: models.dibs_user,
        as: 'user',
      }],
      where: {
        stripe_subscription_id: subscription,
      },
    });
    if (!autopaySubscription) throw new Error(`No subscription exists with that stripe_subscription_id ${subscription}`);

    await autopayEmailLib.sendAutopayPaymentFailedEmail(autopaySubscription, subscription, invoice);
    await autopayEmailLib.sendAutopayTransactionsEmail(autopaySubscription.user, autopaySubscription, 'Payment Failed');

    return res.status(204).send();
  } catch (err) {
    return ErrorHelper.handleError({
      opsSubject: 'Package Subscription Payment Failure Error',
      res,
      resStatus: 204,
      resSend: true,
      opsIncludes: `User Autopay Package has Stripe Subscription Id ${subscription}. Stripe Invoice ${invoice.id}`,
    })(err);
  }
}

module.exports = paymentFailed;
