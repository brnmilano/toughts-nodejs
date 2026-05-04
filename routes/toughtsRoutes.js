const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/ToughtController");

// Middleware para proteger as rotas que exigem autenticação
// O usuário não poderá acessar o dashboard sem estar logado
const checkAuth = require("../helpers/auth").checkAuth;

// Rota para exibir o formulário de criação de pensamento
router.get("/add", checkAuth, ToughtController.createTought);

// Rota para processar o formulário de criação de pensamento
router.post("/add", checkAuth, ToughtController.createToughtSave);

// Rota para exibir o formulário de edição de pensamento
router.get("/edit/:id", checkAuth, ToughtController.updateTought);

router.post("/edit", checkAuth, ToughtController.updateToughtSave);

// Rota para exibir o dashboard do usuário com seus pensamentos
router.get("/dashboard", checkAuth, ToughtController.dashboard);

// Rota para excluir um pensamento
router.post("/remove", checkAuth, ToughtController.removeTought);

// Rota para exibir os pensamentos (home)
router.get("/", ToughtController.showToughts);

module.exports = router;
