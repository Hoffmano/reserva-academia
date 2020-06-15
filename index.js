const express = require("express");
const dao = require("./dao");

knex = dao.getConnection()

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index", { title: "Home" });
});

app.get("/entrar", (req, res) => {
	res.render("entrar", {
		title: "Login",
	});
});

app.get("/cadastrar", (req, res) => {
	res.render("cadastrar", { title: "Cadastrar" });
});

app.get("/consultar-sala", (req, res) => {
	json = {
		title: "Consultar sala",
	};
	res.render("consultar_sala", json);
});

app.get("/agendar", (req, res) => {
	res.render("agendar_sala", { title: "Agendar" });
});

app.get("/consultar-socio", (req, res) => {
	res.render("consultar_socio", { title: "Consultar sócio" });
});

app.listen(port, () => {
	console.log("Follow link: http://localhost:3000");
});

app.post("/entrar", (req, res) => {
	let parametros = {
		title: "Login",
	};
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