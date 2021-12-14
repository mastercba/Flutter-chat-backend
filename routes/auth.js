/*
        path:api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router(); // es una funcion NO una Clase


// configuracion de la primera ruta
router.post('/new', [
    // hacemos las validaciones!, con midlewares arreglo JS
    // el 2do argumento es un midleware
    // aqui defino varios midlewares
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La contrasena es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
    validarCampos
], crearUsuario );  
    
// post: /
router.post('/', [
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email','El correo es obligatorio').isEmail(),
], login );

// validar email, password
router.get('/renew', validarJWT, renewToken );


// cuando alguien necesite este archivo,
// lo que va a jalar es este router
module.exports= router; 