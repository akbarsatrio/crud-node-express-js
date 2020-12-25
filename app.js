const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_db_mhs'
})

connection.connect()

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

app.use(express.static(__dirname + '/public')); //mention public directory
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'CRUD Mahasiswa',
    navBrand: 'CRUD',
    navMenu: ['Home', 'Data', 'Tentang'],
    navLink: ['/', '/data', '/tentang'],
  })
})

app.get('/data', (req, res) => {
  let sql = 'SELECT * FROM tbl_mahasiswa';
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    res.render('data', {
      title: 'Data Mahasiswa',
      navBrand: 'CRUD',
      navMenu: ['Home', 'Data', 'Tentang'],
      navLink: ['/', '/data', '/tentang'],
      dataMahasiswa: results
    })
  })
})

app.post('/data', (req, res) => {
  let sql = `INSERT INTO tbl_mahasiswa (nama, nim) VALUES (?)`;
  let values = [
    req.body.nama,
    req.body.nim
  ];
  connection.query(sql, [values], (error, data, fields) => {
    if(error) throw error;
    res.redirect('/data')
  })
})

app.get('/edit/:id', (req, res) => {
  let sql = `SELECT * FROM tbl_mahasiswa WHERE id=${req.params.id}`;
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    res.render('edit', {
      title: `Edit untuk Nama ${results[0].nama}`,
      navBrand: 'CRUD',
      navMenu: ['Home', 'Data', 'Tentang'],
      navLink: ['/', '/data', '/tentang'],
      dataMahasiswa: results
    })
  })
})

app.post('/edit/:id', (req, res) => {
  let sql = `UPDATE tbl_mahasiswa SET nama='${req.body.nama}', nim='${req.body.nim}' WHERE id=${req.params.id}`;
  connection.query(sql, (error, data, fields) => {
    if(error) throw error;
    res.redirect('/data')
  })
})

app.get('/delete/:id', (req, res) => {
  let sql = `DELETE FROM tbl_mahasiswa WHERE id=${req.params.id}`;
  connection.query(sql, (error, data, fields) => {
    if(error) throw error;
    res.redirect('/data')
  })
})

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    title: 'Tentang',
    navBrand: 'CRUD',
    navMenu: ['Home', 'Data', 'Tentang'],
    navLink: ['/', '/data', '/tentang'],
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})