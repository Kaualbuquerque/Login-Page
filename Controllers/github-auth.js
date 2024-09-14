const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

// Configura a estratégia do GitHub
passport.use(new GitHubStrategy({
    clientID: "Ov23lin9vuF2bpLW6GSu",
    clientSecret: "b5a35743a6b4b4d4c66227d7c5b583c83ea73d1a",
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// Serializa o usuário para a sessão
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Desserializa o usuário da sessão
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports = passport;
