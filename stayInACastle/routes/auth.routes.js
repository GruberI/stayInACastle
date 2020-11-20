const { Router } = require("express");
const router = new Router;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 11;

router.get("/signup", (req, res, next) =>
    res.render("signup"));

router.get("/user-profile", (req, res) => {
    const { _id } = req.session.currentUser
    
    User.findById(_id)
        .populate('favorites')
        .then(user => {
            const { favorites } = user
            res.render('user-profile', { favorites, userInSession: req.session.currentUser })
        })
        .catch( err => console.log(err))
    });

router.post("/signup", (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        res.render("signup", {
            errorMessage: "Please provide both your email and password"
        });
        return;
    }

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
        

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

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
});

router.get('/login', (req, res) => 
    res.render('login')
);

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

                if(req.session.currentUser.role === "ADMIN"){
                    res.redirect("/admin-profile")
                }else{res.redirect('/user-profile');}
                
            } else {
                res.render('login', {
                    errorMessage: 'Incorrect password.'
                });
            }
        })
        .catch(error => next(error));
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router;