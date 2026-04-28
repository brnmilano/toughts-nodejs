const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // Validação da senha e confirmação de senha
    if (password !== confirmPassword) {
      req.flash("message", "As senhas não conferem, tente novamente.");
      return res.render("auth/register", { message: req.flash("message")[0] });
    }

    // Verificar se o usuário já existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "O e-mail já está em uso, tente outro.");

      return res.render("auth/register", { message: req.flash("message")[0] });
    }

    // Criar senha criptografada
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // Inicializar a sessão do usuário após o cadastro
      req.session.userId = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso!");

      // Garanto que a sessão é salva antes de redirecionar
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(`Erro ao registrar usuário: ${error}`);
    }
  }
};
