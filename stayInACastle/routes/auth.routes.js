const { Router } = require("express");
const router = new Router;
const User = require("../models/user.model");
const Castle = require("../models/castle.model");
const bcrypt = require("bcrypt");
const saltRounds = 11;


// show signup view to user
router.get("/signup", (req, res, next) =>
    res.render("signup"));

//user-profile page
router.get("/user-profile", (req, res) => {
    const { _id } = req.session.currentUser
    // res.render('user-profile', { userInSession: req.session.currentUser });
    
    User.findById(_id)
        .populate('favorites')
        .then(user => {
            const { favorites } = user
            res.render('user-profile', { favorites, userInSession: req.session.currentUser })
        })
        .catch( err => console.log(err))

    });

//save credentials in DB with POST-route
router.post("/signup", (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    //are email and password filled in?
    if (!username || !password) {
        res.render("signup", {
            errorMessage: "Please provide both your email and password"
        });
        return;
    }

    //is the email of new user unique?
    User.findOne({
            username
        })
        .then(user => {
            if (user !== null) {
                res.render("signup", {
                    errorMessage: "This email is already used"
                });
                return;
            }
        

    //encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create new user in DB
    const newUser = new User({
        username,
        password: hashedPassword
    });

    newUser
        .save()
        .then(userFromDB => {
            req.session.currentUser = userFromDB;
            res.redirect("/user-profile")
        })
        .catch(err => next(err));
}) 
.catch(error => next(error));
})

//login page
router.get('/login', (req, res) => 
    res.render('login')
)

router.post("/login", (req, res, next) => {
    const {
        username,
        password
    } = req.body

    if (username === '' || password === '') {
        res.render('login', {
            errorMessage: 'Please enter both, email and password to login'
        })
        return;
    }

    User.findOne({
            username
        })
        .then(user => {
            if (!user) {
                res.render('login', {
                    errorMessage: 'Email is not registered. Try another email.'
                });
                return;
            } else if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/user-profile');
            } else {
                res.render('login', {
                    errorMessage: 'Incorrect password.'
                });
            }
        })
        .catch(error => next(error));
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
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