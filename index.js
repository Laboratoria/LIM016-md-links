const fs = require ('fs');
const path = require ('path'); 

////////COMO SABER SI LA RUTA EXISTE/////////
const pathExists = function(ruta) {
   return fs.existsSync(ruta)
} 
console.log(pathExists(process.argv[2]))

//////////COMO SABER SI LA RUTA ES ABSOLUTA///////////
const pathIsAbsolute = function(ruta){
  return path.isAbsolute(ruta)
} 
console.log(pathIsAbsolute(process.argv[2]));

////////// CONVIERTO LA RUTA EN ABSOLUTA /////////// 
const convertPathInAbsolute = function(ruta){
  if (path.isAbsolute(ruta)){
    return ruta
  }else{
    return path.resolve(ruta)
  }
}
console.log(convertPathInAbsolute(process.argv[2]));