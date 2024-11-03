const express = require('express');
const app = express();

// Middleware de autenticação
function authenticate(req, res, next) {
  const token = req.headers['authorization'];

  // Verifica se o token está presente e é válido (no caso, "my_secure_token")
  if (token === 'Bearer my_secure_token') {
    next(); // Token válido, prossegue com a requisição
  } else {
    // Token inválido ou ausente
    res.status(401).json({ message: 'Não autorizado' });
  }
}

// Rota com proteção de autenticação
app.get('/confidential-data', authenticate, (req, res) => {
  // Simula a chamada ao serviço para obter dados
  const jsonData = service.call(req);

  // Retorna os dados
  res.json(jsonData);
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Função fictícia para simular a chamada do serviço
const service = {
  call: (req) => {
    return { confidentialData: "Este é o dado confidencial." };
  },
};
