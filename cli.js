#!/usr/bin/env node

const mdLinks = require('./index');
const figlet = require('figlet');

const nroArgs = process.argv.length;

console.log(nroArgs);
console.log(process.argv[0]);
console.log(process.argv[1]);
console.log(process.argv[2]);


const ruta = process.argv[3];
let options = {
  validate: false,
  stats: false
}

figlet('Bienvenido  a   mdLinks!!', function(err, data) {
  if (err) {
      console.log('Algo salió mal...');
      console.dir(err);
      return;
  }
  console.log(data)
});

if (nroArgs > 2 && nroArgs < 6) {
  if(nroArgs === 3) {
    mdLinks(ruta, options)
      .then((response) =>{
        return response.forEach((element)=> {
          let path = element.path,
              href = element.href,
              text = element.text;
          return console.log(path  + ' ' + href + ' ' + text);
        });
      })
      .catch(err => console.log(err))
  } else if(nroArgs === 4) {
    switch(process.argv[4]) {
      case '--validate':
        options.validate = true;
        mdLinks(ruta, options)
          .then((response) =>{
            return response.forEach((element)=> {
              let path = element.path,
                  href = element.href,
                  text = element.text;
                  status = element.status;
                  ok = element.ok;
              return console.log(path  + ' ' + href + ' ' + ok + ' ' + status + ' ' + text);
            });
          })
          .catch(err => console.log(err))
      break;
      case '--stats':
        options.stats = true;
        mdLinks(path, options)
          .then( (response) =>{
            return console.log('Total : '+ response.total+'\n'+' Uniques : '+ response.uniques);
          })
         .catch(err => console.log(err))
      break;
      case '--help':

      break;
      default:
        console.log('Comando Inválido. Intente con la opción --help')
      break;
    }
  } else if(nroArgs === 5) {
    if(process.argv[4] === '--stats' && process.argv[5] === '--validate'){
      options.validate = true;
      options.stats = true;
      mdLinks(path, options)
        .then((response) =>{
          return console.log('Total : ' +response.total + '\n' + 'Uniques : ' + response.uniques +'\n'+ 'Broken : ' + response.broken );
        })
        .catch(err => console.log(err))
    } else {
      console.log('Solicita Ayuda.  mdLinks --help')
    }
  }
} else {
  console.log('Comandos Incorrectos o Inválidos. Intente con la opción --help');
}

