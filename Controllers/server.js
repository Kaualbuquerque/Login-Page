const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const passport = require('./github-auth'); // Importa o GitHub OAuth configurado

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas as origens

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Configura a sessão
app.use(session({
    secret: '0', // Defina uma chave secreta forte
    resave: false,
    saveUninitialized: true
}));

// Inicializa o passport e a sessão
app.use(passport.initialize());
app.use(passport.session());

// Rota principal para servir o arquivo HTML (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para autenticação com GitHub
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback para a autenticação com GitHub
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        const user = req.user;
        const githubId = user.id;
        const username = user.username;
        const profileUrl = user._json.html_url;

        // Salvar dados do GitHub no localStorage do cliente via resposta para o front-end
        res.redirect(`/?login=success&githubId=${githubId}&username=${username}&profileUrl=${profileUrl}`);
    }
);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
