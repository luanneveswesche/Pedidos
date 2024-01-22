const express = require("express");
const router = express.Router();
const PedidoController = require("../controllers/PedidoController");

// importa a verificaSessao
const verificaSessao = require("../helpers/sessao").verificaSessao;


router.get("/",verificaSessao, PedidoController.mostrarPedidos);
router.get("/criar",verificaSessao, PedidoController.criarPedido);
router.post("/criarPedido",verificaSessao, PedidoController.criarPedidoPost);
router.post("/addProduto",verificaSessao, PedidoController.adicionarProdutoPost);
router.post("/removeProduto",verificaSessao, PedidoController.removeProdutoPost);
router.post("/salvarPedido",verificaSessao, PedidoController.editarPedidoPost);
router.get("/editar/:id",verificaSessao, PedidoController.editarPedido);
router.get("/imprimir/:id",verificaSessao, PedidoController.imprimirPedido);
router.post("/remover",verificaSessao, PedidoController.removerPedido);

module.exports = router;