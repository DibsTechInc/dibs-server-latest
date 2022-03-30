module.exports = async function assignSpot(spotId, { save = false, transaction = null } = {}) {
  if (!this.eventid) throw new Error('Not an event transaction')
  const room = await this.constructor.sequelize.models.room.findRoomAsForEvent(this.eventid);
  switch (true) {
    case !room.idMappedSpots[spotId]:
      throw new Error('Spot is an empty space')
    case !room.idMappedSpots[spotId].bookable:
      throw new Error('Spot is not bookable')
    case !room.idMappedSpots[spotId].available:
      throw new Error('Spot is not available')
    default:
      this.spot_id = spotId;
      return save ? this.save(transaction ? { transaction } : undefined) : this;
  }
}