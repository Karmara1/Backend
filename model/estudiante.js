'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var EstudienteSchema=Schema({
    nombre:String,
    apellido:String,
    cedula:Number,
    fecha_matricula:{type:Date, default:Date.now},
    image:String,
});
module.exports=mongoose.model('Estudiante',EstudienteSchema);

//Se exporta porque le decimos a las otras clases que lo  usen