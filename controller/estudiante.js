'use strict'
var validator1=require('validator');
var Estudiante=require('../model/estudiante');
const {default: validator} = require('validator');
const estudiante = require('../model/estudiante');
var fs=require('fs');
const { resolve } = require('path');
var path=require('path');
const e = require('express');
var controller={
    datosestudiante:(req,res)=>{
        console.log('Cualquier Mensaje');
        return res.status(200).send({
            nombre:'Karlimar Piza',
            curso:'FS',
            nota: '0',
        })
    }, //La variable controlador es un Json, por lo que se necesita una coma al finak
    save:(req,res)=>{
        //Recoger parametros
        var params=req.body;
        console.log(params);

        //Validar los datos
        try{
            var validar_nombre=!validator1.isEmpty(params.nombre);
            var validar_apellido=!validator1.isEmpty(params.apellido);
            var validar_cedula=!validator1.isEmpty(params.cedula);

        }
        catch(err){
            return res.status(404).send({
                message:"Escriba bien",
            })
        }
        
        // Guardamos
        var estudiante= new Estudiante;
        estudiante.nombre=params.nombre;
        estudiante.apellido=params.apellido;
        estudiante.cedula=params.cedula;

        estudiante.save((err,EstudianteStired)=>{
            if(err || !EstudianteStired){
                return res.status(404).send({
                    status:'error',
                    message:'yaper',
                })
            }
            // Devolver valoe
            return res.status(200).send({
                status:'Todo bien',
                message: EstudianteStired,
            })
        })
    },

    get_estudiantes:(req,res)=>{
        var query=Estudiante.find({});
        var variable=req.params.parametro;
        //Estudiante.find({}).exec((err, estudiantes)=>{

        if(variable || !variable==undefined){
            query.limit(4);
        }
        console.log(variable);
        query.sort('nombre').exec((err, estudiantes)=>{
        if(err){
                return res.status(404).send({
                    status: 'error',
                    message: 'estudiantes mal',
                })
            }
            return res.status(200).send({
                status: 'bien',
                estudiantes,
            })
        })
    },

    get_estudiantebyid:(req,res)=>{
        var id=req.params.id;
        if(!id || id==null){
            return res.status(404).send({
                status: 'error',
                message: 'no id',
            })
        }
        Estudiante.findById(id,(err,Estudiante)=>{
            if(err){
                return res.status(404).send({
                status: 'error',
                message: 'no se pudo',
                })
            }
            if(!Estudiante){
                return res.status(500).send({
                    status: 'error',
                    message: 'no id valida',
                })
            }
            return res.status(200).send({
                status: 'exito',
                message: Estudiante,
            })
        })
    },

    update:(req,res)=>{
        // Recoger el ID que vamos a usar
        var id=req.params.id; // Para recoger de la URL

        // Recoger los parametros que lleguen
        var params=req.body; //Para recoger el body
        try{
            var validar_nombre=params.nombre;
            var validar_apellido=params.apellido;
            var validar_cedula=params.cedula;
        } catch(error){
            return res.status(500).send({
                status: "error",
                message: "Hay datos vacios"
            })
        }

        // Validar
        if(validar_apellido && validar_cedula && validar_nombre){
            Estudiante.findOneAndUpdate({_id:id},params,{new:true},(err,EstudianteActualizado)=>{

                if(err){
                    return res.status(500).send({
                        status: "error",
                        message: "No se pudo actualizar"
                    })
                }

                if(!EstudianteActualizado){
                    return res.status(500).send({
                        status: "error",
                        message: "Id mal"
                    })
                }

                else{
                    return res.status(200).send({
                        status: "bien",
                        message: EstudianteActualizado,
                    })
                }
            })
        }
        // Mensaje de error
        else{
            return res.status(500).send({
                status: "error",
                message: "Validación Incorrecta"
            })
        }
    }, 

    delete:(req,res)=>{
        // Recogemos los datos
        var id=req.params.cosa;

        // Find and delete
        Estudiante.findOneAndDelete({_id:id},(err,EstudianteRemove)=>{
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: "Error paila"
                })
            }
            if(!EstudianteRemove){
                return res.status(500).send({
                    status: "error",
                    message: "ID no encontrada"
                })
            }
            return res.status(200).send({
                status: "Todo bien, eliminado",
                message: EstudianteRemove,
            })
        })
    },

    search:(req,res)=>{
        var parametro=req.params.parametro;
        Estudiante.find({"$or":[
            {"nombre":{"$regex":parametro,"$options":"i"}},
            {"apellido":{"$regex":parametro,"$options":"i"}},
        ]})
        .exec((err,estudiantes)=>{
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: "Error en la petición",
                })
            }
            else if(!estudiantes){
                return res.status(500).send({
                    status: "error",
                    message: "ID no encontrada",
                })
            }

            else{
                return res.status(200).send({
                status: 'ok',
                message: estudiantes,
                //parametro: parametro,
                })
            } 
        })
    },

    upload:(req,res)=>{
        // Coger el archivo de la peticion
        var file_name='Imagen no subida';
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name,
            })
        }

        // Coger el nombre y extension
        var file_path=req.files.file0.path;
        var file_split=file_path.split('\\');
        
        // Comprobar extensión
        var file_name=file_split[2];
        var file_extension=file_name.split('.')[1];

        // Comprobar la extensión y solo admite imagenes
        if(file_extension != 'png' && file_extension != 'jpg' 
        && file_extension != 'gif' && file_extension != 'jpeg'){
            // Borrar el archivo
            fs.unlink(file_path,(err)=>{
                return res.status(404).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es valida',
                })
            });
        }
        else{
            var id=req.params.id;
            console.log(file_name);
            Estudiante.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,EstudianteUpdate)=>{
                if(err || !EstudianteUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la imagen',
                    })
                }
                return res.status(200).send({
                    status: 'ok',
                    EstudianteUpdate,
                })
            })
        }
    },

    obtener_imagen:(req,res)=>{
        var file=req.params.imagen;
        var file_path='./upload/estudiante/'+file;
        console.log(file_path)
        fs.exists(file_path,(exist)=>{
            if(exist){
                return res.sendFile(path.resolve(file_path));
            }
            else{
                return res.status(404).send({
                    status:'error',
                    message:'La imagen no existe',
                })
            }
        })
    }
};
module.exports=controller;