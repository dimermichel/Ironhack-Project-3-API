const { Router } = require('express');
const axios = require('axios');

const router = new Router();

const routeGuard = require('../configs/route-guard.config');

router.post('/api/google', routeGuard, (req, res, next) => {
   
});

router.post('/api/triposo', routeGuard, (req, res, next) => {
   
});

router.post('/api/weatherbit', routeGuard, (req, res) => {

});


module.exports = router;