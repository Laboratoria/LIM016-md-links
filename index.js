import {
  absolutePath,
  absolutePathResolve,
  pathDetails,
  readFileData,
  linksInFile,
  fileConvertedInHTML,
  extMD,
  readDirectoryData,
  joinRoutes,
} from "./src/utils.js";

function fileToLinks(data, routeFileMD) {
  const arrayLinks = [];
  const fileHTML = fileConvertedInHTML(data);
  const hrefData = linksInFile(fileHTML);
  hrefData.forEach((link) => {
    arrayLinks.push({
      href: link.href,
      text: link.textContent,
      file: routeFileMD,
    });
  });
  return arrayLinks.length > 0 ? arrayLinks : "Do not have links";
}

const mdLinks = (pathData, optionsData) => {
  return new Promise(function (resolve, reject) {
    let result;
    let arrayPromises = [];
    let todoPromises;
    let pathResolve = absolutePath(pathData)
      ? pathData
      : absolutePathResolve(pathData);
    let pathContent = pathDetails(pathResolve);
    let flagContent =
      pathContent.ext === ""
        ? "directory"
        : pathContent.ext === ".md"
        ? "fileMD"
        : "fileNoMD";

    if (flagContent === "fileNoMD") {
      reject(console.log("Do not exist MD file"));
    }

    if (flagContent === "fileMD") {
      todoPromises = new Promise(function (resolve, reject) {
        readFileData(pathResolve, (data) => {
          resolve(fileToLinks(data, pathResolve));
          reject("Error reading MD file");
        });
      });
      resolve(todoPromises);
    }

    if (flagContent === "directory") {
      readDirectoryData(pathResolve, readDirectory);

      function readDirectory(files) {



        const conditionFilesMD = files.filter((file) => extMD(file));


        const existFilesMD =
          conditionFilesMD.length > 0
            ? conditionFilesMD
            : "Do not exist MD file in this directory";

        for (let index = 0; index < existFilesMD.length; index++) {
          const fileMD = existFilesMD[index];
          const routeFileMD = joinRoutes(pathResolve, fileMD);
          arrayPromises[index] = new Promise(function (resolve, reject) {
            readFileData(routeFileMD, (data) => {
              resolve(fileToLinks(data, routeFileMD));
            });
          });
        }

        Promise.all([...arrayPromises]).then((resolvePromises) => {
          let todoLinks = [];
          resolvePromises.forEach((promise) => {
            promise.forEach((link) => {
              todoLinks.push(link);
            });
          });
          resolve(todoLinks);
        });
      }
    }
  });
};

export { mdLinks };
