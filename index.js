const express = require("express");
const bodyParser = require("body-parser");
const dao = require("./dao");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index", { title: "Home" });
});

app.get("/entrar", (req, res) => {
	res.render("entrar", { title: "Login" });
});

app.post("/entrar", urlencodedParser, async (req, res) => {
	let parametros = {
		title: "Login",
	};
	let username = await dao.consultar_login(req.body.user, req.body.password);
	if (username != undefined) {
		res.cookie('username', username);
		res.render('entrar', {title: "Login", success: true, nome: username});
	} else {
		res.render('entrar', {title: "Login", success: false});
	}
});

app.get("/cadastrar", (req, res) => {
	res.render("cadastrar", { title: "Cadastrar" });
});

app.get("/consultar-sala", (req, res) => {
	res.render("consultar_sala", { title: "Consultar sala" });
});

app.get("/agendar", (req, res) => {
	res.render("agendar_sala", { title: "Agendar" });
});

app.get("/consultar-socio", (req, res) => {
	res.render("consultar_socio", { title: "Consultar sóico" });
});


app.listen(port, () => {
	console.log("Follow link: http://localhost:3000");
});


app.use(express.urlencoded());
app.use(express.json());

app.post("/consultar-sala", async (req, res) => {
	let json = {
		title: "Consultar sala",
		sala: req.body.sala,
		reservas: [],
	}
	const consultar_disponibilidade_response = await dao.consultar_disponibilidade(json)
	res.render("consultar_sala", consultar_disponibilidade_response);
})
