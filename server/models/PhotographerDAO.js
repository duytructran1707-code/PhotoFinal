const mongoose = require('mongoose');
const { Photographer, Booking } = require('./Models');

const PhotographerDAO = {
  async selectAll() {
    return await Photographer.find({});
  },
  async selectByCount() {
    return await Photographer.countDocuments({});
  },
  async selectBySkipLimit(skip, limit) {
    return await Photographer.find({}).skip(skip).limit(limit);
  },
  async selectByID(_id) {
    return await Photographer.findById(_id);
  },
  async selectByServiceID(_sid) {
    return await Photographer.find({ 'service._id': new mongoose.Types.ObjectId(_sid) });
  },
  async selectByKeyword(keyword) {
    return await Photographer.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { bio: { $regex: keyword, $options: 'i' } }
      ]
    });
  },
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 };
    return await Photographer.find(query).sort(mysort).limit(top).exec();
  },
  async selectTopRated(top) {
    const query = {};
    const mysort = { rating: -1 };
    return await Photographer.find(query).sort(mysort).limit(top).exec();
  },
  async selectTopHot(top) {
    const items = await Booking.aggregate([
      { $match: { status: 'DONE' } }, // Assuming 'DONE' means completed booking
      { $group: { _id: '$photographer._id', sum: { $sum: 1 } } },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();
    var photographers = [];
    for (const item of items) {
      const photographer = await this.selectByID(item._id);
      photographers.push(photographer);
    }
    return photographers;
  },
  async insert(photographer) {
    photographer._id = new mongoose.Types.ObjectId();
    return await Photographer.create(photographer);
  },
  async update(photographer) {
    return await Photographer.findByIdAndUpdate(
      photographer._id,
      {
        name: photographer.name,
        role: photographer.role,
        bio: photographer.bio,
        phone: photographer.phone,
        email: photographer.email,
        location: photographer.location,
        avatar: photographer.avatar,
        portfolio: photographer.portfolio,
        pricePerHour: photographer.pricePerHour,
        rating: photographer.rating,
        cdate: photographer.cdate,
        service: photographer.service
      },
      { new: true }
    );
  },
  async delete(_id) {
    return await Photographer.findByIdAndDelete(_id);
  }
};

module.exports = PhotographerDAO;
