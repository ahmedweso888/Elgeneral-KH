const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "src");

// الملفات اللي مش عايزين نعدلها
const EXCLUDED = [
  path.normalize("src/lib/general-toast.tsx"),
];

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(full)) continue;

    const relative = path.normalize(path.relative(__dirname, full));

    if (EXCLUDED.includes(relative)) {
      console.log("⏭️ Skip:", relative);
      continue;
    }

    let code = fs.readFileSync(full, "utf8");

    if (!code.includes(`from "sonner"`)) continue;

    let changed = false;

    // import
    if (
      code.includes(`import { toast } from "sonner";`) &&
      !code.includes(`generalToast`)
    ) {
      code = code.replace(
        `import { toast } from "sonner";`,
        `import { generalToast } from "@/lib/general-toast";`
      );
      changed = true;
    }

    const replacements = [
      ["toast.success(", "generalToast.success("],
      ["toast.error(", "generalToast.error("],
      ["toast.warning(", "generalToast.warning("],
      ["toast.loading(", "generalToast.loading("],
      ["toast.dismiss(", "generalToast.dismiss("],
    ];

    for (const [from, to] of replacements) {
      if (code.includes(from)) {
        code = code.split(from).join(to);
        changed = true;
      }
    }

    // toast("...") => generalToast.info("...")
    code = code.replace(
      /(^|[^.\w])toast\s*\(/g,
      (_, prefix) => {
        changed = true;
        return `${prefix}generalToast.info(`;
      }
    );

    if (changed) {
      fs.writeFileSync(full, code);
      console.log("✅ Updated:", relative);
    }
  }
}

walk(ROOT);

console.log("\n🎉 Finished!");