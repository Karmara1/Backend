'use strict'
var mongoose=require('mongoose'); //Conectar Node con MongoDB
var app=require('./app');
var port=3900;

mongoose.connect('mongodb://localhost:27017/estudiante',{useNewUrlParser:true})//Primer campo, direccion del servidor, segundo campo opcional
.then(()=>{
    console.log('Conectados');
    app.listen(port,()=>{
        console.log('servidor corriendo en http://localhost:'+port);
    })
})