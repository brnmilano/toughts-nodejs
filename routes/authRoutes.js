const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

// Rota para exibir a página de login
router.get("/login", AuthController.login);

// Rota para exibir a página de registro
router.get("/register", AuthController.register);

// Rota para processar o registro de novo usuário
router.post("/register", AuthController.registerPost);

module.exports = router;
