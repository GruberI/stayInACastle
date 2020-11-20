const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 6000000 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 60 * 60 * 24 
          })
      })
    );
  };