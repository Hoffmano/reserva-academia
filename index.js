const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index', {title: 'Home'})
})

app.get('/entrar', (req, res) => {
	res.render('entrar', {title: 'Entrar'})
})

app.get('/cadastrar', (req, res) => {
	res.render('cadastrar', {title: 'Cadastrar'})
})

app.listen(port, () => {
	console.log('Site escutando em http://coccafukuda.ddns.net:${port}/')
})

