const { Router } = require('express');
const axios = require('axios');
const router = new Router();
const routeGuard = require('../configs/route-guard.config');

const triposoAxios = axios.create({
  headers: {
    'X-Triposo-Account': process.env.TRIPOSO_ID,
    'X-Triposo-Token': process.env.TRIPOSO_KEY
  }
});

// router.post('/api/google', routeGuard, (req, res, next) => {
   
// });

// Change to POST and Add routeGuard
router.get('/api/triposo', (req, res, next) => {
  // const {latitude , longitude} = req.body
  latitude = 52.510872648333674
  longitude = 13.358976985577385
  triposoAxios
  .get(`https://www.triposo.com/api/20200405/poi.json?tag_labels=sightseeing|topattractions&fields=id,name,images,coordinates,score,snippet&annotate=distance:${latitude},${longitude}&distance=20000`)
  .then((res) => {
    console.log(res.data);
    res.json({data: res.data})
  })
  .catch((err) => {
    res.json(err);
  });
});

// Change to POST and Add routeGuard
router.get('/api/weatherbit', (req, res) => {
  // const {latitude , longitude} = req.body
  latitude = 52.510872648333674
  longitude = 13.358976985577385
  axios
  .get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`)
  .then((res) => {
    console.log(res.data);
    res.json({data: res.data})
  })
  .catch((err) => {
    res.json(err);
  });
});


module.exports = router;