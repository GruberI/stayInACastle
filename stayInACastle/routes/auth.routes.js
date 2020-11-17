const { Router } = require("express");
const router = new Router;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 11;


// show signup view to user
router.get("/signup", (req, res, next) =>
    res.render("signup"));

//user-profile page
router.get("/user-profile", (req, res) => {
    res.render('user-profile', {
            userInSession: req.session.currentUser
        });
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
                console.log(user)
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

module.exports = router;