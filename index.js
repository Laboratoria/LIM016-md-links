const fs = require('fs');
const path = require('path');

////////COMO SABER SI LA RUTA EXISTE/////////
const pathExists = function (ruta) {
  return fs.existsSync(ruta)
}
console.log(pathExists(process.argv[2]))

////////// CONVIERTO LA RUTA EN ABSOLUTA /////////// 
const convertPathInAbsolute = (ruta) => {
  if (path.isAbsolute(ruta)) {
    return ruta
  }
  return path.resolve(ruta)
}
console.log(convertPathInAbsolute(process.argv[2]));

//////////PREGUNTO SI ES UN DIRECTORIO///////////
const pathIsDirectory = (ruta) => {
  return fs.lstatSync(ruta).isDirectory()
}
console.log(pathIsDirectory(process.argv[2]));

////////PREGUNTO SI ES UN ARCHIVO//////////
const pathIsFile = function (ruta) {
  return fs.statSync(ruta).isFile()
}
console.log(pathIsFile(process.argv[2])); //retorna un booleano 

//////////LEER DIRECTORIO O ARCHIVO DE FORMA RECURSIVA///////////
const readDirectoryandFile = (ruta) => {
  let arrayResult = []; 
  if(pathIsDirectory(ruta)){
    const arrayDirectory = fs.readdirSync(ruta); 
    arrayDirectory.forEach(archivo => {
      const routeList = path.join(ruta, archivo); 
      arrayResult = arrayResult.concat(readDirectoryandFile(routeList)) 
    } 
  )}else{
    arrayResult.push(ruta) 
  }
  return arrayResult; 
}
console.log (readDirectoryandFile(process.argv[2]));


