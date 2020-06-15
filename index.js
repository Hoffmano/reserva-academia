const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex")({
	client: "mysql",
	connection: {
		host: "192.168.15.10",
		user: "bdtrab",
		password: "I6#no#",
		database: "BDTrab",
	},
});

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
	res.render("consultar_socio", { title: "Consultar sóco" });
});

app.post("/entrar", urlencodedParser, (req, res) => {
	let parametros = {
		title: "Login",
		nomes: []
	};
	knex.from("socio")
		.select("nome")
		.where("nome", req.body.user)
		.then((rows) => {
			for (row of rows) {
				parametros.nomes.push(`${row['nome']}`);
			}
			res.cookie("username", `${row['nome']}`);
			res.render("entrar", parametros);
		});
});

app.post("/consultar-sala", (req, res) => {
	json = {
		title: "Consultar sala",
		sala: req.body.sala,
		reservas: []
	};

	knex.from("quadra")
		.where("quadra.id", Number(req.body.sala))
		.join("reserva_quadra", "quadra.id", "=", "reserva_quadra.id_quadra")
		.join("socio", "reserva_quadra.id_socio", "=", "socio.id")
		.select("nome", "inicio", "duracao")
		.then((rows) => {
			for (row of rows) {
				const data = `${row["inicio"]}`.split(" ")
				json.reservas.push({
					socio: `${row["nome"]}`,
					data: data[2] + " de " + data[1] + 
					' de ' + data[3] + ' às ' + data[4],
					duracao: `${row["duracao"]}`,
				});
			}			
			res.render("consultar_sala", json);
		});
});

app.listen(port, () => {
	console.log("Follow link: http://localhost:3000");
});

