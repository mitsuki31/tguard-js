import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import strip from 'strip-comments';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOTDIR = path.join(__dirname, '..');

if (process.cwd() !== ROOTDIR) {
  console.error("Error: Please run the script file from project's root directory!")
  process.exit(1);
}

const INCLUDED_FILES = fs.globSync('src/**/*.ts')
  .map(file => file.replace(/^src/, 'dist').replace(/.ts$/, '.js'));
const STRIP_OPTIONS = {
  line: true,
  block: true,
  keepProtected: false,
  preserveNewlines: false
};

async function main() {
  const tsconfigPath = path.join(ROOTDIR, 'tsconfig.json');
  const tsconfig = JSON.parse(await fs.promises.readFile(tsconfigPath, 'utf-8'));
  const outDir = path.join(ROOTDIR, (tsconfig.compilerOptions ?? {}).outDir ?? 'dist');
  if (!fs.existsSync(outDir)) {
    throw new Error('Output directory not found');
  }

  const summary = {
    fromLines: 0,
    toLines: 0,
  };

  for (const filePath of INCLUDED_FILES) {
    let strippedContent;
    let realpath;
    try {
      realpath = path.join(ROOTDIR, filePath.split('/').join(path.sep));
      const content = await fs.promises.readFile(realpath, 'utf-8');
      const fromLines = content.split('\n').length;
      summary.fromLines += fromLines;
      console.log(`Stripping comments from "${filePath}" (${fromLines} lines)...`);
      strippedContent = strip(content, STRIP_OPTIONS);
    } catch (error) {
      console.error(error);
      if (error.code === 'ENOENT') {
        console.error('Looks like the project is not built yet. Please run `npm run build` or `bun run build` first.');
      }
      process.exit(process.exitCode || 1);
    }

    await fs.promises.writeFile(realpath, strippedContent, 'utf-8');
    const toLines = strippedContent.split('\n').length;
    summary.toLines += toLines;
    console.log(`  -> "${filePath}" (${toLines} lines)`);
  }

  console.log(`
Summary:
  From: ${summary.fromLines} lines
  To:   ${summary.toLines} lines
  Removed: ${summary.fromLines - summary.toLines} lines
  Removed: ${((summary.fromLines - summary.toLines) / summary.fromLines * 100).toFixed(2)}%`);
}

await main();
