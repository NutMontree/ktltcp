const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/app');

// We want to remove "(Step X)" from page.jsx and InternalStepXForm.jsx for steps 9 to 21
for (let id = 9; id <= 21; id++) {
  // 1. Fix page.jsx
  const pagePath = path.join(srcDir, `InternalPdcaPage/[id]/step${id}/page.jsx`);
  if (fs.existsSync(pagePath)) {
    let pageContent = fs.readFileSync(pagePath, 'utf-8');
    pageContent = pageContent.replace(/\(Step \d+\)/g, '');
    pageContent = pageContent.replace(/pageName="([^"]+)\s+"/g, 'pageName="$1"'); // Clean trailing space
    fs.writeFileSync(pagePath, pageContent);
  }

  // 2. Fix InternalStepXForm.jsx
  const formPath = path.join(srcDir, `(components)/InternalStep${id}Form.jsx`);
  if (fs.existsSync(formPath)) {
    let formContent = fs.readFileSync(formPath, 'utf-8');
    formContent = formContent.replace(/บันทึกข้อมูล \(Step \d+\)/g, 'บันทึกข้อมูล');
    fs.writeFileSync(formPath, formContent);
  }
}

console.log("Fixed all Step labels in pages and buttons!");
