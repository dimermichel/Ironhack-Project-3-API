const { Router } = require('express');

const router = new Router();

const mongoose = require('mongoose');
const User = require('../models/User.model');
const List = require('../models/List.model');
const Travel = require('../models/Travel.model');

const routeGuard = require('../configs/route-guard.config');

router.get('/api/travel', routeGuard, (req, res, next) => {
   
});

router.post('/api/travel', routeGuard, (req, res, next) => {

});

router.get('/api/travel/:id/update', routeGuard, (req, res, next) => {
   
});

router.post('/api/travel/:id/update', routeGuard, (req, res, next) => {

});

router.post('/api/travel/:id/delete', routeGuard, (req, res, next) => {
  Travel.findByIdAndRemove(req.params.id)
    .then(responseFromDB => {
    
    })
    .catch(err => console.log(err));
});

router.get('/api/defaultlist', routeGuard, (req, res) => {

});

router.post('/api/list', routeGuard, (req, res, next) => {

});

router.get('/api/list/:id', routeGuard, (req, res, next) => {

});

router.post('/api/list/:id/update', routeGuard, (req, res, next) => {

});

router.post('/api/list/:id/delete', routeGuard, (req, res, next) => {

});

module.exports = router;
