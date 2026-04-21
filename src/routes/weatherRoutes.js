const express = require('express');
const { getWeather, getForecast } = require('../controllers/weatherController');

const router = express.Router();

// Routes
router.get('/current/:city', getWeather);
router.get('/forecast/:city', getForecast);

module.exports = router;