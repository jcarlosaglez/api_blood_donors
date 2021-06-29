const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Donor = mongoose.model("Donor");
const Receiver = mongoose.model("Receiver");

passport.use("local-donor", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    function (email, password, done) {
        Donor.findOne({email: email}, function (err, user) {
            if(err) {
                return done(err);
            }

            if(!user || !user.validatePassword(password)) {
                return done(null, false, {
                    success: false,
                    msg: "El correo o contraseña proporcionados no coinciden."
                });
            }

            return done(null, user);
        });
    }
));

passport.use("local-receiver", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    function (email, password, done) {
        Receiver.findOne({email: email}, function (err, user) {
            if(err) {
                return done(err);
            }

            if(!user || !user.validatePassword(password)) {
                return done(null, false, {
                    success: false,
                    msg: "El correo o contraseña proporcionados no coinciden."
                });
            }

            return done(null, user);
        });
    }
));