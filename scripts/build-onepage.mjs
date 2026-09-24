import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const src=path.join(root,'src');
const dist=path.join(root,'dist');
const minify=process.argv.includes('--minify');

const manifest=JSON.parse(await readFile(path.join(src,'js','manifest.json'),'utf8'));
const fragments=[];
for(const name of manifest.order){
  fragments.push(await readFile(path.join(src,'js',name),'utf8'));
}

const importPrelude=`
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
`;

const entry=importPrelude+'\n'+fragments.join('\n');
const result=await build({
  stdin:{contents:entry,resolveDir:root,sourcefile:'src/generated-entry.js',loader:'js'},
  bundle:true,
  write:false,
  format:'iife',
  platform:'browser',
  target:['es2020'],
  charset:'utf8',
  minify,
  treeShaking:true,
  legalComments:'inline',
  sourcemap:false,
  logLevel:'info'
});

if(result.outputFiles.length!==1)throw new Error('expected exactly one JS bundle');
let js=result.outputFiles[0].text;
js=js.replace(/<\/script/gi,'<\\/script');

const css=await readFile(path.join(src,'styles.css'),'utf8');
const template=await readFile(path.join(src,'index.template.html'),'utf8');
if(!template.includes('/*__INLINE_CSS__*/')||!template.includes('/*__INLINE_JS__*/')){
  throw new Error('inline placeholders missing from template');
}

const html=template
  .replace('/*__INLINE_CSS__*/',()=>css)
  .replace('/*__INLINE_JS__*/',()=>js);

await mkdir(dist,{recursive:true});
const target=path.join(dist,'threejs_onepage_waterworld_v0.6_hero_tree_prototype_02_old_oak.html');
await writeFile(target,html,'utf8');
console.log(`ONE-PAGE BUILD OK: ${path.relative(root,target)} / ${(Buffer.byteLength(html)/1024).toFixed(1)} KiB / three@0.186.0 / minify=${minify}`);
