const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const JwtUtil = require('../utils/JwtUtil');
const AdminDAO = require('../models/AdminDAO');
const ServiceDAO = require('../models/ServiceDAO');
const PhotographerDAO = require('../models/PhotographerDAO');
const BookingDAO = require('../models/BookingDAO');
const CustomerDAO = require('../models/CustomerDAO');

// ==================== SERVICE (thay Category) ====================

router.get('/services', JwtUtil.checkToken, async function (req, res) {
  const noServices = await ServiceDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noServices / sizePage);
  let curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const skip = (curPage - 1) * sizePage;
  const services = await ServiceDAO.selectBySkipLimit(skip, sizePage);
  res.json({ services, noPages, curPage });
});
router.post('/services', JwtUtil.checkToken, async function (req, res) {
  try {
    const service = {
      service_name: req.body.service_name || req.body.name,
      name: req.body.name || req.body.service_name,
      description: req.body.description,
      duration: req.body.duration,
      price: req.body.price,
    };
    console.log('Inserting service:', service);
    const result = await ServiceDAO.insert(service);
    res.json(result);
  } catch (err) {
    console.error('Error inserting service:', err);
    res.status(500).json(err);
  }
});
router.put('/services/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const service = {
      _id: req.params.id,
      service_name: req.body.service_name || req.body.name,
      name: req.body.name || req.body.service_name,
      description: req.body.description,
      duration: req.body.duration,
      price: req.body.price,
    };
    console.log('Updating service:', service);
    const result = await ServiceDAO.update(service);
    res.json(result);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json(err);
  }
});
router.delete('/services/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await ServiceDAO.delete(req.params.id);
  res.json(result);
});

// ==================== PHOTOGRAPHER (thay Product) ====================

router.get('/photographers', JwtUtil.checkToken, async function (req, res) {
  const noPhotographers = await PhotographerDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noPhotographers / sizePage);
  let curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const skip = (curPage - 1) * sizePage;
  const photographers = await PhotographerDAO.selectBySkipLimit(skip, sizePage);
  res.json({ photographers, noPages, curPage });
});
router.post('/photographers', JwtUtil.checkToken, async function (req, res) {
  try {
    const now = new Date().getTime();
    let service = null;
    if (mongoose.Types.ObjectId.isValid(req.body.serviceID)) {
      service = await ServiceDAO.selectByID(req.body.serviceID);
    }
    const photographer = {
      name: req.body.name,
      role: req.body.role,
      bio: req.body.bio,
      phone: req.body.phone,
      email: req.body.email,
      location: req.body.location,
      avatar: req.body.avatar,
      portfolio: req.body.portfolio || [],
      pricePerHour: req.body.pricePerHour,
      rating: req.body.rating || 0,
      cdate: now,
      service: service,
    };
    console.log('Inserting photographer:', photographer.name);
    const result = await PhotographerDAO.insert(photographer);
    res.json(result);
  } catch (err) {
    console.error('Error inserting photographer:', err);
    res.status(500).json(err);
  }
});
router.put('/photographers/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const now = new Date().getTime();
    let service = null;
    if (mongoose.Types.ObjectId.isValid(req.body.serviceID)) {
      service = await ServiceDAO.selectByID(req.body.serviceID);
    }
    const photographer = {
      _id: req.params.id,
      name: req.body.name,
      role: req.body.role,
      bio: req.body.bio,
      phone: req.body.phone,
      email: req.body.email,
      location: req.body.location,
      avatar: req.body.avatar,
      portfolio: req.body.portfolio || [],
      pricePerHour: req.body.pricePerHour,
      rating: req.body.rating,
      cdate: now,
      service: service,
    };
    console.log('Updating photographer:', photographer._id);
    const result = await PhotographerDAO.update(photographer);
    res.json(result);
  } catch (err) {
    console.error('Error updating photographer:', err);
    res.status(500).json(err);
  }
});
router.delete('/photographers/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await PhotographerDAO.delete(req.params.id);
  res.json(result);
});

// ==================== BOOKINGS (thay Orders) ====================

router.get('/bookings', JwtUtil.checkToken, async function (req, res) {
  const bookings = await BookingDAO.selectAll();
  res.json(bookings);
});
router.put('/bookings/:id/status', JwtUtil.checkToken, async function (req, res) {
  const result = await BookingDAO.updateStatus(req.params.id, req.body.status);
  res.json(result);
});
router.delete('/bookings/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await BookingDAO.delete(req.params.id);
  res.json(result);
});

// ==================== CUSTOMERS ====================

router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// ==================== STATS ====================

router.get('/stats', JwtUtil.checkToken, async function (req, res) {
  const [noPhotographers, noServices, noCustomers, bookings] = await Promise.all([
    PhotographerDAO.selectByCount(),
    ServiceDAO.selectByCount(),
    CustomerDAO.selectByCount(),
    BookingDAO.selectAll(),
  ]);
  res.json({
    noBookings: bookings.length,
    noPhotographers,
    noServices,
    noCustomers,
  });
});
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

// ==================== AUTH ====================

router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, message: 'Authentication successful', token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token });
});

module.exports = router;
