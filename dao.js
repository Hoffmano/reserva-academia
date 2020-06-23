
var knex = require("knex")({
	client: "mysql",
	connection: {
		host: "coccafukuda.ddns.net",
		user: "bdtrab",
		password: "I6#no#",
		database: "BDTrab",
	},
});

exports.consultar_login = (username, password) => {
	return new Promise((res, rej) => {
		res(
			knex.from("socio")
				.select("username")
				.where("username", username)
				.andWhere("password", password)
				.first()
				.then((rows) => {
					if(rows != undefined) return(rows.username);
					else return(undefined);
				})
		)
	})
};

exports.consultar_disponibilidade = function consultar_disponibilidade(json) {
	return new Promise((resolve, reject, ) => {
		resolve(
			knex.from("quadra")
			.where("quadra.id", json.sala)
			.join("reserva_quadra", "quadra.id", "=", "reserva_quadra.id_quadra")
			.join("socio", "reserva_quadra.id_socio", "=", "socio.id")
			.select("nome", "inicio", "duracao")
			.then((rows) => {
				for (row of rows) {
					const data = `${row["inicio"]}`.split(" ");
					json.reservas.push({
						socio: `${row["nome"]}`,
						data:
							data[2] +
							" de " +
							data[1] +
							" de " +
							data[3] +
							" às " +
							data[4],
						duracao: `${row["duracao"]}`,
					})
				}
				return json
			})
		)
	})
};
