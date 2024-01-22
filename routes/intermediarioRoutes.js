const express = require("express");
const router = express.Router();
const IntermediarioController = require("../controllers/IntermediarioController");

// importa a verificaSessao
const verificaSessao = require("../helpers/sessao").verificaSessao;


router.get("/",verificaSessao, IntermediarioController.mostrarIntermediarios);
router.get("/criar",verificaSessao, IntermediarioController.criarIntermediario);
router.post("/criarPost",verificaSessao, IntermediarioController.criarIntermediarioPost);
router.get("/editar/:id",verificaSessao, IntermediarioController.editarIntermediario);
router.post("/editarPost",verificaSessao, IntermediarioController.editarIntermediarioPost);
router.post("/remover",verificaSessao, IntermediarioController.removerIntermediario);

module.exports = router;