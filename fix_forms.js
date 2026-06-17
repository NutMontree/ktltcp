const fs = require('fs');
const path = require('path');

const steps = [
  { id: 9, type: 'memo' },
  { id: 10, type: 'memo' },
  { id: 11, type: 'memo' },
  { id: 12, type: 'generic' },
  { id: 13, type: 'generic' },
  { id: 14, type: 'generic' },
  { id: 15, type: 'generic' },
  { id: 16, type: 'memo' },
  { id: 17, type: 'generic' },
  { id: 18, type: 'generic' },
  { id: 19, type: 'memo' },
  { id: 20, type: 'generic' },
  { id: 21, type: 'memo' },
];

const componentsDir = path.join(__dirname, 'src/app/(components)');

steps.forEach(step => {
  const componentPath = path.join(componentsDir, `InternalStep${step.id}Form.jsx`);
  if (!fs.existsSync(componentPath)) return;
  
  let content = fs.readFileSync(componentPath, 'utf-8');

  if (step.type === 'generic') {
    // Fix the ReferenceError step is not defined
    content = content.replace(
      /fetch\('\/api\/InternalPdcas\/' \+ projectId \+ '\/step' \+ step\.id,/g,
      `fetch('/api/InternalPdcas/' + projectId + '/step${step.id}',`
    );
  } else {
    // Let's ensure the API endpoint is correct for memos.
    // In InternalInviteMemoForm, it was `/api/InternalPdcas/${projectId}/step8`
    // generate_forms.js replaced `\/step8\`` with `/step${step.id}\``
    // The fetch should be OK.
  }
  
  fs.writeFileSync(componentPath, content);
  console.log(`Fixed Component ${step.id}`);
});
