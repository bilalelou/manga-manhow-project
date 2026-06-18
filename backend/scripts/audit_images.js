const fs = require('fs');
const path = require('path');

const metaPath = path.join(__dirname, '../public/uploads/a-mans-man-metadata.json');
const imgDir = path.join(__dirname, '../public/uploads/a-mans-man');

const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

let totalPages = 0;
let missing = [];
let zeroSize = [];

for (const ch of metadata) {
    for (const page of ch.pages) {
        totalPages++;
        const fname = page.imageUrl.replace('/uploads/a-mans-man/', '');
        const fullPath = path.join(imgDir, fname);
        if (!fs.existsSync(fullPath)) {
            missing.push({ chapter: ch.chapterNumber, page: page.pageNumber, file: fname });
        } else {
            const stat = fs.statSync(fullPath);
            if (stat.size === 0) {
                zeroSize.push({ chapter: ch.chapterNumber, page: page.pageNumber, file: fname, size: stat.size });
            }
        }
    }
}

// Also check for files in directory not referenced in metadata
const allFiles = fs.readdirSync(imgDir);
const referencedFiles = new Set();
for (const ch of metadata) {
    for (const page of ch.pages) {
        referencedFiles.add(page.imageUrl.replace('/uploads/a-mans-man/', ''));
    }
}
const orphaned = allFiles.filter(f => !referencedFiles.has(f));

console.log('=== IMAGE AUDIT REPORT ===');
console.log(`Total chapters in metadata: ${metadata.length}`);
console.log(`Total pages referenced in metadata: ${totalPages}`);
console.log(`Total image files on disk: ${allFiles.length}`);
console.log(`Missing images (in metadata but NOT on disk): ${missing.length}`);
if (missing.length > 0) {
    console.log('Missing files:');
    missing.forEach(m => console.log(`  Chapter ${m.chapter}, Page ${m.page}: ${m.file}`));
}
console.log(`Zero-size images: ${zeroSize.length}`);
if (zeroSize.length > 0) {
    zeroSize.forEach(z => console.log(`  Chapter ${z.chapter}, Page ${z.page}: ${z.file}`));
}
console.log(`Orphaned files (on disk but NOT in metadata): ${orphaned.length}`);
if (orphaned.length > 0) {
    orphaned.forEach(o => console.log(`  ${o}`));
}
