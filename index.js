const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dao = require("./dao");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());


let check_username = (req) => {
	return req.cookies != undefined ? req.cookies.username : undefined;
};

let check_username_anyways = (req) => {
	let username = check_username(req);
	return username == undefined ? "" : check_username(req);
};

app.get("/", (req, res) => {
	res.render("index", {
		username: check_username_anyways(req),
		title: "Home",
	});
});

app.get("/entrar", (req, res) => {
	res.render("entrar", {
		username: check_username_anyways(req),
		title: "Login",
	});
});

app.post("/entrar", urlencodedParser, async (req, res) => {
	let username = await dao.consultar_login(req.body.user, req.body.password);
	if (username != undefined) {
		res.cookie("username", username);
		res.render("entrar", {
			username: username,
			title: "Login",
			success: true,
			nome: username,
		});
	} else {
		res.render("entrar", {
			username: username,
			title: "Login",
			success: false,
		});
	}
});

app.get("/cadastrar", (req, res) => {
	res.render("cadastrar", {
		username: check_username_anyways(req),
		title: "Cadastrar",
	});
});

app.get("/consultar-sala", (req, res) => {
	res.render("consultar_sala", {
		username: check_username(req),
		title: "Consultar sala",
	});
});

app.get("/agendar", (req, res) => {
	res.render("agendar_sala", {
		username: check_username(req),
		title: "Agendar",
	});
});

app.get("/consultar-socio", (req, res) => {
	res.render("consultar_socio", {
		username: check_username(req),
		title: "Consultar socio",
	});
});

app.post("/entrar", urlencodedParser, async (req, res) => {
    let username = await dao.consultar_login(req.body.user, req.body.password);
    if (username != undefined) {
        res.cookie("username", username);
        res.render("entrar", {
            username: username,
            title: "Login",
            success: true,
            nome: username,
        });
    } else {
        res.render("entrar", {
            username: username,
            title: "Login",
            success: false,
        });
    }
});

app.post("/consultar-socio", (req, res) => {
	let json = {
		username: check_username(req),
		title: "Consultar sócio",
		cpf: req.body.cpf,
		reservas: [],
	};
	
	dao.consultar_socio(json).then(function (data) {
		res.render("consultar_socio", data);
	});
});

app.post("/agendar", (req, res) => {
	console.log("\n----------------\nINICIANDO AGENDAMENTO");

	let json = {
		username: check_username(req),
		title: "Agendar sala",
		sala: Number(req.body.sala),
		data: req.body.data,
		hora: req.body.hora,
		duracao: req.body.duracao,
		reservas: [],
		disponivel: true,
	};

	dao.consultar_horario(json).then(function (data) {
		console.log(data);
		
		if (data.disponivel) {
			console.log("DISPONIVEL");
			return dao.agendar(data);
		}
		else {
			console.log("NAO DISPONIVEL");
			return false
		}
	}).then(function (data1) {
		if (data1) {
			console.log('AGENDADO');
		}
	});

	res.render("agendar_sala", json);
});

app.post("/consultar-sala", async (req, res) => {
	let json = {
		title: "Consultar sala",
		sala: req.body.sala,
		reservas: [],
	};
	const consultar_disponibilidade_response = await dao.consultar_disponibilidade(
		json
	);
	res.render("consultar_sala", consultar_disponibilidade_response);
});



app.listen(port, () => {
	console.log("Follow link: http://localhost:3000");
});
