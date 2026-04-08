const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const ServiceDAO = require('../models/ServiceDAO');
const PhotographerDAO = require('../models/PhotographerDAO');
const CustomerDAO = require('../models/CustomerDAO');
const BookingDAO = require('../models/BookingDAO');

// service
router.get('/services', async function (req, res) {
  const services = await ServiceDAO.selectAll();
  res.json(services);
});

// photographer
router.get('/photographers', async function (req, res) {
  const photographers = await PhotographerDAO.selectAll();
  res.json(photographers);
});

router.get('/photographers/new', async function (req, res) {
  const photographers = await PhotographerDAO.selectTopNew(4);
  res.json(photographers);
});

router.get('/photographers/top-rated', async function (req, res) {
  const photographers = await PhotographerDAO.selectTopRated(4);
  res.json(photographers);
});

router.get('/photographers/hot', async function (req, res) {
  const photographers = await PhotographerDAO.selectTopHot(3);
  res.json(photographers);
});

router.get('/photographers/service/:sid', async function (req, res) {
  const _sid = req.params.sid;
  const photographers = await PhotographerDAO.selectByServiceID(_sid);
  res.json(photographers);
});

router.get('/photographers/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const photographers = await PhotographerDAO.selectByKeyword(keyword);
  res.json(photographers);
});

router.get('/photographers/:id', async function (req, res) {
  const _id = req.params.id;
  const photographer = await PhotographerDAO.selectByID(_id);
  res.json(photographer);
});

// customer
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());
    const newCust = { username, password, name, phone, email, active: 0, token };
    const result = await CustomerDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) res.json({ success: true, message: 'Please check email' });
      else res.json({ success: false, message: 'Email failure' });
    } else {
      res.json({ success: false, message: 'Insert failure' });
    }
  }
});

router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();
        res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
      } else {
        res.json({ success: false, message: 'Account is deactive' });
      }
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const { username, password, name, phone, email } = req.body;
  const customer = { _id, username, password, name, phone, email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

// bookings
router.post('/bookings', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const booking = {
    cdate: now,
    status: 'PENDING',
    total: req.body.total,
    customer: req.body.customer,
    photographer: req.body.photographer,
    service: req.body.service,
    bookingDate: req.body.bookingDate,
    timeSlot: req.body.timeSlot,
    location: req.body.location,
    note: req.body.note
  };
  const result = await BookingDAO.insert(booking);
  res.json(result);
});

router.get('/bookings/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const bookings = await BookingDAO.selectByCustID(_cid);
  res.json(bookings);
});

module.exports = router;
