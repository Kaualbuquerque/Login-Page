const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas as origens

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
            return res.status(400).send('Email ou senha inválidos');
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Email ou senha inválidos');
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key');
        res.header('auth-token', token).send('Logado com sucesso');
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
