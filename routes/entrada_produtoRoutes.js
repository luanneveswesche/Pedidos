const express = require("express");
const router = express.Router();
const Entrada_ProdutoController = require("../controllers/Entrada_ProdutoController");

const verificaSessao = require("../helpers/sessao").verificaSessao;


router.get("/",verificaSessao, Entrada_ProdutoController.mostrarEntrada_Produtos);
router.get("/criar",verificaSessao, Entrada_ProdutoController.criarEntrada_Produto);
router.post("/criarPost",verificaSessao, Entrada_ProdutoController.criarEntrada_ProdutoPost);
router.get("/editar/:id",verificaSessao, Entrada_ProdutoController.editarEntrada_Produto);
router.post("/editarPost",verificaSessao, Entrada_ProdutoController.editarEntrada_ProdutoPost);
router.post("/remover",verificaSessao, Entrada_ProdutoController.removerEntrada_Produto);

module.exports = router;