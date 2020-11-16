const express = require('express');
const router  = express.Router();
const bcryptjs = require("bcrypt");

const User = require("../models/User.model");
const { resource } = require("../app");

router.get("/login", (req, res) => {res.render("auth/login", { errorMessage: req.flash('error')})
    });

router.post("/login", (req, res, next) => {
    const { email, passwordHash } = req.body

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login'
        })
        return;
    } 

    User.findOne({ email })
        .then ( user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try another email.'});
                return;
            } else if (bcryptjs.compareSync(passwordHash, user.passwordHash)) {
                req.session.currentUser = user;
                console.log(user)
                res.redirect('/user-profile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.'});
            }
        })
        .catch(error => next(error));
})

module.exports = router;