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
			knex
				.from("socio")
				.select("username")
				.where("username", username)
				.andWhere("password", password)
				.first()
				.then((rows) => {
					if (rows != undefined) return rows.username;
					else return undefined;
				})
		);
	});
};

exports.consultar_disponibilidade = function consultar_disponibilidade(json) {
	return new Promise((resolve, reject) => {
		resolve(
			knex
				.from("quadra")
				.where("quadra.id", json.sala)
				.joinRaw("join reserva_quadra")
				.whereRaw("quadra.id = reserva_quadra.id_quadra")
				.joinRaw("join socio")
				.whereRaw("reserva_quadra.id_socio = socio.id")
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
						});
					}
					return json;
				})
		);
	});
};

exports.verificar_socio = function verificar_socio(input_data) {
	return new Promise((resolve, reject) => {
		resolve(
			knex
				.from("socio")
				.where("socio.cpf", input_data.socio)
				.then((rows) => {
					if (rows.length == 1) {
						input_data.socio_verificado = true;
						return input_data;
					} else {
						return input_data;
					}
				})
		);
	});
};

exports.consultar_horario = function consultar_horario(input_data) {
	return new Promise((resolve, reject) => {
		resolve(
			knex
				.from("reserva_quadra")
				.joinRaw("join quadra")
				.whereRaw("reserva_quadra.id_quadra = quadra.id")
				.joinRaw("join socio")
				.whereRaw("reserva_quadra.id_socio = socio.id")
				.where("socio.cpf", input_data.socio)
				.where("quadra.numero_quadra", input_data.sala)
				.then((rows) => {
					let month_names = new Map();

					month_names.set("Jan", 0);
					month_names.set("Feb", 1);
					month_names.set("Mar", 2);
					month_names.set("Apr", 3);
					month_names.set("May", 4);
					month_names.set("Jun", 5);
					month_names.set("Jul", 6);
					month_names.set("Aug", 7);
					month_names.set("Sep", 8);
					month_names.set("Out", 9);
					month_names.set("Nov", 10);
					month_names.set("Dec", 11);

					input_data.data = input_data.data.split("-");
					input_data.hora = input_data.hora.split(":");
					input_data.duracao = input_data.duracao.split(":");

					input_data.reserva = {
						ano: Number(input_data.data[0]),
						mes: Number(input_data.data[1].replace("0", "")),
						dia: Number(input_data.data[2]),
						hora: Number(input_data.hora[0]),
						minuto: Number(input_data.hora[1]),
						hora_duracao: Number(input_data.duracao[0]),
						minuto_duracao: Number(input_data.duracao[1]),
					};

					schedule = input_data.reserva;

					let date_reserva_inicio = new Date(
						schedule.ano,
						schedule.mes - 1,
						schedule.dia,
						schedule.hora,
						schedule.minuto
					);
					let date_reserva_fim = new Date(
						schedule.ano,
						schedule.mes - 1,
						schedule.dia,
						schedule.hora_duracao + schedule.hora,
						schedule.minuto_duracao + schedule.minuto
					);

					for (row of rows) {
						const data = `${row["inicio"]}`.split(" ");
						const hora = data[4].split(":");
						const duracao = row["duracao"].split(":");

						let scheduled_start = new Date(
							Number(data[3]),
							Number(month_names.get(data[1])),
							Number(data[2]),
							Number(hora[0]),
							Number(hora[1])
						);

						let scheduled_end = new Date(
							Number(data[3]),
							Number(month_names.get(data[1])),
							Number(data[2]),
							Number(hora[0]) + Number(duracao[0]),
							Number(hora[1]) + Number(duracao[1])
						);

						if (
							date_reserva_inicio.getFullYear() ===
							scheduled_start.getFullYear()
						) {
							if (
								date_reserva_inicio.getMonth() ===
								scheduled_start.getMonth()
							) {
								if (
									date_reserva_inicio.getDay() ===
									scheduled_start.getDay()
								) {
									if (
										scheduled_start < date_reserva_fim &&
										scheduled_end >= date_reserva_fim
									) {
										input_data.disponivel = false;
										return input_data;
									} else if (
										scheduled_start <=
											date_reserva_inicio &&
										scheduled_end >= date_reserva_fim
									) {
										input_data.disponivel = false;
										return input_data;
									} else if (
										scheduled_start <=
											date_reserva_inicio &&
										scheduled_end > date_reserva_inicio
									) {
										input_data.disponivel = false;
										return input_data;
									}
								}
							}
						}
					}
					return input_data;
				})
		);
	});
};

exports.agendar = function agendar(json) {
	return new Promise((resolve, reject) => {
		resolve(
			knex("reserva_quadra")
				.insert({
					id_socio: json.socio,
					id_quadra: json.sala,
					inicio: `${json.reserva.ano}-${json.reserva.mes}-${json.reserva.dia} ${json.reserva.hora}:${json.reserva.minuto}:00`,
					duracao: `${json.reserva.hora_duracao}:${json.reserva.minuto_duracao}:00`,
				})
				.then(() => {
					return true;
				})
		);
	});
};

exports.get_id = function get_id(json) {
	return new Promise((resolve, reject) => {
		resolve(
			knex
				.from("socio")
				.where("socio.cpf", json.socio)
				.first()
				.then((socio) => {
					json.socio = `${socio["id"]}`;
					return json;
				})
		);
	});
};

exports.get_id_2 = function get_id_2(json) {
	return new Promise((resolve, reject) => {
		resolve(
			knex
				.from("socio")
				.where("socio.cpf", json.cpf)
				.first()
				.then((socio) => {
					json.cpf = `${socio["id"]}`;
					return json;
				})
		);
	});
};

exports.consultar_socio = function consultar_socio(json) {
	return new Promise((resolve, reject) => {
		console.log("consultar socio");

		resolve(
			knex
				.from("socio")
				.where("socio.id", json.cpf)
				.joinRaw( "join reserva_quadra")
				.whereRaw("socio.id = reserva_quadra.id_socio")
				.joinRaw(" join quadra")
				.whereRaw("reserva_quadra.id_quadra=quadra.id")
				.select("numero_quadra", "inicio", "duracao", "nome")
				.then((rows) => {
					for (row of rows) {
						json.finded = true;
						const data = `${row["inicio"]}`.split(" ");
						const hora = data[4].split(":");
						const duracao = row["duracao"].split(":");

						json.reservas.push({
							nome: `${row["nome"]}`,
							sala: `${row["numero_quadra"]}`,
							data:
								data[2] +
								" de " +
								data[1] +
								" de " +
								data[3] +
								" às " +
								data[4],
							duracao: `${row["duracao"]}`,
						});
					}
					return json;
				})
		);
	});
};
