import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const minify=process.argv.includes('--minify');
const read=(p)=>readFile(path.join(root,p),'utf8');

const imports=`
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
`;

const helpers=`
`;
const fragments=[
  await read('src/js/55-old-oak-spec.js'),
  await read('src/js/56-old-oak-skeleton.js'),
  await read('src/js/57-old-oak-foliage.js'),
  await read('src/tree-lab/crown-fill.js'),
  await read('src/tree-lab/app.js')
];

const result=await build({
  stdin:{contents:imports+'\n'+helpers+'\n'+fragments.join('\n'),resolveDir:root,sourcefile:'src/tree-lab/generated-entry.js',loader:'js'},
  bundle:true,write:false,format:'iife',platform:'browser',target:['es2020'],charset:'utf8',minify,treeShaking:true,legalComments:'inline'
});
let js=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const css=await read('src/tree-lab/styles.css');
const tpl=await read('src/tree-lab/index.template.html');
const html=tpl.replace('/*__INLINE_CSS__*/',()=>css).replace('/*__INLINE_JS__*/',()=>js);
const dist=path.join(root,'dist');await mkdir(dist,{recursive:true});
const target=path.join(dist,'tree-lab-old-oak.html');
await writeFile(target,html,'utf8');
console.log(`TREE LAB BUILD OK: ${(Buffer.byteLength(html)/1024).toFixed(1)} KiB`);
