const fs = require ('fs');
const path = require ('path'); 

////////COMO SABER SI LA RUTA EXISTE/////////
const pathExists = function(ruta) {
   return fs.existsSync(ruta)
} 
console.log(pathExists(process.argv[2]))
