const Pedido = require('../models/Pedido')
const Intermediario = require('../models/Intermediario')
const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')
const PedidoDetalhe = require('../models/Pedido_Detalhe')
const sequelize = require('sequelize')
const session = require('express-session')


module.exports = class PedidoController {
    static mostrarPedidos(req, res) {
        // order resultados, novos registros primeiro
        let ordenar = 'DESC'
        Pedido.findAll({
            attributes: {
                include: [
                    "id",
                    [sequelize.fn("DATE_FORMAT", sequelize.col("data"), "%d/%m/%Y"),
                        "data"],
                    "valor_pedido",
                    "IntermediarioId",
                ],
            },
            include: [{
                model: Intermediario,
                required: true
            }],
            order: [['createdAt', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length
                if (qtd === 0) {
                    qtd = false
                }
                const resultado = data.map((result) => result.get({ plain: true }))
                res.render('pedido/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }


    static async criarPedido(req, res) {
        const usuarioid = req.session.userid
        const usuario = await Usuario.findByPk(usuarioid)
        // order resultados, novos registros primeiro
        let ordenar = 'ASC'
        Intermediario.findAll({
            order: [['nome', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                const intermediarios = data.map((result) => result.get({ plain: true }))
                const data_atual = new Date().toISOString().slice(0, 10)
                res.render('pedido/criar', {
                    intermediarios, data_atual, usuario: usuario.nome
                })
            })
            .catch((err) => console.log(err))
    }

    static criarPedidoPost(req, res) {
        const pedido = {
            IntermediarioId: req.body.intermediario,
            UsuarioId: req.session.userid,
            valor_pedido: 0,
            data: req.body.data,
        }
        Pedido.create(pedido)
            .then((pedido) => {
                pedido = pedido.get({ plain: true })
                pedido.data = pedido.data.toISOString().slice(0, 10)
                Intermediario.findAll({
                    order: [['nome', 'ASC']],
                })
                    .then((data) => {
                        var intermediarios = data.map((result) => result.get({
                            plain: true
                        }))
                        //adicionado o campo selecionado nos intermediarios
                        intermediarios = intermediarios.map((cli => {
                            if (cli.id == pedido.IntermediarioId)
                                cli.selecionado = true
                            else
                                cli.selecionado = false
                            return cli
                        }))
                        Produto.findAll({
                            order: [['nome', 'ASC']],
                        })
                            .then((data) => {
                                const produtos = data.map((result) => result.get({
                                    plain: true
                                }))
                                req.session.save(() => {
                                    res.render('pedido/pedido', {
                                        pedido, intermediarios,
                                        produtos, itens: false
                                    })
                                })
                            })
                    })
            })
            .catch((err) => console.log(err))
    }


    static async adicionarProdutoPost(req, res) {
        const produto = await Produto.findByPk(req.body.ProdutoId)
        const pedido_detalhe = {
            PedidoId: req.body.PedidoId,
            ProdutoId: req.body.ProdutoId,
            quantidade: req.body.quantidade,
            valor_unitario: produto.valor_unitario,
        }
        PedidoDetalhe.create(pedido_detalhe)
            .then((pedido_detalhe) => {
                pedido_detalhe = pedido_detalhe.get({ plain: true })
                pedido_detalhe.valor_total = pedido_detalhe.quantidade *
                    pedido_detalhe.valor_unitario
                pedido_detalhe.nome = produto.nome
                PedidoDetalhe.findAll({
                    where: { PedidoId: pedido_detalhe.PedidoId },
                    attributes: [[sequelize.fn(
                        'SUM',
                        sequelize.where(sequelize.col('quantidade'), '*',
                            sequelize.col('valor_unitario'))
                    ),
                        'total_pedido',],
                    [sequelize.fn('count', sequelize.col('PedidoId')), 'qtd_itens']
                    ],
                    raw: true
                })
                    .then((pedido) => {
                        pedido_detalhe.item = pedido[0].qtd_itens
                        const resposta = {
                            produto: pedido_detalhe, total_pedido:
                                pedido[0].total_pedido
                        }
                        req.session.save(() => {
                            res.json(resposta)
                        })
                    })
            })
    }

    static removeProdutoPost(req, res) {
        const id_item = req.body.id_item
        const id_pedido = req.body.id_pedido

        PedidoDetalhe.destroy({ where: { id: id_item } })
            .then(() => {
                PedidoDetalhe.findAll({
                    where: { PedidoId: id_pedido },
                    attributes: [[sequelize.fn(
                        'SUM',
                        sequelize.where(sequelize.col('quantidade'), '*',
                            sequelize.col('valor_unitario'))
                    ),
                        'total_pedido',]
                    ],
                    raw: true
                })
                    .then((pedido) => {
                        const resposta = {
                            item: id_item, total_pedido:
                                pedido[0].total_pedido
                        }
                        req.session.save(() => {
                            res.json(resposta)
                        })
                    })
            })
    }

    static editarPedidoPost(req, res) {
        const id = req.body.id
        PedidoDetalhe.findAll({
            where: { PedidoId: id },
            attributes: [[sequelize.fn(
                'SUM',
                sequelize.where(sequelize.col('quantidade'), '*',
                    sequelize.col('valor_unitario'))
            ),
                'total_pedido',],
            ],
            raw: true
        })
            .then((resultado) => {
                const pedido = {
                    IntermediarioId: req.body.intermediario,
                    UsuarioId: req.session.userid,
                    valor_pedido: resultado[0].total_pedido,
                    data: req.body.data,
                }
                Pedido.update(pedido, { where: { id: id } })
                    .then(() => {
                        req.flash('mensagem', 'Pedido salvo com sucesso!')
                        req.session.save(() => {
                            res.redirect('/pedido')
                        })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }


    static editarPedido(req, res) {
        const id = req.params.id
        Pedido.findOne({ where: { id: id }, raw: true })
            .then((pedido) => {
                pedido.data = pedido.data.toISOString().slice(0, 10)
                pedido.valor_pedido =
                    parseFloat(pedido.valor_pedido).toLocaleString('pt-BR', {
                        style: 'decimal',
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                    })
                PedidoDetalhe.findAll({
                    where: { PedidoId: id },
                    include: [{
                        model: Produto,
                        required: true
                    }],
                })
                    .then((data) => {
                        var itens = data.map((result) => result.get({
                            plain: true
                        }))
                        itens = itens.map((item => {
                            item.valor_total = item.quantidade * item.valor_unitario
                            item.valor_total =
                                parseFloat(item.valor_total).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            item.quantidade =
                                parseFloat(item.quantidade).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            item.valor_unitario =
                                parseFloat(item.valor_unitario).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            return item
                        }))
                        Intermediario.findAll({
                            order: [['nome', 'ASC']],
                        })
                            .then((data) => {
                                var intermediarios = data.map((result) => result.get({
                                    plain: true
                                }))
                                //adicionado o campo selecionado nos intermediarios
                                intermediarios = intermediarios.map((cli => {
                                    if (cli.id == pedido.IntermediarioId)
                                        cli.selecionado = true
                                    else
                                        cli.selecionado = false
                                    return cli
                                }))
                                Produto.findAll({
                                    order: [['nome', 'ASC']],
                                })
                                    .then((data) => {
                                        const produtos = data.map((result) =>
                                            result.get({ plain: true }))
                                        req.session.save(() => {
                                            res.render('pedido/pedido', {
                                                pedido,
                                                intermediarios, produtos, itens
                                            })
                                        })
                                    })
                            })
                    })
            })
            .catch((err) => console.log(err))
    }

    static imprimirPedido(req, res) {
        const id = req.params.id
        Pedido.findOne({ where: { id: id }, raw: true })
            .then((pedido) => {
                pedido.data = pedido.data.toISOString().slice(0, 10)
                pedido.valor_pedido =
                    parseFloat(pedido.valor_pedido).toLocaleString('pt-BR', {
                        style: 'decimal',
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                    })
                PedidoDetalhe.findAll({
                    where: { PedidoId: id },
                    include: [{
                        model: Produto,
                        required: true
                    }],
                })
                    .then((data) => {
                        var itens = data.map((result) => result.get({
                            plain: true
                        }))
                        itens = itens.map((item => {
                            item.valor_total = item.quantidade * item.valor_unitario
                            item.valor_total =
                                parseFloat(item.valor_total).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            item.quantidade =
                                parseFloat(item.quantidade).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            item.valor_unitario =
                                parseFloat(item.valor_unitario).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2, maximumFractionDigits: 2
                                })
                            return item
                        }))
                        Intermediario.findAll({
                            order: [['nome', 'ASC']],
                        })
                            .then((data) => {
                                var intermediarios = data.map((result) => result.get({
                                    plain: true
                                }))
                                //adicionado o campo selecionado nos intermediarios
                                intermediarios = intermediarios.map((cli => {
                                    if (cli.id == pedido.IntermediarioId)
                                        cli.selecionado = true
                                    else
                                        cli.selecionado = false
                                    return cli
                                }))
                                Produto.findAll({
                                    order: [['nome', 'ASC']],
                                })
                                    .then((data) => {
                                        const produtos = data.map((result) =>
                                            result.get({ plain: true }))
                                        req.session.save(() => {
                                            res.render('pedido/imprimir', {
                                                pedido,
                                                intermediarios, produtos, itens
                                            })
                                        })
                                    })
                            })
                    })
            })
            .catch((err) => console.log(err))
    }

    static removerPedido(req, res) {
        const id = req.body.id
        //Primeiro exclui os itens
        PedidoDetalhe.destroy({ where: { PedidoId: id } })
            .then(() => {
                //Depois exclui o pedido
                Pedido.destroy({ where: { id: id } })
                    .then(() => {
                        req.flash('mensagem', 'Pedido excluído com sucesso!')
                        req.session.save(() => {
                            res.redirect('/pedido')
                        })
                    })
            })
            .catch((err) => console.log(err))
    }


} //Finaliza a classe