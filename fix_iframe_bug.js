const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/pdca/page.jsx');
let content = fs.readFileSync(pagePath, 'utf-8');

// Update the internalPdcas mapping logic
content = content.replace(
  /const internalPdcas = \(dataInternalPdcas\.pdcas \|\| \[\]\)\.map\(p => \(\{ \.\.\.p, type: 'internal' \}\)\);/,
  `const internalPdcas = (dataInternalPdcas.pdcas || []).map(p => {
          const attachments = [];
          if (p.fileUrl && Array.isArray(p.fileUrl)) {
            p.fileUrl.forEach((url, i) => {
              if (url) {
                attachments.push({ fileUrl: url, originalFileName: p.originalFileName?.[i] || "เอกสารแนบ" });
              }
            });
          }
          return { ...p, type: 'internal', attachments, fileUrl: null };
        });`
);

// We should also make sure `selectedFileUrl` fallback is safe for arrays just in case
content = content.replace(
  /setSelectedFileUrl\(pdca\.attachments\?\.length > 0 \? pdca\.attachments\[0\]\.fileUrl : pdca\.fileUrl\);/g,
  `setSelectedFileUrl(pdca.attachments?.length > 0 ? pdca.attachments[0].fileUrl : (Array.isArray(pdca.fileUrl) ? null : pdca.fileUrl));`
);

fs.writeFileSync(pagePath, content);
console.log("Fixed PDF iframe rendering for Internal PDCAs!");
