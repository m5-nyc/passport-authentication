const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
        passReqToCallBack: true
    },
        function(req, username, password, done) {
            // find a user in Mongo with provided username
            User.findONe({ 'username' : username}), function(err, user) {
                // in case of any error, return using the done method
                if(err){
                    console.log('Error in SignUp ' +err);
                    return done(err)
                }
                // already exist
                if(user){
                    console.log('User already exists with username: ' +username);
                    return done(null, false, req.flash('message', 'User Already Exist' ));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;
                    newUser.passport = createHash(password);
                    newUser.email = req.param('email');
                    newUser.firstName = req.param('firstName');
                    newUser.lastName = req.params('lastName');

                    // save the user
                    newUser.save(function(err) {
                        if(err){
                            console.log('Error in Saving user: ' +err);
                            throw err;
                        }

                        console.log('User Registration successful');
                        return done(null, newUser);

                    })
                }
            })
        }
        // delay the execution of the findOrCreateUser and execute the method
        // in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
);

    // generate hash using bCrypt
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }
}