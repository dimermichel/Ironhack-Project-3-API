const { Router } = require("express");
const axios = require("axios");
const router = new Router();
const fs = require("fs");
var FormData = require("form-data");
const Path = require("path");
const routeGuard = require("../configs/route-guard.config");
const uploadCloud = require("../configs/cloudinary.config");

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

router.post("/image/upload", uploadCloud.single("image"), (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>> Sending Image <<<<<<<<<<<<<<<<<<<<< ");
  console.log(req);
  let imageURL = "";
  if (req.file) {
    imageURL = req.file.url;
    console.log(imageURL);
  }
  res.json({ message: "File Uploaded", imageURL });
});

// routeGuard,
router.get("/api/google/:id", async (req, res, next) => {
  let details = {};
  try {
    const placeDetails = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${process.env.MAPS_API_KEY}`
    );
    console.log(placeDetails.data);
    details = { ...placeDetails.data };
    photoReference = placeDetails.data.result.photos[0].photo_reference;
    console.log(photoReference);
    let photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
    await downloadImage(photoURL);
    const form = new FormData();
    form.append("image", fs.createReadStream(__dirname + "/img/cityPhoto.jpg"));
    const cloudinaryResponse = await axios.post(
      `http://localhost:3001/image/upload`,
      form,
      { headers: form.getHeaders() }
    );
    console.log(cloudinaryResponse.data);
    res.json({
      data: "Fetched City Photo",
      details,
      cloudinary: cloudinaryResponse.data,
    });
  } catch (e) {
    console.log(err);
  }
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
