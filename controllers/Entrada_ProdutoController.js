const Entrada_Produto = require('../models/Entrada_Produto')

const { Op } = require('sequelize')

module.exports = class Entrada_ProdutoController {
    static mostrarEntrada_Produtos(req, res) {

        // order resultados, novos registros primeiro
        let ordenar = 'DESC'

        Entrada_Produto.findAll({
            order: [['createdAt', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length

                if (qtd === 0) {
                    qtd = false
                }

                const resultado = data.map((result) => result.get({ plain: true }))

                res.render('entrada_produto/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }

    static criarEntrada_Produto(req, res) {
        res.render('entrada_produto/criar')
    }

    static criarEntrada_ProdutoPost(req, res) {
        const entrada_produto = {
            produto: req.body.produto,
            peso: req.body.peso,
            data: req.body.data,
        }

        Entrada_Produto.create(entrada_produto)
            .then(() => {
                req.flash('mensagem', 'Entrada do produto criado com sucesso!')
                req.session.save(() => {
                    res.redirect('/entrada_produto')
                })
            })
            .catch((err) => console.log(err))
    }

    static editarEntrada_Produto(req, res) {
        const id = req.params.id
        Entrada_Produto.findOne({ where: { id: id }, raw: true })
            .then((entrada_produto) => {
                res.render('entrada_produto/editar', { entrada_produto })
            })
            .catch((err) => console.log(err))
    }

    static editarEntrada_ProdutoPost(req, res) {
        const id = req.body.id
        const entrada_produto = {
            produto: req.body.produto,
            peso: req.body.peso,
            data: req.body.data,
        }
        Entrada_Produto.update(entrada_produto, { where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Entarada do Produto alterado com sucesso!')
                req.session.save(() => {
                    res.redirect('/entrada_produto')
                })
            })
            .catch((err) => console.log(err))

    }

    static removerEntrada_Produto(req, res) {
        const id = req.body.id
        Entrada_Produto.destroy({ where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Entrada do Produto excluído com sucesso!')
                req.session.save(() => {
                    res.redirect('/entrada_produto')
                })
            })
            .catch((err) => console.log(err))
    }
}
