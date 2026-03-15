const fs = require("fs/promises");
const path = require("path");
const { exiftool } = require("exiftool-vendored");
const EleventyImage = require("@11ty/eleventy-img");

const imageDir = "src/assets/photographs/bali";
const outputFile = "src/_data/photographs/bali.json";
const outputImageDir = "_tmp/img/bali"; // Dossier temporaire pour les images optimisées

async function generateOptimizedImages(filePath, fileName) {
  const outputPath = path.join(outputImageDir, path.parse(fileName).name);
  await EleventyImage(filePath, {
    outputDir: outputPath,
    formats: ["avif", "webp"],
    widths: [400, 800, 1200],
    urlPath: "/img/bali/",
  });
  return {
    avif: `/img/bali/${path.parse(fileName).name}-400.avif`,
    webp: `/img/bali/${path.parse(fileName).name}-400.webp`,
  };
}

async function build() {
  console.log("🚀 Build script started");

  try {

    await fs.mkdir(path.dirname(outputImageDir), { recursive: true });

    const filesName = await fs.readdir(imageDir);

    const files = filesName.filter(file => {
      const lower = file.toLowerCase();
      return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif");
    });

    const photos = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = path.join(imageDir, file);
          const tags = await exiftool.read(filePath);
          // Génère les images optimisées
          const optimized = await generateOptimizedImages(filePath, file);

          return {
            title: path.parse(file).name,
            date: tags.DateTimeOriginal ? tags.DateTimeOriginal.toDate() : null,
            src: optimized.webp, // Utilise la version WebP par défaut
            avif: optimized.avif, // Chemin vers l'AVIF
            webp: optimized.webp, // Chemin vers le WebP
            alt: path.parse(file).name,
            album: "bali",
            caption:""
          };
        } catch (err) {
          console.error("Exif error for:", file);
          return null;
        }
      })
    );

    const cleanPhotos = photos.filter(Boolean);

    await fs.writeFile(outputFile,JSON.stringify(cleanPhotos, null, 2));

    console.log(`✅ JSON generated with ${cleanPhotos.length} photos`);

  } catch (err) {
    console.error("❌ Build failed:", err);
  } finally {
    await exiftool.end();
  }
}

build();



// Quand nouvelles photos :

// npm run build:photos ==> permet à eleventy de détecter que _data/photographs.json a changé et il va rebuild automatiquement 

// npm run start ==> raccourci pour npx eleventy --serve


