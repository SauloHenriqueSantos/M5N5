// Define variáveis para tentativas de login e requisitos de senha
MAX_LOGIN_ATTEMPTS = 3
MIN_PASSWORD_LENGTH = 8

login_attempts = 0

function login(username, password) {
  
  // Verifica se o nome de usuário já está em uso
  if (USER_EXISTS(username)) {
    return Error("Já existe usuário com esse nome.")
  }

  // Verifica se a senha atende ao requisito de comprimento mínimo
  if (password.length < MIN_PASSWORD_LENGTH) {
    return Error("A senha deve ter pelo menos " + MIN_PASSWORD_LENGTH + " caracteres.")
  }

  // Verifica as credenciais, limitando as tentativas de login
  while (login_attempts < MAX_LOGIN_ATTEMPTS) {
    login_attempts += 1

    // Verifica as credenciais no banco de dados
    is_valid_credentials = LOOKUP_CREDENTIALS_IN_DATABASE(username, password)

    if (is_valid_credentials) {
      return Success("Login bem-sucedido!")
    } else {
      if (login_attempts >= MAX_LOGIN_ATTEMPTS) {
        return Error("Número máximo de tentativas excedido. Por favor, tente novamente mais tarde.")
      } else {
        return Error("Usuário ou senha incorretos.")
      }
    }
  }

  // Se o login falhar após todas as tentativas, exibe uma mensagem de erro genérica
  return Error("Usuário ou senha incorretos.")
}
