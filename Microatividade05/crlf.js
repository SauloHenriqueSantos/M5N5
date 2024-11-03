const express = require('express');
const app = express();
const PORT = 3000;

// Função para validar e sanitizar a URL
function sanitizeAndRedirect(url, res) {
  // Expressão regular para bloquear caracteres CRLF (\r e \n)
  const crlfPattern = /[\r\n]/;

  // Verifica se a URL contém caracteres CRLF
  if (crlfPattern.test(url)) {
    return res.status(400).json({ message: 'URL inválida.' });
  }

  // Permite redirecionamento apenas para o domínio principal
  const baseDomain = 'dominio.com';
  try {
    const targetUrl = new URL(url);

    // Verifica se a URL pertence ao mesmo domínio
    if (targetUrl.hostname.endsWith(baseDomain)) {
      res.redirect(targetUrl.href);
    } else {
      res.status(400).json({ message: 'Redirecionamento externo não permitido.' });
    }
  } catch (error) {
    res.status(400).json({ message: 'URL inválida.' });
  }
}

// Endpoint de redirecionamento
app.get('/redirect', (req, res) => {
  const { url } = req.query;

  if (url) {
    sanitizeAndRedirect(url, res);
  } else {
    res.status(400).json({ message: 'URL não fornecida.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
