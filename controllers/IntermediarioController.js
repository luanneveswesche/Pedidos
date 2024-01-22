const Intermediario = require('../models/Intermediario')

const { Op } = require('sequelize')

module.exports = class IntermediarioController {
    static mostrarIntermediarios(req, res) {

        // order resultados, novos registros primeiro
        let ordenar = 'DESC'

        Intermediario.findAll({
            order: [['createdAt', ordenar]],
            limit: 1000,
        })
            .then((data) => {
                let qtd = data.length

                if (qtd === 0) {
                    qtd = false
                }

                const resultado = data.map((result) => result.get({ plain: true }))

                res.render('intermediario/listar', { resultado, qtd })
            })
            .catch((err) => console.log(err))
    }

    static criarIntermediario(req, res) {
        res.render('intermediario/criar')
    }

    static criarIntermediarioPost(req, res) {
        const intermediario = {
            nome: req.body.nome,
            cidade: req.body.cidade,
            uf: req.body.uf,
            email: req.body.email,
            telefone: req.body.telefone,
        }
        Intermediario.create(intermediario)
            .then(() => {
                req.flash('mensagem', 'Intermediario criado com sucesso!')
                req.session.save(() => {
                    res.redirect('/intermediario')
                })
            })
            .catch((err) => console.log(err))

    }

    static editarIntermediario(req, res) {
        const id = req.params.id
        Intermediario.findOne({ where: { id: id }, raw: true })
            .then((intermediario) => {
                res.render('intermediario/editar', { intermediario })
            })
            .catch((err) => console.log(err))
    }

    static editarIntermediarioPost(req, res) {
        const id = req.body.id
        const intermediario = {
            nome: req.body.nome,
            cidade: req.body.cidade,
            uf: req.body.uf,
            email: req.body.email,
            telefone: req.body.telefone,
        }
        Intermediario.update(intermediario, { where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Intermediario alterado com sucesso!')
                req.session.save(() => {
                    res.redirect('/intermediario')
                })
            })
            .catch((err) => console.log(err))

    }
    static removerIntermediario(req, res) {
        const id = req.body.id
        Intermediario.destroy({ where: { id: id } })
            .then(() => {
                req.flash('mensagem', 'Intermediario excluído com sucesso!')
                req.session.save(() => {
                    res.redirect('/intermediario')
                })
            })
            .catch((err) => console.log(err))
    }

} //Finaliza a classe
