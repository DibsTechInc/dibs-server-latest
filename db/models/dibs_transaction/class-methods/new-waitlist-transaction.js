module.exports = async function newWaitlistTransaction({
  user,
  event,
  pass = null,
  purchasePlace,
  save = false,
  employeeid,
}) {
  let instance = this.build({
    userid: user.id,
    eventid: event.eventid,
    source: event.source,
    studioid: event.studioid,
    dibs_studio_id: event.dibs_studio_id,
    type: this.Types.WAITLIST,
    amount: 0,
    tax_amount: 0,
    discount_amount: 0,
    status: 0,
    original_price: event.price_dibs,
    with_passid: pass ? pass.id : null,
    purchasePlace,
    description: `Begin add to waitlist for user ${user.id} to event ${event.eventid}`,
    employeeid: employeeid || null,
  });
  if (!save) return instance;
  instance = await instance.save();
  return instance;
};
