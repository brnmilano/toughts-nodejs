const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

// Rota para exibir a página de login
router.get("/login", AuthController.login);

// Rota para processar o login do usuário
router.post("/login", AuthController.loginPost);

// Rota para exibir a página de registro
router.get("/register", AuthController.register);

// Rota para processar o registro de novo usuário
router.post("/register", AuthController.registerPost);

// Rota para processar o logout
router.get("/logout", AuthController.logout);

module.exports = router;
