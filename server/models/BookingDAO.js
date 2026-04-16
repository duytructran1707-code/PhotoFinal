const mongoose = require('mongoose');
const { Booking } = require('./Models');

const BookingDAO = {
  async selectByCustID(_cid) {
    return await Booking.find({ 'customer._id': new mongoose.Types.ObjectId(_cid) })
      .sort({ cdate: -1 });
  },
  async selectAll() {
    return await Booking.find({}).sort({ cdate: -1 });
  },
  async selectByID(_id) {
    return await Booking.findById(_id);
  },
  async insert(booking) {
    booking._id = new mongoose.Types.ObjectId();
    return await Booking.create(booking);
  },
  async updateStatus(_id, status) {
    return await Booking.findByIdAndUpdate(
      _id,
      { status: status },
      { new: true }
    );
  },
  async delete(_id) {
    return await Booking.findByIdAndDelete(_id);
  }
};

module.exports = BookingDAO;
