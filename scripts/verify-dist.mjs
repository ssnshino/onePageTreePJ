import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const file=new URL('../dist/threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html',import.meta.url);
const html=await readFile(file,'utf8');
const failures=[];
const expect=(cond,msg)=>{if(!cond)failures.push(msg)};

expect(html.trimEnd().endsWith('</html>'),'missing </html>');
expect(!html.includes('type="module"'),'module script remained in dist');
expect(!html.includes('type="importmap"'),'import map remained in dist');
expect(!html.includes("from 'three'"),'unbundled three import remained');
expect(!html.includes('cdn.jsdelivr.net/npm/three@'),'runtime Three.js CDN remained');
expect(html.includes('HERO TREE PROTOTYPE 01'),'hero tree UI marker missing');
expect(html.includes('r186 bundled / one-page build'),'runtime HUD label missing');

const start=html.indexOf('<script>');
const end=html.lastIndexOf('</script>');
expect(start>=0 && end>start,'classic script bounds not found');

if(start>=0 && end>start){
  const js=html.slice(start+'<script>'.length,end);
  try{
    new vm.Script(js,{filename:'onepage-bundle.js'});
  }catch(err){
    failures.push(`bundle syntax error: ${err.message}`);
    console.error(err.stack||err);
  }
}

const styleCount=(html.match(/<style>/g)||[]).length;
expect(styleCount===1,`expected 1 inline style, found ${styleCount}`);

if(failures.length){
  console.error('ONE-PAGE VERIFY FAILED');
  for(const f of failures)console.error('- '+f);
  process.exit(1);
}
console.log(`ONE-PAGE VERIFY PASS: ${(Buffer.byteLength(html)/1024).toFixed(1)} KiB`);
