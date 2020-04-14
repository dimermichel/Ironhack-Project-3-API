const { Router } = require("express");
const axios = require("axios");
const router = new Router();
const Fs = require('fs')  
const Path = require('path')  
const routeGuard = require("../configs/route-guard.config");

let photoReference = '';

async function downloadImage (url) {  
  const path = Path.resolve(__dirname, "..",'public', 'images','cityPhoto.jpg')
  const writer = Fs.createWriteStream(path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}  

const triposoAxios = axios.create({
  headers: {
    "X-Triposo-Account": process.env.TRIPOSO_ID,
    "X-Triposo-Token": process.env.TRIPOSO_KEY,
  },
});

router.get("/api/google/:id", routeGuard, (req, res, next) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${process.env.MAPS_API_KEY}`
    )
    .then((placeDetails) => {
      console.log(placeDetails.data);
      photoReference = placeDetails.data.result.photos[0].photo_reference;
      console.log(photoReference);
    })
    .then(() => {
      const photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`
        downloadImage(photoURL)
        res.json({ data: 'Fetched City Photo' });
        }).catch(err => console.log(err))
});

// Change to POST and Add routeGuard
router.get("/api/triposo", (req, res, next) => {
  // const {latitude , longitude} = req.body
  latitude = 52.510872648333674;
  longitude = 13.358976985577385;
  triposoAxios
    .get(
      `https://www.triposo.com/api/20200405/poi.json?tag_labels=sightseeing|topattractions&fields=id,name,images,coordinates,score,snippet&annotate=distance:${latitude},${longitude}&distance=20000`
    )
    .then((res) => {
      console.log(res.data);
      res.json({ data: res.data });
    })
    .catch((err) => {
      res.json(err);
    });
});

// Change to POST and Add routeGuard
router.get("/api/weatherbit", (req, res) => {
  // const {latitude , longitude} = req.body
  latitude = 52.510872648333674;
  longitude = 13.358976985577385;
  axios
    .get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`
    )
    .then((res) => {
      console.log(res.data);
      res.json({ data: res.data });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
