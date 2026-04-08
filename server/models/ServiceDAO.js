const mongoose = require('mongoose');
const { Service } = require('./Models');

const ServiceDAO = {
  async selectAll() {
    return await Service.find({});
  },
  async selectByCount() {
    return await Service.countDocuments({});
  },
  async selectBySkipLimit(skip, limit) {
    return await Service.find({}).skip(skip).limit(limit);
  },
  async selectByID(_id) {
    return await Service.findById(_id);
  },
  async insert(service) {
    service._id = new mongoose.Types.ObjectId();
    return await Service.create(service);
  },
  async update(service) {
    return await Service.findByIdAndUpdate(
      service._id,
      { 
        service_name: service.service_name || service.name,
        name: service.name || service.service_name,
        description: service.description, 
        duration: service.duration, 
        price: service.price 
      },
      { new: true }
    );
  },
  async delete(_id) {
    return await Service.findByIdAndDelete(_id);
  }
};

module.exports = ServiceDAO;
