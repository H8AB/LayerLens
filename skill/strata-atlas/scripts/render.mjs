import { readFile, writeFile } from 'node:fs/promises';
import { renderSvg } from './core.mjs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/render.mjs input.json output.svg');
  process.exit(2);
}

try {
  const spec = JSON.parse(await readFile(inputPath, 'utf8'));
  const { svg, width, height } = renderSvg(spec);
  await writeFile(outputPath, svg, 'utf8');
  console.log('Rendered ' + width + '×' + height + ' SVG: ' + outputPath);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
