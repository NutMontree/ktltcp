const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/pdca/page.jsx');
let content = fs.readFileSync(pagePath, 'utf-8');

// 1. Add import for internalPdcaItems
if (!content.includes('internalPdcaItems')) {
  content = content.replace(
    /import Link from "next\/link";/,
    `import Link from "next/link";\nimport { internalPdcaItems } from "@/app/(components)/EditInternalPdcaForm";`
  );
}

// 2. Modify fetchData to include InternalPdcas
content = content.replace(
  /const \[resPdcas, resConfig\] = await Promise\.all\(\[\s*fetch\("\/api\/Pdcas", \{ cache: "no-store" \}\),\s*fetch\("\/api\/FormConfig", \{ cache: "no-store" \}\)\s*\]\);\s*const dataPdcas = await resPdcas\.json\(\);\s*const dataConfig = await resConfig\.json\(\);\s*setPdcas\(dataPdcas\.pdcas \|\| \[\]\);\s*setPdcaItems\(dataConfig\.pdcaItems \|\| \[\]\);/m,
  `const [resPdcas, resInternalPdcas, resConfig] = await Promise.all([
          fetch("/api/Pdcas", { cache: "no-store" }),
          fetch("/api/InternalPdcas", { cache: "no-store" }),
          fetch("/api/FormConfig", { cache: "no-store" })
        ]);
        const dataPdcas = await resPdcas.json();
        const dataInternalPdcas = await resInternalPdcas.json();
        const dataConfig = await resConfig.json();
        
        const externalPdcas = (dataPdcas.pdcas || []).map(p => ({ ...p, type: 'external' }));
        const internalPdcas = (dataInternalPdcas.pdcas || []).map(p => ({ ...p, type: 'internal' }));
        const combinedPdcas = [...externalPdcas, ...internalPdcas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setPdcas(combinedPdcas);
        setPdcaItems(dataConfig.pdcaItems || []);`
);

// 3. Update stats calculation
content = content.replace(
  /const stats = useMemo\(\(\) => \{[\s\S]*?return \{[\s\S]*?total: pdcas\.length,[\s\S]*?completed: pdcas\.filter\(p => \{[\s\S]*?\}\)\.length,[\s\S]*?pending: pdcas\.filter\(p => \{[\s\S]*?\}\)\.length,[\s\S]*?departments: new Set\(pdcas\.map\(p => p\.department\)\)\.size[\s\S]*?\};[\s\S]*?\}, \[pdcas, pdcaItems\]\);/m,
  `const stats = useMemo(() => {
    return {
      total: pdcas.length,
      completed: pdcas.filter(p => {
         const items = p.type === 'internal' ? internalPdcaItems : pdcaItems;
         const total = items.length;
         if (total === 0) return false;
         const done = items.filter(item => p[\`id\${item.id || item.value}\`]).length;
         return done === total;
      }).length,
      pending: pdcas.filter(p => {
         const items = p.type === 'internal' ? internalPdcaItems : pdcaItems;
         const total = items.length;
         if (total === 0) return false;
         const done = items.filter(item => p[\`id\${item.id || item.value}\`]).length;
         return done > 0 && done < total;
      }).length,
      departments: new Set(pdcas.map(p => p.department)).size
    };
  }, [pdcas, pdcaItems]);`
);

// 4. Update Header Buttons
content = content.replace(
  /<Link\s*href="\/PdcaPage\/new"\s*className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"\s*>\s*<span className="absolute inset-0 bg-white\/10 opacity-0 transition-opacity group-hover:opacity-100"><\/span>\s*<span className="mr-2 text-xl">\+<\/span>\s*เพิ่มโครงการใหม่\s*<\/Link>/,
  `<div className="flex gap-4">
            <Link
              href="/InternalPdcaPage/new"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-purple-600 px-6 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
              <span className="mr-2 text-xl">+</span>
              เพิ่มเอกสารภายใน
            </Link>
            <Link
              href="/PdcaPage/new"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-6 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
              <span className="mr-2 text-xl">+</span>
              เพิ่มเอกสารภายนอก
            </Link>
          </div>`
);

// 5. Update PdcaCard prop mapping
content = content.replace(
  /<PdcaCard pdca=\{pdca\} totalItems=\{pdcaItems\.length \|\| 20\} \/>/,
  `<PdcaCard pdca={pdca} totalItems={pdca.type === 'internal' ? internalPdcaItems.length : (pdcaItems.length || 20)} />`
);

// 6. Update Modal Checklist
content = content.replace(
  /<h4 className="mb-4 text-sm font-black text-success uppercase tracking-widest border-b border-success\/10 pb-2">รายการตรวจสอบ \(\{pdcaItems\.filter\(i => selectedPdca\[`id\$\{i\.id\}`\]\)\.length\}\/\{pdcaItems\.length\}\)<\/h4>\s*<ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">\s*\{pdcaItems\.map\(\(item\) => \{\s*const isChecked = !!selectedPdca\[`id\$\{item\.id\}`\];\s*return \([\s\S]*?\);\s*\}\)\}\s*<\/ul>/,
  `{(() => {
                      const activeItems = selectedPdca.type === 'internal' ? internalPdcaItems : pdcaItems;
                      return (
                        <>
                          <h4 className="mb-4 text-sm font-black text-success uppercase tracking-widest border-b border-success/10 pb-2">รายการตรวจสอบ ({activeItems.filter((i, idx) => selectedPdca[\`id\${i.id || (idx + 1)}\`]).length}/{activeItems.length})</h4>
                          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {activeItems.map((item, idx) => {
                              const itemId = item.id || (idx + 1);
                              const isChecked = !!selectedPdca[\`id\${itemId}\`];
                              return (
                                <li key={itemId} className="flex items-start gap-3">
                                  <div className={\`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border \${isChecked ? 'bg-success border-success text-white' : 'border-stroke bg-white dark:border-strokedark dark:bg-boxdark'}\`}>
                                    {isChecked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                  </div>
                                  <span className={\`text-xs font-bold leading-tight \${isChecked ? 'text-success dark:text-success' : 'text-gray-500 dark:text-gray-400'}\`}>{item.label}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      );
                    })()}`
);

fs.writeFileSync(pagePath, content);
console.log("Updated pdca/page.jsx successfully!");
