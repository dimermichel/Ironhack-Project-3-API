const { Router } = require("express");
const router = new Router();
const PackList = require("../bin/PackingTemplates");
const List = require("../models/List.model");
const Travel = require("../models/Travel.model");

const routeGuard = require("../configs/route-guard.config");

router.get("/api/travel", routeGuard, (req, res, next) => {});

router.post("/api/travel", routeGuard, (req, res, next) => {});

router.get("/api/travel/:id/update", routeGuard, (req, res, next) => {});

router.post("/api/travel/:id/update", routeGuard, (req, res, next) => {});

router.post("/api/travel/:id/delete", routeGuard, (req, res, next) => {
  Travel.findByIdAndRemove(req.params.id)
    .then((responseFromDB) => {})
    .catch((err) => console.log(err));
});

// after testing include routeGuard
router.get("/api/defaultlist", (req, res) => {
  res.status(200).json(PackList);
});
 
router.post("/api/list", routeGuard, (req, res, next) => {
  //console.log({BODY: req.body})
  //console.log({USER_ID: req.session.user._id})
  const lists = req.body;

  if (!req.body) {
    res.json({
      errorMessage: "You need to have at least one List.",
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
    })
    .catch((error) => console.log(error));
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
      errorMessage: "You need to have at least one List.",
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
