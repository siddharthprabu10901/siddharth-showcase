import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
const portfolio = path.join(root, 'apps', 'portfolio', 'dist');
const flowdesk = path.join(root, 'apps', 'flowdesk', 'dist');
if (!existsSync(path.join(portfolio, 'index.html')) || !existsSync(path.join(flowdesk, 'index.html'))) {
  throw new Error('Build both applications before assembling the showcase.');
}
mkdirSync(output, { recursive: true });
cpSync(portfolio, output, { recursive: true });
cpSync(flowdesk, path.join(output, 'flowdesk'), { recursive: true });
console.log('Showcase assembled: portfolio at /, Flowdesk at /flowdesk/.');
