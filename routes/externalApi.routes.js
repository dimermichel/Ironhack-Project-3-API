const { Router } = require("express");
const axios = require("axios");
const router = new Router();
const fs = require("fs");
const FormData = require("form-data");
const Path = require("path");
const routeGuard = require("../configs/route-guard.config");
const uploadCloud = require("../configs/cloudinary.config");
const BASE_URL = process.env.BASE_URL;

let photoReference = "";

async function downloadImage(url) {
  const path = Path.resolve(__dirname, "img", "cityPhoto.jpg");
  console.log(path);
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const triposoAxios = axios.create({
  headers: {
    "X-Triposo-Account": process.env.TRIPOSO_ID,
    "X-Triposo-Token": process.env.TRIPOSO_KEY,
  },
});

// Route that handle the image upload
router.post("/image/upload", uploadCloud.single("image"), (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>> Sending Image <<<<<<<<<<<<<<<<<<<<< ");
  //console.log(req);
  let imageURL = "";
  if (req.file) {
    imageURL = req.file.url;
    //console.log(imageURL);
  }
  res.json(imageURL);
});

// routeGuard,
router.get("/api/google/:id", async (req, res, next) => {
  let details = {};
  try {
    const placeDetails = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${process.env.MAPS_API_KEY}`
    );
    //console.log(placeDetails.data);
    details = { ...placeDetails.data };
    photoReference = placeDetails.data.result.photos[0].photo_reference;
    //console.log(photoReference);
    let photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
    await downloadImage(photoURL);
    const form = new FormData();
    form.append("image", fs.createReadStream(__dirname + "/img/cityPhoto.jpg"));
    const cloudinaryResponse = await axios.post(
      `${BASE_URL}/image/upload`,
      form,
      { headers: form.getHeaders() }
    );
    //console.log(cloudinaryResponse.data);
    // Filtering the Data before sending a response
    const { name, address_components, geometry } = details.result;
    const imageURL = cloudinaryResponse.data;
    const newTravel = {};
    const startDate = new Date();
    let endDate = new Date();
    // Creating a default endDate of 16 days because of Weather API limitations
    endDate.setDate(endDate.getDate() + 16);
    const state_code = address_components.filter((el) =>
      el.types.includes("administrative_area_level_1")
    )[0].short_name;
    const country_code = address_components.filter((el) =>
      el.types.includes("country")
    )[0].short_name;
    const country = address_components.filter((el) =>
      el.types.includes("country")
    )[0].long_name;
    newTravel.city = name;
    newTravel.imgURL = imageURL;
    newTravel.coordinates = {};
    newTravel.coordinates.lat = geometry.location.lat;
    newTravel.coordinates.lng = geometry.location.lng;
    if (state_code) newTravel.state_code = state_code;
    if (country_code) newTravel.country_code = country_code;
    if (country) newTravel.country = country;
    newTravel.startDate = startDate;
    newTravel.endDate = endDate;
    const attractions = await axios.post(
      `${BASE_URL}/api/triposo`,
      newTravel.coordinates
    );
    //console.log({attractions})
    newTravel.attractions = attractions.data;
    const weather = await axios.post(
      `${BASE_URL}/api/weatherbit`,
      newTravel.coordinates
    );
    newTravel.weather = weather.data;

    res.json(newTravel);
  } catch (e) {
    console.log(err);
    res.json(err);
  }
});

// Change to POST and Add routeGuard
router.post("/api/triposo", (req, res, next) => {
  const { lat, lng } = req.body;

  triposoAxios
    .get(
      `https://www.triposo.com/api/20200405/poi.json?tag_labels=sightseeing|topattractions&fields=id,name,images,coordinates,score,snippet&annotate=distance:${lat},${lng}&distance=20000`
    )
    .then((responseFromAPI) => {
      // Filtering the response from API to return only the important variables to our Model
      const filteredAttractionsArr = responseFromAPI.data.results.map((el) => {
        const { name, coordinates, score, snippet, images } = el;
        const filteredAttractionsArr = {};
        filteredAttractionsArr.name = name;
        filteredAttractionsArr.coordinates = {};
        filteredAttractionsArr.coordinates.lat = coordinates.latitude;
        filteredAttractionsArr.coordinates.lnt = coordinates.longitude;
        filteredAttractionsArr.score = score;
        filteredAttractionsArr.snippet = snippet;
        filteredAttractionsArr.imgURL = images[0].sizes.medium.url;
        return filteredAttractionsArr;
      });
      res.json(filteredAttractionsArr);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Change to POST and Add routeGuard
router.post("/api/weatherbit", (req, res) => {
  const { lat, lng } = req.body;

  axios
    .get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_KEY}`
    )
    .then((responseFromAPI) => {
      //console.log(responseFromAPI.data);
      // Filtering the response from API to return only the important variables to our Model
      const filteredWeatherArr = responseFromAPI.data.data.map((el) => {
        const { datetime, temp, max_temp, min_temp, weather } = el;
        const { icon, code, description } = weather;
        const filteredWeatherArr = {};
        filteredWeatherArr.datetime = datetime;
        filteredWeatherArr.temp = temp;
        filteredWeatherArr.max_temp = max_temp;
        filteredWeatherArr.min_temp = min_temp;
        filteredWeatherArr.iconURL = `https://res.cloudinary.com/dimermichel/image/upload/v1586324873/ironhackProject3/icon/${icon}.png`;
        filteredWeatherArr.code = code;
        filteredWeatherArr.description = description;
        return filteredWeatherArr;
      });
      res.json(filteredWeatherArr);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
