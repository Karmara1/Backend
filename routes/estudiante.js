'use strict'
var express=require('express');//Hace la magia de crear la ruta
var PersonaController=require('../controller/estudiante');//Importa la ruta
var router=express.Router();//Creamos variablrd psra las rutas
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./upload/estudiante'});
// Decir las funciones de las rutas
/* Get= Mostrar datos / Listar
Post= Pasar datos al servidor / guardar
Delete= Borrar datos
Put= Actualizar / Editar
*/ 

router.get('/brindar', PersonaController.datosestudiante);
router.post('/save', PersonaController.save);
router.get('/list/:parametro?', PersonaController.get_estudiantes);
router.get('/buscar/:id', PersonaController.get_estudiantebyid);
router.post('/edit/:id', PersonaController.update);
router.delete('/delete/:cosa', PersonaController.delete);
router.get('/find/:parametro', PersonaController.search);
router.post('/upload/:id', md_upload,PersonaController.upload);
module.exports=router;