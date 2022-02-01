const path = require('path');
const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');

// 1.- Validar que es Absolutar  --> Retorna una Direciòn Absoluta
 let validarAbsoluta = (ruta) => {
  if (path.isAbsolute(ruta)) {
      return ruta
    }
    return path.resolve(ruta)
}

// 2.- Validar que la Ruta Existe --> Retorna Verdadero o Falso
let validarRuta = (ruta) => fs.existsSync(ruta);

// 3.- Validar si es Directorio --> Retorna Verdadero o Falso
let verDirectorio = (ruta) => fs.lstatSync(ruta).isDirectory();

// 4.- validar Directorio o Archivo y Obtener los Archivos .md --> Retorna un Arreglo Vacio o con Archivos .md
const validarDirectorio_Archivo = (ruta) => {
  let archivosMD = [];
  if(verDirectorio(ruta)) {
    const directorio = fs.readdirSync(ruta);
    directorio.forEach((file) => {
      archivosMD = archivosMD.concat(validarDirectorio_Archivo(path.join(ruta, file)));
    });
  } else {
    if(path.extname(ruta) === '.md'){
      archivosMD.push(ruta);
    }
  }
  return archivosMD;
};

// 5.- Recorrer un archivosMD y extraer los links --> Retorna un Arreglo con Objetos Vacio o con los Link
const extraerLinks = (ruta) => {
  let arrayLinks = [];
  const arrayMD = validarDirectorio_Archivo(ruta);
  arrayMD.forEach((md) => {
    const markdown = fs.readFileSync(md, {encoding: 'utf8'});
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*/i
    const links = markdownLinkExtractor(markdown, true).filter((link) => regex.test(link.href));
    links.forEach(prop => {
      arrayLinks.push({
      path: md,
      href: prop.href,
      text: prop.text.substring(0,50)
      });
    });
  })
  return arrayLinks;
}

// 6.- Recorrer un arreglo de links y validar el status y mensaje
const validarLinks = (arrayLinks) => {
  const statusLink = arrayLinks.map((link) => {
    return fetch(link.href)
      .then((result) => {
        const statusText = result.status === 200 ? 'OK' : 'NOT FOUND';
        const PropiedadLinks = {
          path: link.path,
          href: link.href,
          text: (link.text.slice(0,50)),
          status: result.status,
          ok: statusText,
        };
        return PropiedadLinks;
      })
      .catch((error) => {
        const PropiedadLinks = {
          path: link.path,
          href: link.href,
          text: (link.text.slice(0,50)),
          status: 'No Estatus',
          ok: `Fail ${error.message}`,
        };
        return PropiedadLinks;
      })
  });
  return Promise.all(statusLink)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
};

// 7.- Verificar cantidad de links unicos y totales
const stats = (arrayLinks) => {
  const total = arrayLinks.map((op) => op.href);
  const unique = new Set(arrayLinks.map(arrayLinks => arrayLinks.href));
  return `\nTotal: ${total.length}  \nUnique: ${unique.size}`;
}

// 8.- Verificar cantidad de links rotos
const broken = (arrayLinks) => {
  const broken = Array.from(arrayLinks).filter((element) => element.status >= 399);
  return `Broken: ${broken.length}`;
}

/******************************************************    Creación de la Promesa para Exportar    ******************************************************************/

const mdLinks = (path,options) => new Promise ((resolve,reject) => {
 const ruta = validarAbsoluta(path)
  if(validarRuta(ruta)) {
    let archivosMD = validarDirectorio_Archivo(ruta);
      if (archivosMD.length !== 0) {
        setTimeout(() => {
          if(!options.stats && !options.validate) {
            resolve((extraerLinks(ruta)));
          }else if(!options.stats && options.validate) {
            const arrayLinks = extraerLinks(ruta);
            if(arrayLinks.length !== 0){
              resolve(validarLinks(arrayLinks));
            } else {
               reject('No se encuentra enlaces');
            } /***** validarLinks ver si hay enlaces  *****/
          } else if(options.stats && !options.validate) {
            resolve(stats(extraerLinks(ruta)));
          } else if(options.stats && options.validate) {
            resolve(broken(validarLinks(extraerLinks(ruta))));
          }
        },2000);
      }else{
        reject('No se encuentra archivos .md');
      }/***** validarDirectorio_Archivo ver si hay archivos .md  *****/
  }else {
    reject('La ruta no existe o es incorrecta');
  };/***** validarRuta *****/
})

module.exports = mdLinks;

