const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados'
});

// Função segura para executar uma consulta SQL com parâmetros
function doDBAction(id) {
  // Consulta parametrizada para evitar SQL Injection
  const query = 'SELECT * FROM users WHERE userID = ?';

  // Executa a consulta usando o ID como parâmetro seguro
  connection.execute(query, [id], (error, results) => {
    if (error) {
      console.error('Erro ao executar a consulta:', error);
      return;
    }

    console.log('Resultados da consulta:', results);
  });
}

// Exemplo de chamada da função com o ID recebido como parâmetro
// Aqui, é simulado o recebimento de um parâmetro de ID de um usuário
const userId = '10'; // Suponha que isso seja obtido de req.query.id em uma requisição HTTP
doDBAction(userId);
