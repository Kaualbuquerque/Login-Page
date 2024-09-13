const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

// Configura a estratégia do GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://login-page-dusky-seven.vercel.app/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // Aqui você pode verificar se o usuário já existe no banco de dados ou salvar o novo usuário
        // Exemplo: retornar a informação do perfil
        console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
        console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET);

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
