import React, { useState, useEffect } from 'react';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', data_nascimento: '', telefone: '', email: '' });

  const fetchClientes = async () => {
    const res = await fetch('/clientes');
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ nome: '', data_nascimento: '', telefone: '', email: '' });
    fetchClientes();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Painel de Aniversários 🎉</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder=\"Nome\" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input type=\"date\" value={form.data_nascimento} onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} required />
        <input placeholder=\"Telefone\" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
        <input placeholder=\"Email\" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <button type=\"submit\">Salvar Cliente</button>
      </form>
      <h3>Clientes Cadastrados</h3>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>{c.nome} - {c.data_nascimento}</li>
        ))}
      </ul>
    </div>
  );
}
