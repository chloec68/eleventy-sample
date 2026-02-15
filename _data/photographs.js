const fs = require("fs/promises"); // file system = built-in Node.js module => reads & writes files 
const path = require("path"); // path = built-in Node.js module => build safe paths 
const { exiftool } = require("exiftool-vendored"); // external package installed with npm = EXIF module => extract metadata from each .jpg

const imageDir = "assets/photographs"; // creates a variable that stores folder where images are ;

module.exports = async function () { 
    //In NodeJS, module.exports is used to share functions, objects, or values from one file to the other file so that other files can use them. 
    
    const filesName = await fs.readdir(imageDir) //filesName holds an array ;

    const files = filesName.filter(file => file.toLowerCase().endsWith(".jpg")); // array.filter() -JS // file is temporarly converted to lowercase to make the filter case-insensitive.  

    const photos = await Promise.all( // Promise.all(objet itérable, ex.:array) renvoie une promesse qui et résolue lorsque l'ensemble des promesses contenues dans l'itérable passé en argument ont été résolues / ou échoue
        files.map(async (file) => { //.map crée un nouvel array rempli avec les résultats de l'appel de la fonction ; 
                                    //!\ an async function ALWAYS returns a Promise
                                    // so it returns an array of Promises : [Promise, Promise, Promise]
            const filePath = path.join(imageDir, file);
            const tags = await exiftool.read(filePath);

            return {
                title: path.parse(file).name,
                date: tags.DateTimeOriginal.toDate() ? tags.DateTimeOriginal.toDate() : null,
                src: `/assets/photographs/${file}`,
                alt: path.parse(file).name,
                credit: "TEST TEST TEST"
            };
        })
    );

    await exiftool.end();

    return photos;

    //Execution flow : 
    // map() → creates [Promise, Promise, Promise]
    // Promise.all(...) → waits for all of them
    // await → pauses until all metadata is read
    // photos becomes an array of objects 

};
