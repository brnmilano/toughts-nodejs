const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  /* Método para exibir a página de login */
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado.");

      return res.render("auth/login");
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha inválida, tente novamente.");

      return res.render("auth/login");
    }

    req.session.userId = user.id;
    req.flash("message", "Login realizado com sucesso!");

    req.session.save(() => {
      res.redirect("/");
    });
  }

  /* Método para exibir a página de registro */
  static register(req, res) {
    res.render("auth/register");
  }

  /* 
  Método para processar o registro de novo usuário 
    - Valida se as senhas conferem
    - Verifica se o email já está em uso
    - Cria a senha criptografada
    - Salva o usuário no banco de dados
    - Inicializa a sessão do usuário após o cadastro
  */
  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("message", "As senhas não conferem, tente novamente.");

      return res.render("auth/register");
    }

    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "O e-mail já está em uso, tente outro.");

      return res.render("auth/register");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userId = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(`Erro ao registrar usuário: ${error}`);
    }
  }

  /* Método para efetuar o logout do usuário*/
  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};
