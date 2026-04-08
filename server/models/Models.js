const mongoose = require('mongoose');

// Schemas
const AdminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String
}, { versionKey: false });

const ServiceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  service_name: String,
  name: String, // Keep for compatibility
  description: String,
  duration: Number,
  price: Number,
  category: String,
  icon_url: String,
  slug: String
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String,
}, { versionKey: false });

const PhotographerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  role: String,
  bio: String,
  phone: String,
  email: String,
  location: String,
  avatar: String,
  portfolio: [String],
  pricePerHour: Number,
  rating: Number,
  cdate: Number,
  specialty: [String],
  service: ServiceSchema
}, { versionKey: false });

const BookingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  bookingDate: String,
  timeSlot: String,
  location: String,
  note: String,
  total: Number,
  status: String,
  customer: CustomerSchema,
  photographer: PhotographerSchema,
  service: ServiceSchema
}, { versionKey: false });

// Models
const Admin = mongoose.model('Admin', AdminSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Photographer = mongoose.model('Photographer', PhotographerSchema);
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Admin, Service, Customer, Photographer, Booking };
