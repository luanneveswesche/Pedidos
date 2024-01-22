const db = require("../db/conn")

module.exports = class DashboardController{

    static async mostrarDashboard(req,res){

        //Mostrar vendas do dia
        var sql = "SELECT IFNULL(SUM(valor_pedido),0) AS Valor FROM pedidos WHERE data = CURDATE();";

        var resultado = await db.query(sql,{type : db.QueryTypes.SELECT,
        raw :true});

        const vendasDia = parseFloat(resultado[0].Valor).toLocaleString('pt-BR',{
            style: 'decimal',
            minimumFractionDigits:2,
            maximumFractionDigits:2
        });



        //Mostrar vendas do mês
        var sql = "SELECT IFNULL(SUM(valor_pedido),0) AS Valor FROM pedidos WHERE YEAR(data) = YEAR(now()) AND MONTH(data) = MONTH(now());";

        var resultado = await db.query(sql,{type : db.QueryTypes.SELECT,
        raw :true});

        const vendasMes = parseFloat(resultado[0].Valor).toLocaleString('pt-BR',{
            style: 'decimal',
            minimumFractionDigits:2,
            maximumFractionDigits:2
        });

       //Mostrar qtd intermediarios
       var sql = "SELECT IFNULL(COUNT(*),0) AS Valor FROM intermediarios;";

       var resultado = await db.query(sql,{type : db.QueryTypes.SELECT,
       raw :true});

       const qtdIntermediarios = parseFloat(resultado[0].Valor).toLocaleString('pt-BR',{
           style: 'decimal',
           minimumFractionDigits:0,
           maximumFractionDigits:0
       });

       //Mostrar qtd intermediarios
       var sql = "SELECT IFNULL(COUNT(*),0) AS Valor FROM produtos;";

       var resultado = await db.query(sql,{type : db.QueryTypes.SELECT,
       raw :true});

       const qtdProdutos = parseFloat(resultado[0].Valor).toLocaleString('pt-BR',{
           style: 'decimal',
           minimumFractionDigits:0,
           maximumFractionDigits:0
       });


       //Grafico Vendas Meses
       var sql = `SELECT MONTH(data) AS MES, YEAR(data) AS ANO, (IFNULL(SUM(valor_pedido),0)) AS VALOR
       FROM pedidos
       WHERE (MONTH(DATE(data)) >= MONTH(ADDDATE(NOW(), INTERVAL -5 MONTH))) 
       AND (YEAR(DATE(data)) >= YEAR(ADDDATE(NOW(), INTERVAL -5 MONTH)))
       GROUP BY MES,ANO ORDER BY MES ASC;`;

       var vendas5Meses = await db.query(sql,{type : db.QueryTypes.SELECT,
       raw :true});

       //Grafico Vendas Produto
       var sql = `SELECT C.id, C.nome AS nome_produto, (IFNULL(SUM(B.quantidade*B.valor_unitario),0)) AS VALOR
       FROM pedidos A
       INNER JOIN pedido_detalhes B ON (B.PedidoId = A.id)
       INNER JOIN produtos C ON (C.id = B.ProdutoId)
       WHERE 
       YEAR(A.data) = YEAR(NOW()) AND MONTH(A.data) = MONTH(NOW()) 
       GROUP BY C.id;`;

       var vendasProdutos = await db.query(sql,{type : db.QueryTypes.SELECT,
       raw :true});



        res.render('home', {vendasDia,vendasMes,qtdIntermediarios,qtdProdutos,vendas5Meses,vendasProdutos})

    }

}
