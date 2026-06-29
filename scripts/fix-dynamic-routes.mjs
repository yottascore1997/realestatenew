import fs from "fs";
import path from "path";

const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === "route.ts") files.push(p);
  }
}
walk("src/app/api");

for (const file of files) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("@/lib/prisma")) continue;

  c = c.replace(/\r?\nexport const dynamic = "force-dynamic";\r?\n/g, "\n");
  c = c.replace(/^export const dynamic = "force-dynamic";\r?\n/m, "");

  const lines = c.split(/\r?\n/);
  let lastImport = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }
  if (!c.includes("export const dynamic")) {
    lines.splice(lastImport + 1, 0, "", 'export const dynamic = "force-dynamic";');
  }
  fs.writeFileSync(file, lines.join("\n"));
}

console.log("Fixed API routes:", files.filter((f) => fs.readFileSync(f, "utf8").includes("@/lib/prisma")).length);
