const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(\"CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data_nascimento TEXT, telefone TEXT, email TEXT)\");
});

app.get('/clientes', (req, res) => {
  db.all(\"SELECT * FROM clientes\", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/clientes', (req, res) => {
  const { nome, data_nascimento, telefone, email } = req.body;
  db.run(\"INSERT INTO clientes (nome, data_nascimento, telefone, email) VALUES (?, ?, ?, ?)\", [nome, data_nascimento, telefone, email], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ ok: true });
  });
});

// Simulação de envio automático diário
cron.schedule('* * * * *', () => {
  const hoje = new Date().toISOString().slice(5, 10); // MM-DD
  db.all(\"SELECT * FROM clientes WHERE strftime('%m-%d', data_nascimento) = ?\", [hoje], (err, rows) => {
    if (err) return console.error(err);
    rows.forEach(cliente => {
      console.log(`🎉 Enviando mensagem para ${cliente.nome} (${cliente.email})`);
    });
  });
});

// Servir React build
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
