const express = require("express");
const handlebars = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");

const app = express();
const connections = require("./db/connection");

/* IMPORTAÇÃO DOS MODELOS PARA O BANCO DE DADOS:
  - Tought: Modelo Sequelize que representa pensamentos/reflexões dos usuários.
    * Funcionalidade: Armazena e gerencia pensamentos criados pelos usuários do sistema.
  
  - User: Modelo Sequelize que representa os usuários da aplicação.
    * Funcionalidade: Gerencia autenticação, registro e dados pessoais dos usuários.
*/
const Tought = require("./models/Tought");
const User = require("./models/User");

/* CONFIGURAÇÃO DE VIEW ENGINE:
- Define o Handlebars como template engine para renderizar arquivos .handlebars
- app.engine() registra o engine personalizado
- app.set() define qual engine será usado por padrão
*/
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

/* MIDDLEWARE - ARQUIVOS ESTÁTICOS:
- Serve arquivos estáticos (CSS, JS, imagens, etc.) da pasta "public".
- Qualquer arquivo em public/ será acessível diretamente sem rota específica.
*/
app.use(express.static("public"));

/* MIDDLEWARE - PROCESSAMENTO DE DADOS:
- Middleware para processar dados de formulários HTML (application/x-www-form-urlencoded).
- express.urlencoded({ extended: true }) = true permite objetos complexos e arrays nos dados do formulário
- express.json() = Middleware para processar dados em formato JSON (application/json)
*/
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// Configuração do session middleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
);

// Configuração das flash messages
app.use(flash());

// Configuração do set session to res
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});

/* IMPORTAÇÃO DE ROTAS E CONTROLLERS:
  - toughtsRoutes = Módulo contendo todas as rotas relacionadas a operações CRUD de pensamentos.
  - ToughtController = Controlador que contém a lógica para lidar com as requisições relacionadas aos pensamentos.
  - app.use("/toughts", toughtsRoutes) = Define que todas as rotas em toughtsRoutes serão acessíveis a partir do caminho /toughts.
  - app.get("/", ToughtController.showToughts) = Rota raiz que renderiza a página inicial mostrando os pensamentos.
*/
const toughtsRoutes = require("./routes/toughtsRoutes");
const ToughtController = require("./controllers/ToughtController");
app.use("/toughts", toughtsRoutes);
app.get("/", ToughtController.showToughts);

/* 
- authRoutes = Módulo contendo todas as rotas relacionadas à autenticação (login, registro, etc.).
- app.use("/", authRoutes) = Define que todas as rotas em authRoutes serão acessíveis a partir do caminho /.
*/
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

/* SINCRONIZAÇÃO DO BANCO DE DADOS E CONFIGURAÇÃO DO SERVIDOR:
- connection.sync() = Sincroniza os modelos com o banco de dados, criando as tabelas se necessário.
- force: false = Não força a recriação das tabelas, preservando os dados existentes.
*/
const PORT = process.env.PORT || 3000;

connections
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Não foi possível conectar ao banco de dados: ${error}`);
  });
