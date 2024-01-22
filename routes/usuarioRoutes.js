const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

// importa a verificaSessao
const verificaSessao = require("../helpers/sessao").verificaSessao;

router.get("/", verificaSessao, UsuarioController.mostrarUsuarios);
router.get("/criar", verificaSessao, UsuarioController.criarUsuario);
router.post("/criarPost", verificaSessao, UsuarioController.criarUsuarioPost);
router.get("/editar/:id", verificaSessao, UsuarioController.editarUsuario);
router.post("/editarPost", verificaSessao, UsuarioController.editarUsuarioPost);
router.post("/remover", verificaSessao, UsuarioController.removerUsuario);
router.post("/loginPost", UsuarioController.loginPost);

module.exports = router;