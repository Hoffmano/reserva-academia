const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index", { title: "Home" });
});

app.get("/entrar", (req, res) => {
	res.render("entrar", {
		title: "Login",
		nomes: [
			'gabriel',
			'mateus'
		],
	});
});

app.get("/cadastrar", (req, res) => {
	res.render("cadastrar", { title: "Cadastrar" });
});

app.get("/consultar-sala", (req, res) => {
	json = {
		title: "Consultar sala",
		reservas: [
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
			{
				socio: "Gabriel",
				data: "03/01/2020",
				inicio: "13:49",
				duracao: "2",
			},
		],
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
	console.log("Site escutando em http://coccafukuda.ddns.net:${port}/");
});

app.post("/entrar", urlencodedParser, (req, res) => {
	let parametros = {
		title: "Login",
		nomes: [],
	};
	knex.from("socio")
		.select("nome")
		.then((rows) => {
			for (row of rows) {
				parametros.nomes.push(
					{
						nome: `${row['nome']}`
					}
				)	
			}
			console.log(parametros);
			res.render("entrar", parametros);
		});
});

app.post("/consultar-sala", (req, res) => {
	json = {
		title: "Consultar sala",
		reservas: [
			{
				socio: 'Gabriel',
				data: '03/01/2020',
				duracao: '2'
			},
			{
				socio: 'Gabriel',
				data: '03/01/2020',
				duracao: '2'
			},
			{
				socio: 'Gabriel',
				data: '03/01/2020',
				duracao: '2'
			},
			{
				socio: 'Gabriel',
				data: '03/01/2020',
				duracao: '2'
			}
		]
	};
	res.render("consultar_sala", json);
});

var knex = require("knex")({
	client: "mysql",
	connection: {
		host: "coccafukuda.ddns.net",
		user: "bdtrab",
		password: "I6#no#",
		database: "BDTrab",
	},
});
