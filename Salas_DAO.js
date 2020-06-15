var knex = require("knex")({
	client: "mysql",
	connection: {
		host: "coccafukuda.ddns.net",
		user: "bdtrab",
		password: "I6#no#",
		database: "BDTrab",
	},
});

class Salas_DAO {
	constructor() {}

	json = {
		title: "Consultar sala",
		reservas: [],
	};

	consultar(sala) {
		knex.from(sala)
			.where(sala.id, sala)
			.join("reserva_quadra", "sala.id", "=", "reserva_quadra.id_quadra")
			.join(socio, id_socio, "=", socio.id)
			.select(nome, inicio, duracao)
			.then((rows) => {
				for (row of rows) {
					json.reservas.push({
						socio: `${row["nome"]}`,
						data: `${row["inicio"]}`,
						duracao: `${row["duracao"]}`,
					});
				}
				console.log(parametros);
				res.render("entrar", parametros);
			});
	}
}
