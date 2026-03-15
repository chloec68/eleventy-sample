// 1. IMPORT DES MODULES NÉCESSAIRES
// =================================

// Import du module 'fs' (File System) pour manipuler les fichiers et dossiers
const fs = require("fs");
// Accès aux versions "promise" de fs (pour utiuliser async.await)
const fsPromises = fs.promises; 
// Import du module 'path' pour gérer les chemins de fichiers 
const path = require("path");
// Import de la bibliothèque exiftool pour lire les métadonnées des images 
const { exiftool } = require("exiftool-vendored");
// Import du plugin Elevnety pour générer des images optimisées 
const EleventyImage = require("@11ty/eleventy-img");

// 2. DEFINITION DES CHEMINS
// =========================

const imageDir = "src/assets/photographs/test";
const outputFile = "src/_data/photographs/test.json";
const outputImageDir = "src/_tmp/img/test"; // Dossier temporaire pour les images optimisées

// 3/ FONCTION PRINCIPALE
//=======================

async function build() {
  console.log("🚀 Build script started");

  try {
    // 3.1. Nettoyage et création des dossiers

    // Supprime le dossier _tmp s'il existe (recursif et forcé)
    // .catch(() => {}) ignore les erreurs si le dossier n'existe pas
    await fsPromises.rm("_tmp", { recursive: true, force: true }).catch(() => {});
    // Crée le dossier parent de outputImageDir (recursif pour créer tous les parents)
    await fsPromises.mkdir(path.dirname(outputImageDir), { recursive: true });

    // 3.2. Lecture des fichiers d'images

    //Liste tous les fichiers dans imageDir
    // C'est la méthode fs.readdir() de Node.js qui permet de lire le contenu d'un dossier donné; 
    const filesName = await fsPromises.readdir(imageDir);
    // Filtre permettant d e ne garder que les imgs dont les extensions sont spécifiées
    const files = filesName.filter(file => {
      const lower = file.toLowerCase();
      return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif");
    });

    // 3.3. Génération des images et métadonnées

    // Traite toutes les imgs en parallèle avec Promise.all
    const photos = await Promise.all(
      files.map(async (file) => { // Pour chaque image
        try {
          const filePath = path.join(imageDir, file); // Chemin complet vers l'image
          const tags = await exiftool.read(filePath); //Lit les métadonnées EXIF 
          const optimized = await generateOptimizedImages(filePath, file); // Génère les versions optimisées

          return { // Retourne un objet avec les métadonnées et chemins des imgs optimisées 
            title: path.parse(file).name, //nom du fichier sans extension
            date: tags.DateTimeOriginal ? tags.DateTimeOriginal.toDate() : null, //date de prise de vue
            src: optimized.webp,
            avif: optimized.avif,
            webp: optimized.webp,
            alt: path.parse(file).name,
            album: "test",
            caption: ""
          };
        } catch (err) { //En cas d'erreur, log et retourne null 
          console.error("Exif error for:", file, err);
          return null;
        }
      })
    );

    // 3.4. Écriture du fichier JSON

    //Filtre les entrées null (images en erreur)
    const cleanPhotos = photos.filter(Boolean);
    // Écrit le JSON dans outputFile avec un format lisible
    await fsPromises.writeFile(outputFile, JSON.stringify(cleanPhotos, null, 2));
    console.log(`✅ JSON generated with ${cleanPhotos.length} photos`);

  } catch (err) {
    console.error("❌ Build failed:", err);
  } finally { // Ferme exiftool dans tous les cas
    await exiftool.end();
  }
}

// 4. FONCTION SECONDAIRE : POUR GENERER LES IMAGES OPTIMISEES 
//============================================================

async function generateOptimizedImages(filePath, fileName) {
  await fsPromises.mkdir(outputImageDir, { recursive: true }); // Crée le dossier de sortie s'il n'existe pas
  const outputPath = path.join(outputImageDir, path.parse(fileName).name); // Chemin de sortie sans extension

  await EleventyImage(filePath, { // Génère versions optimisées
    outputDir: outputPath,
    formats: ["avif", "webp"],
    widths: [400, 800, 1200],
    urlPath: "/img/test/",
  });

  return { // Retourne les chemins des images générées 
    avif: `/img/test/${path.parse(fileName).name}-400.avif`,
    webp: `/img/test/${path.parse(fileName).name}-400.webp`,
  };
}

// Appel de la fonction principale
build();