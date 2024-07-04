const newsObj = require('../controller/news');

localStrategy   = require('passport-local').Strategy;


module.exports = function( passport ) {

  passport.serializeUser( function( user , done ) {
    done( null, user );
  })

  passport.deserializeUser( function( user , done ) {
    done( null, user );
  })

  passport.use( new localStrategy ({ 
    usernameField: "u_email",
    passwordField : "u_password",
    
  },
  function (u_email, u_password, done) {
      User.adminLogin(u_email, u_password ).then(function (result) {
          if ( result ) { 
            return done( null, { email:result.au_email , id:result.au_uuid , image:result.au_profileImage,permissions:result.permissions, role:result.au_fk_ur_id});
          } else {
            return done( null, false );
          }
      }).catch(err => done(err));
  }));
}