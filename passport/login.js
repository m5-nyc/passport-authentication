const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            // check in mongo if user with username exists or not
            User.findOne({ 'username' : username},
                function(err, user) {
                    // In case of any error, return using the done method
                    if(err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if(!user){
                        console.log('User Not Found with username ' + username);
                        return done(null, false,
                            req.flash('message', 'User not found.'));
                    }
                    // User exist but wrong password, log the error
                    if(!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid Password'))
                    }
                    // User and Password both match, return user from
                    // done method which will be treated like success
                    return done(null, user);
                }
            )
        })
    );
    const isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}
