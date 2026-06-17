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

  // Fix error handling in handleSave
  content = content.replace(
    /if \(res\.ok\) \{[\s\S]*?\} catch \(error\) \{/g,
    `if (res.ok) {
        setMessage({ type: "success", text: "บันทึกข้อมูลสำเร็จ!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errData = await res.json();
        console.error(errData);
        setMessage({ type: "error", text: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: " + (errData.error || errData.message) });
      }
    } catch (error) {
      console.error(error);`
  );

  fs.writeFileSync(componentPath, content);
  console.log(`Updated Component ${step.id}`);
});
