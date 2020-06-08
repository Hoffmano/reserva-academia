const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const knex = require("knex")({
	client: "mysql",
	connection: {
		host: "coccafukuda.ddns.net",
		user: "bdtrab",
		password: "I6#no#",
		database: "BDTrab",
	},
});

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
	console.log("Site escutando em http://coccafukuda.ddns.net:${port}/");
});

app.post("/entrar", (req, res) => {
	let parametros = {
		title: "Login",
		// nomes: [],
	};
	// knex.from("socio")
	// 	.select("nome")
	// 	.then((rows) => {
	// 		for (row of rows) {
	// 			parametros.nomes.push(
	// 				{
	// 					nome: `${row['nome']}`
	// 				}
	// 			)	
	// 		}
	// 		console.log(parametros);
	// 		res.render("entrar", parametros);
	// 	});
});

app.use(express.urlencoded());
app.use(express.json());



app.post("/consultar-sala", (req, res) => {
	json = {
		title: "Consultar sala",
		reservas: []
	};
	
	console.log(req.body.sala);

	const knex = require("knex")({
		client: "mysql",
		connection: {
			host: "coccafukuda.ddns.net",
			user: "bdtrab",
			password: "I6#no#",
			database: "BDTrab",
		},
	});

	knex.from('quadra')
		.where('quadra.id', Number(req.body.sala))
		.join("reserva_quadra", "quadra.id", "=", "reserva_quadra.id_quadra")
		.join("socio", "reserva_quadra.id_socio", "=", "socio.id")
		.select("nome", "inicio", "duracao")
		.then((rows) => {			
			for (row of rows) {
				console.log(json);
				json.reservas.push({
					socio: `${row["nome"]}`,
					data: `${row["inicio"]}`,
					duracao: `${row["duracao"]}`,
				});
			}

			console.log(json);
			
			res.render("/consultar-sala", json);
		});
});


