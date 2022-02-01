#!/usr/bin/env node

const mdLinks = require('./index');
const figlet = require('figlet');
const colors = require('colors');

const nroArgs = process.argv.length;
const ruta = process.argv[1];
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

if (nroArgs > 0 && nroArgs < 4) {
  if(nroArgs === 1) {
    mdLinks(ruta, options)
      .then((response) =>{
        return response.forEach((element)=> {
          let path = element.path,
              href = element.href,
              text = element.text;
          return console.log(path.yellow  + ' ' + href.blue + ' ' + text.red);
        });
      })
      .catch(err => console.log(err))
  } else if(nroArgs === 2) {
    switch(process.argv[2]) {
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
              return console.log(path.yellow  + ' ' + href.blue + ' ' + ok.red + ' ' + status.green + ' ' + text.pink);
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
  } else if(nroArgs === 3) {
    if(process.argv[2] === '--stats' && process.argv[3] === '--validate'){
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

