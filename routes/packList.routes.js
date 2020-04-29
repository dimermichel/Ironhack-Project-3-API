const { Router } = require("express");
const router = new Router();
const PackList = require("../bin/PackingTemplates");
const List = require("../models/List.model");
const Travel = require("../models/Travel.model");

const routeGuard = require("../configs/route-guard.config");
// after testing include routeGuard
// insert StatusCode to the Responses
router.get("/api/travel", (req, res, next) => {
  Travel.find({
    owner: req.session.user._id,
  })
    .then((allTravels) => {
      console.log(allTravels);
      res.json(allTravels);
    })
    .catch((err) => console.log(err));
});

// after testing include routeGuard
router.post("/api/travel", (req, res, next) => {
  let {
    city,
    state_code,
    country_code,
    country,
    imgURL,
    coordinates,
    startDate,
    endDate,
    attractions,
    weather,
    fullList,
  } = req.body;

  if (city === "" || startDate === "" || endDate === "") {
    res.json({
      message: "Please fill up the required forms.",
    });
    return;
  }
  const owner = req.session.user._id;

  Travel.create({
    city,
    state_code,
    country_code,
    country,
    imgURL,
    coordinates,
    startDate,
    endDate,
    attractions,
    weather,
    fullList,
    owner,
  })
    .then((createdTravel) => {
      console.log(createdTravel);
      Travel.findById(createdTravel._id)
        .populate("fullList")
        .then((detailCreatedTravel) => {
          res.json( detailCreatedTravel );
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

// after testing include routeGuard
router.get("/api/travel/:id", (req, res, next) => {
  Travel.findById(req.params.id)
    .populate("fullList")
    .then((detailTravel) => {
      (detailTravel.owner == req.session.user._id) ? res.json( detailTravel ) : res.json({message: 'You must be the owner of this travel to see it.'})
    })
    .catch((err) => console.log(err));
});

// after testing include routeGuard
router.post("/api/travel/:id/update", (req, res, next) => {
  const {
    city,
    state_code,
    country_code,
    country,
    imgURL,
    coordinates,
    startDate,
    endDate,
    attractions,
    weather,
    fullList,
  } = req.body;

  if (city === "" || startDate === "" || endDate === "") {
    res.json({
      message: "Please fill up the required forms.",
    });
    return;
  }

  Travel.findOne({
    _id: req.params.id,
  }).then((currentTravel) => {
    currentTravel.city = city;
    currentTravel.state_code = state_code;
    currentTravel.country_code = country_code;
    currentTravel.country = country;
    currentTravel.imgURL = imgURL;
    currentTravel.coordinates = coordinates;
    currentTravel.startDate = startDate;
    currentTravel.endDate = endDate;
    currentTravel.attractions = attractions;
    currentTravel.weather = weather;
    currentTravel.fullList = fullList;
    currentTravel
      .save()
      .then((updatedTravel) => {
        console.log(updatedTravel);
        res.json({ travel: updatedTravel });
      })
      .catch((err) => console.log(err));
  });
});

// after testing include routeGuard
router.post("/api/travel/:id/delete", (req, res, next) => {
  Travel.findByIdAndRemove(req.params.id)
    .then((responseFromDB) => res.json({ travel: responseFromDB }))
    .catch((err) => console.log(err));
});

// after testing include routeGuard
// Default list with all standard items to check
router.get("/api/defaultlist", (req, res) => {
  res.status(200).json(PackList);
});

router.post("/api/list", routeGuard, (req, res, next) => {
  const lists = req.body;

  if (!req.body) {
    res.json({
      message: "You need to have at least one List.",
    });
    return;
  }
  let owner = req.session.user._id;

  List.create({
    lists,
    owner,
  })
    .then((createdList) => {
      console.log(createdList);
      res.json(createdList);
    })
    .catch((error) => res.json(error));
});

router.get("/api/list/:id", routeGuard, (req, res, next) => {
  List.findById(req.params.id)
    .then((detailLists) => {
      console.log(detailLists);
      res.json({ detailLists });
    })
    .catch((err) => console.log(err));
});

router.post("/api/list/:id/update", routeGuard, (req, res, next) => {
  const lists = req.body;

  if (!req.body) {
    res.json({
      message: "You need to have at least one List.",
    });
    return;
  }

  List.findOne({
    _id: req.params.id,
  })
    .then((currentList) => {
      currentList.lists = lists;
      currentList
        .save()
        .then((updatedList) => {
          console.log(updatedList);
          res.json({ updatedList });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/api/list/:id/delete", routeGuard, (req, res, next) => {
  List.findByIdAndRemove(req.params.id)
    .then((deletedList) => res.json({ deletedList }))
    .catch((err) => console.log(err));
});

module.exports = router;
