const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');

// este es el controlador de crear Usuario
const crearUsuario = async ( req, res = response ) => {
    //extraigo lo que quiero del body,.......
    //const { email, password, nombre } = req.body;
    const { email, password } = req.body; // o es lo mismo 
    //const email = req.body.email;
    //confirmo si eso existe en la base de datos
    try {

        const existeEmail = await Usuario.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        // extraigo la informacion que viene en el body
        // flitra todo lo que no necesito, 
        // todo lo que no esta definido en el modelo y manda el usurario
        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // para grabar lo que obtuve en la base de datos
        // lo que necesito hacer es
        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT( usuario.id );

        //este es el callback, 
        //es decir cuando alguin llame esta ruta
        res.json({
            ok: true,
            usuario,
            token
            //body: req.body
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({ // 404 no se encontro json
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({ // 400 bad request
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );
        // mandamos la respuesta !!
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const renewToken = async( req, res = response) => {

    // recupero el uid
    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT( uid );

    // Obtener el usuario por el UID, Usuario.findById... 
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });

}


module.exports = {
    crearUsuario,
    login,
    renewToken
}