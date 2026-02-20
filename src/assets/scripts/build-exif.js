const fs = require("fs/promises");
const path = require("path");
const { exiftool } = require("exiftool-vendored");

const imageDir = "src/assets/photographs/sicily";
const outputFile = "src/_data/photographs/photographs-sicily.json";

async function build() {
  console.log("🚀 Build script started");

  try {
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

          return {
            title: path.parse(file).name,
            date: tags.DateTimeOriginal
              ? tags.DateTimeOriginal.toDate()
              : null,
            src: `/assets/photographs/${file}`,
            alt: path.parse(file).name,
            album: "sicily"
          };
        } catch (err) {
          console.error("Exif error for:", file);
          return null;
        }
      })
    );

    const cleanPhotos = photos.filter(Boolean);

    await fs.writeFile(
      outputFile,
      JSON.stringify(cleanPhotos, null, 2)
    );

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


