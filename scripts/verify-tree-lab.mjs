import { readFile } from 'node:fs/promises';import vm from 'node:vm';
const html=await readFile(new URL('../dist/tree-lab-old-oak.html',import.meta.url),'utf8');
const fail=[];const ok=(v,m)=>{if(!v)fail.push(m)};
ok(html.includes('樹木研究室') && html.includes('TREE LAB'),'lab marker missing');
ok(!html.includes('type="module"'),'module script remained');
ok(!html.includes('type="importmap"'),'import map remained');
ok(!html.includes('cdn.jsdelivr.net/npm/three@'),'runtime CDN remained');
ok(html.includes('inspectorTab'),'inspector restore affordance missing');
ok(html.includes('data-section="basic"') && html.includes('data-section="advanced"'),'progressive disclosure structure missing');
ok(html.includes('JSONコピー'),'preset tools missing');
ok(html.includes('空間充填（逆フラクタル実験）'),'space-colonization diagnostic missing');
ok(html.includes('azimuthBalance'),'azimuth-balance control missing');
ok(html.includes('targetCoverage'),'attraction-point coverage metric missing');
const a=html.indexOf('<script>'),b=html.lastIndexOf('</script>');
ok(a>=0&&b>a,'script bounds missing');
if(a>=0&&b>a){try{new vm.Script(html.slice(a+8,b))}catch(e){fail.push('syntax '+e.message)}}
if(fail.length){console.error('TREE LAB VERIFY FAILED');fail.forEach(x=>console.error('- '+x));process.exit(1)}
console.log(`TREE LAB VERIFY PASS: ${(Buffer.byteLength(html)/1024).toFixed(1)} KiB`);
