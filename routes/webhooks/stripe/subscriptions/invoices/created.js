const MailClient = require('@dibs-tech/mail-client');
const StripeClient = require('../../../../../lib/stripe/client');
const Decimal = require('decimal.js');
const applyCreditLib = require('../../../../../lib/purchasing/shared/apply-credit');

const mc = new MailClient();
const sc = new StripeClient();

/**
 * paymentCreated - Description
 *
 * @param {type} req Description
 * @param {type} res Description
 *
 * @returns {type} Description
 */
async function paymentCreated(req, res) {
  let subscription;
  let invoice;
  try {
    const event = req.body;
    invoice = event.data.object;
    subscription = invoice.subscription;

    if (
      !subscription ||
      (!event.livemode && process.env.NODE_ENV === 'production')
    ) { return res.status(204).send(); }

    // If the invoice total is 0, we don't need a new transaction
    // Invoice will only be 0 on the initial subscription because
    // we use trial days for the first subscription
    if (invoice.total <= 0) return res.status(204).send();

    const autopaySubscription = await models.dibs_user_autopay_packages.findOne(
      {
        include: [
          {
            model: models.studio_packages,
            as: 'studio_package',
            include: [
              {
                model: models.dibs_studio,
                as: 'studio',
              },
            ],
          },
          {
            model: models.dibs_user,
            as: 'user',
            include: [
              {
                model: models.credit,
                as: 'credits',
              },
            ],
          },
        ],
        where: {
          stripe_subscription_id: subscription,
        },
      }
    );

    // For the percent off case: need to divide by 100 twice
    // once for percent_off (comes in as 15/100 for ex)
    // once for the subtotal which comes in in cents
    let discountAmount = 0;
    if (invoice.discount && invoice.discount.coupon) {
      discountAmount = invoice.discount.coupon.amount_off
        ? +Decimal(invoice.discount.coupon.amount_off)
            .dividedBy(100)
            .toDP(2)
        : +Decimal(invoice.subtotal)
            .times(invoice.discount.coupon.percent_off)
            .dividedBy(100)
            .dividedBy(100)
            .toDP(2);
    }

    const transaction = await models.dibs_transaction.newSubscriptionTransaction(
      {
        autopaySubscription,
        taxAmount: invoice.tax
          ? new Decimal(invoice.tax)
              .dividedBy(100)
              .toDP(2)
              .toNumber()
          : 0,
        price: new Decimal(invoice.subtotal)
          .dividedBy(100)
          .toDP(2)
          .toNumber(),
        description: `Subscription Invoice Created for studio package ${
          autopaySubscription.studio_package.id
        }. Invoice: ${invoice.id}`,
        subcriptionInvoiceId: invoice.id,
        discount_amount: discountAmount,
        save: true,
      }
    );

    await models.sequelize.transaction(async (sqlTransaction) => {
      await applyCreditLib.applyStudioCreditToTransaction(
        autopaySubscription.user,
        transaction,
        sqlTransaction
      );
      return applyCreditLib.applyRafCreditToTransaction(
        autopaySubscription.user,
        transaction,
        sqlTransaction
      );
    });

    if (transaction.raf_credits_spent || transaction.studio_credits_spent) {
      const totalCreditsToUse = new Decimal(transaction.raf_credits_spent).plus(
        transaction.studio_credits_spent
      );
      await sc.addInvoiceItemToInvoice(
        {
          amount: -Decimal(totalCreditsToUse).times(100),
          customer: autopaySubscription.stripe_customer_id,
          invoice: invoice.id,
          description: "Applied user's credits",
          currency: invoice.currency,
        },
        autopaySubscription.studio_package.studio.stripe_account_id
      );
    }
    return res.status(200).send();
  } catch (err) {
    if (err) {
      mc.ops(
        'Package subscription created error',
        `Error preparing for invoice payment: stripe subscription: ${subscription}. Stripe Invoice ${
          invoice.id
        }. Error: ${err.stack}`
      );
    }
    return res.status(204).send();
  }
}

module.exports = paymentCreated;
