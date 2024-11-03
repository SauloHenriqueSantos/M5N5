const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = 'secret_key'; // Substitua por uma chave segura
const TOKEN_EXPIRATION = '1h'; // Expiração do token, aqui definido para 1 hora

// Função de login que gera o token JWT com expiração
function do_Login(username, password) {
  // Aqui você faria a verificação do username e password no banco de dados
  // Exemplo simplificado assumindo usuário válido

  const payload = {
    username: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // Expira em 1 hora
  };

  // Gera o token com a claim de expiração
  const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  return jwt_token;
}

// Rota de autenticação
app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  // Validação de usuário e senha (exemplo simplificado)
  if (username === 'admin' && password === 'password') {
    const token = do_Login(username, password);
    return res.json({ jwt_token: token });
  } else {
    return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
  }
});

// Função para validar o token e sua expiração
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
}

// Endpoint protegido que valida o token antes de executar a ação
app.post('/do_SomeAction', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho

  const { valid, error } = validateToken(token);

  if (!valid) {
    return res.status(401).json({ message: 'Acesso não autorizado.' });
  }

  // Executa a ação protegida
  res.json({ message: 'Ação realizada com sucesso!' });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Função de login no frontend
function login() {
  const _data = {
    username: 'admin',
    password: 'password'
  };

  fetch('http://localhost:3000/auth', {
    method: 'POST',
    body: JSON.stringify(_data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  })
    .then(response => response.json())
    .then(json => {
      const token = json.jwt_token;
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('token', token);
        localStorage.setItem('token_expiration', decoded.exp * 1000); // Armazena a expiração em milissegundos
      }
    })
    .catch(err => console.log(err));
}

// Função para verificar a validade do token
function isTokenValid() {
  const tokenExpiration = localStorage.getItem('token_expiration');
  const currentTime = Date.now();
  return tokenExpiration && currentTime < tokenExpiration;
}

// Função de ação protegida
function doAction() {
  if (!isTokenValid()) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = '/login'; // Redireciona para a página de login
    return;
  }

  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/do_SomeAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(`response: ${json.message}`);
    })
    .catch(err => console.log(err));
}
