const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
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

// Conectar ao MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '020803',
    database: 'users_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Rota principal para servir o arquivo HTML (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para cadastro
app.post('/register', (req, res) => {
    const { email, password, phone, dob } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            return res.status(400).send('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (email, password, phone, dob) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [email, hashedPassword, phone, dob], (err, result) => {
            if (err) throw err;
            res.status(201).send('Usuário registrado com sucesso');
        });
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key');
        res.json({ success: true, redirectUrl: '/?login=success'});
    });
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

        // Verificar se o usuário já existe no banco de dados com base no github_id
        const query = 'SELECT * FROM github_users WHERE github_id = ?';

        db.query(query, [githubId], (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                // Usuário já existe
                console.log('Usuário já existente no banco de dados GitHub!');
                res.redirect('/?login=success');
            } else {
                // Usuário não existe, insira um novo registro
                const insertQuery = `
                    INSERT INTO github_users (github_id, username, profile_url)
                    VALUES (?, ?, ?)
                `;
                db.query(insertQuery, [githubId, username, profileUrl], (err, result) => {
                    if (err) throw err;
                    console.log('Usuário salvo no banco de dados GitHub!');
                    res.redirect('/');
                });
            }
        });
    }
);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
