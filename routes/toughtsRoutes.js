const express = require("express");
const router = express.Router();

const ToughtController = require("../controllers/ToughtController");

// Rota para exibir os pensamentos (home)
router.get("/", ToughtController.showToughts);

module.exports = router;
