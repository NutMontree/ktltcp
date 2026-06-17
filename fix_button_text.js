const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/(components)/EditInternalPdcaForm.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace "✍️ กรอกข้อมูล (แบบฟอร์ม X)" with "✍️ กรอกข้อมูล"
content = content.replace(/✍️ กรอกข้อมูล \(แบบฟอร์ม \d+\)/g, '✍️ กรอกข้อมูล');

fs.writeFileSync(filePath, content);
console.log("Fixed button text");
