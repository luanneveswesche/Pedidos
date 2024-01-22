const Produto = require('../models/Produto')

const { Op } = require('sequelize')

module.exports = class ProdutoController {
    static mostrarProdutos(req, res) {

        // order resultados, novos registros primeiro
        let ordenar = 'DESC'

        Produto.findAll({
            order: [['createdAt', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length

                if (qtd === 0) {
                    qtd = false
                }

                const resultado = data.map((result) => result.get({ plain: true }))

                res.render('produto/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }

    static criarProduto(req, res) {
        res.render('produto/criar')
    }

    static criarProdutoPost(req, res) {
        const produto = {
            nome: req.body.nome,
            unidade: req.body.unidade,
            valor_unitario: req.body.valor_unitario,
        }
        Produto.create(produto)
            .then(() => {
                req.flash('mensagem', 'Produto criado com sucesso!')
                req.session.save(() => {
                    res.redirect('/produto')
                })
            })
            .catch((err) => console.log(err))
        
    }

    static editarProduto(req, res) {
        const id = req.params.id
        Produto.findOne({ where: { id: id }, raw: true })
            .then((produto) => {
                res.render('produto/editar', { produto })
            })
            .catch((err) => console.log(err))
    }

    static editarProdutoPost(req, res) {
        const id = req.body.id
        const produto = {
            nome: req.body.nome,
            unidade: req.body.unidade,
            valor_unitario: req.body.valor_unitario,
        }
        Produto.update(produto, { where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Produto alterado com sucesso!')
                req.session.save(() => {
                    res.redirect('/produto')
                })
            })
            .catch((err) => console.log(err))
        
    }
    static removerProduto(req, res) {
        const id = req.body.id
        Produto.destroy({ where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Produto excluído com sucesso!')
                req.session.save(() => {
                    res.redirect('/produto')
                })
            })
            .catch((err) => console.log(err))
    }

} //Finaliza a classe
