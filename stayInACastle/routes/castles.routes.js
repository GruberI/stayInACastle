const express = require("express")
const router = express.Router();
const Castle = require("../models/castle.model")
const User = require("../models/user.model");

//Middleware check roles
const checkRoles = role => (req, res, next) => {
  if (req.session.currentUser.role === role) {
    return next();
  } else {
    res.redirect('/user-profile');
  }
};

router.get("/admin-profile", checkRoles('ADMIN'), (req, res) => {
  Castle.find()
  .then(castlesFromDB => {
    res.render("admin-profile", {castles: castlesFromDB})
  })
  .catch(err => console.log(`Something went wrong listing castles: ${err}`))
})

//CREATE CASTLE (ADMIN)
router.get("/create", checkRoles('ADMIN'), (req, res) => {
    res.render("castle-create")
 });

 router.post("/create", checkRoles('ADMIN'), (req, res) => {
     const { name, country, address, image, capacity, link, description } = req.body;

     Castle.create({name, country, address, image, capacity, link, description})
     .then(() => res.redirect("/admin-profile"))
     .catch(error => `Error with creating Castle ${error}`)
 });

 //Update castle (ADMIN) (POST)
router.get("/castles/:id/edit", checkRoles('ADMIN'), (req, res) => {
    const { id } = req.params;

    Castle.findById( id )
    .then (castleToEdit => {
        res.render("castle-edit", castleToEdit); 
    })
    .catch(err => console.log(`Error occured while updating castle: ${err}`))
});

//Update castle (ADMIN) POST
router.post("/castles/:id/edit", checkRoles('ADMIN'), (req, res) => {
    const { id } = req.params;
    const { name, country, address, image, capacity, link, description } = req.body; 

    Castle.findByIdAndUpdate( id, { name, country, address, image, capacity, link, description }, {new: true} )
    .then (updatedCastle => {
        res.redirect("/admin-profile"); ///change into "/countries/${updatedCastle._id}"
    })
    .catch(err => console.log(`Error occured while updating castle: ${err}`))
});

//Delete castle (ADMIN)
router.post("/castles/:id/delete", (req, res) => {
    const { id } = req.params;

    Castle.findByIdAndDelete( id )
    .then (() =>  res.redirect("/admin-profile"))
    .catch(err => console.log(`Error occured while deleting castle: ${err}`))
})

  //list by country
  router.get("/country", (req, res) => {
    const { country } = req.query

    Castle.find({ country })
      .then((castlesFromDB) => {
        res.render("country", { castlesFromDB })
      }
      )
      .catch((error) => `Error while fetching countries: ${error}`);
  });
  
 //Get route for individul castles
 router.get("/castle/:id", (req, res) => {
    const { id } = req.params

    Castle.findById(id)
      .then((castleFromDB) => {
        res.render("castle", castleFromDB)
      })
      .catch((error) => `Error while fetching castle: ${error}`);
  });

  router.post("/castle/:castleId/addToFavorites", (req, res) => {
    const { castleId } = req.params;
    const { _id } = req.session.currentUser

    User.findByIdAndUpdate(
      _id,
      { $push: { favorites: castleId } },
      { new: true }
    )
    .then(() => {
        res.redirect('/user-profile')
    })
    .catch((error) => `Error while adding castle to favorites: ${error}`);
});

module.exports = router;