//este archivo funciona como un archivo de barrido, donde crea las asociaciones entre tablas (modelos)
import { Usuario } from "./Usuario.model.js";
import { Venta } from "./Ventas.model.js";

//El método  .hasMany(modelo, opciones dentro del modelo), nos dice que el Usuario es a muchas ventas
Usuario.hasMany(Venta, {
    foreignKey: 'usuarioId', //El usuario Id queda como foreing Key en Ventas
    as: 'ventas'
});

//Venta pose la llave foranea (foreing key), por lo tanto pertecene a usuario (belongs to), funciona similar a la anterior, modelo y opciones
Venta.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario'
})

/* Esto funciona de la siguente forma
    Ventas emite una foreingKey llamada usuarioId...
    La venta que pertenece a usuario debe ENCONTRARSE con la foreingKey usuarioId...
    Cuando se encuentren y hagan match... se establece la relación
    Se establece relación, se crea la entidad

    Luego esto debe inicializarse
*/

