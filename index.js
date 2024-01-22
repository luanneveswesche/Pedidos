const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

//Instancia o express,handlebars e mid dos formulários
const app = express();

const conn = require("./db/conn");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static('public'))


//middleware do controle de sessão
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () { },
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)
// flash messages
app.use(flash());


// Importa os Models para a criação das tabelas
const Usuario = require("./models/Usuario");
const Intermediario = require("./models/Intermediario");
const Produto = require("./models/Produto");
const Pedido = require("./models/Pedido");
const Pedido_Detalhe = require("./models/Pedido_Detalhe");
const Entrada_Produto = require("./models/Entrada_Produto");


//Rota inicial da aplicação - antes do listen
const verificaSessao = require("./helpers/sessao").verificaSessao;

const DashboardController = require("./controllers/DashboardController");

app.get('/',verificaSessao, DashboardController.mostrarDashboard)

app.get('/login', function (req, res) {
    res.render('login',{layout:false})
  })

  //Logout
app.get('/logout', function (req, res) {
    req.session.destroy()
    res.redirect('/login')
  })
  

//Rotas dos models
const produtoRoutes = require("./routes/produtoRoutes");
app.use("/produto", produtoRoutes);

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuario", usuarioRoutes);

const pedidoRoutes = require("./routes/pedidoRoutes");
app.use("/pedido", pedidoRoutes);

const intermediarioRoutes = require("./routes/intermediarioRoutes");
app.use("/intermediario", intermediarioRoutes);

const entrada_produtoRoutes = require("./routes/entrada_produtoRoutes");
app.use("/entrada_produto", entrada_produtoRoutes);


   

//Inicia (escuta) a aplicação somente depois de conectar ao BD
conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));