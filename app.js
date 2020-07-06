'use strict'
//Cargar modulos de node.js
var express=require("express");
var bodyparser=require("body-parser");

//Ejecutar el express servidor http
var app=express();

//Cargar archivos de ruta
var estudianteroutes=require('./routes/estudiante')

//Configurar middlware ¿como vamos a mandar los datos?
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//CORS para las peticiones del frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos
app.use('/', estudianteroutes);

//Ruta de prueba
/*

app.get('/prueba',(req,res)=>{
    return res.status(200).send({
        mensaje: 'bienvenidos',
        mensaje2: ':)',

    })
})*/

//Exportar los modulos
module.exports=app;