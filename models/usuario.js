const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type:String,
        required: true
    },

    email:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required: true
    },

    online:{
        type:Boolean,
        default: false
    },

});


UsuarioSchema.method('toJSON', function() {
    // todo lo que no lo quiero , o no lo ocupo y 
    // en object seran almacenadas las demas propiedades 
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});


module.exports = model('Usuario', UsuarioSchema);