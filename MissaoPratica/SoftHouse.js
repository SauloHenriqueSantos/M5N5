const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'nomedaempresa';

// Mock de dados de usuários
const users = [
  { "username": "user", "password": "123456", "id": 123, "email": "user@dominio.com", "perfil": "user" },
  { "username": "admin", "password": "123456789", "id": 124, "email": "admin@dominio.com", "perfil": "admin" },
  { "username": "colab", "password": "123", "id": 125, "email": "colab@dominio.com", "perfil": "user" },
];

// Middleware para validar o token JWT
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acesso negado: token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Função para gerar token JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: '1h' });
}

// Endpoint de login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(403).json({ message: 'Credenciais inválidas' });

  const token = generateToken(user);
  res.json({ token });
});

// Endpoint para obter dados do usuário logado (sem restrição de perfil)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ id: user.id, username: user.username, email: user.email, perfil: user.perfil });
});

// Endpoint para recuperação dos dados de todos os usuários (restrito ao perfil admin)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.perfil !== 'admin') return res.status(403).json({ message: 'Acesso negado' });
  res.json({ data: users });
});

// Função sanitizadora para o endpoint de contratos
function sanitizeInput(input) {
  return input.replace(/[^\w\s-]/g, '');
}

// Endpoint de contratos, com tratamento de SQL Injection
app.get('/api/contracts/:empresa/:inicio', authenticateToken, (req, res) => {
  if (req.user.perfil !== 'admin') return res.status(403).json({ message: 'Acesso negado' });

  const empresa = sanitizeInput(req.params.empresa);
  const inicio = sanitizeInput(req.params.inicio);

  const contracts = getContracts(empresa, inicio);
  if (contracts.length > 0) res.json({ data: contracts });
  else res.status(404).json({ message: 'Nenhum contrato encontrado' });
});

// Mock de função de busca no banco de dados
function getContracts(empresa, inicio) {
  // Simulação de busca (substitua por busca real)
  return [
    { contratoId: 1, empresa: empresa, dataInicio: inicio, descricao: "Contrato de serviço" }
  ];
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
