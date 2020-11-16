const { Router } = require("express");
const router = new Router;
const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const saltRounds = 11;

// show signup view to user
router.get("/signup", (req, res, next) => 
res.render("signup"));

//save credentials in DB with POST-route
router.post("/signup", (req, res, next) => {
    const { email, password} = req.body;
    
    //are email and password filled in?
    if(!email || !password){
        res.render("signup", {errorMessage: "Please provide both your email and password"});
        return;}

    //is the email of new user unique?
    User.findOne( { email } )
    .then(user => {
        if(user !== null){
            res.render("signup", {
                errorMessage: "This email is already used"});
                return;
            }})

    //encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    //create new user in DB
    const newUser = new User({
        email,
        passwordHash: hashPass
      });
 
      newUser
        .save()
        .then(() => res.redirect('/')) //redirect user to authorized page?
        .catch(err => next(err));
    });


module.exports = router;