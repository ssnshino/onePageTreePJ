const isMobile = matchMedia('(max-width: 700px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);
const appRoot=document.getElementById('app');
const stage=document.getElementById('stage');
const inspector=document.getElementById('inspector');
const inspectorTab=document.getElementById('inspectorTab');
const collapseInspectorBtn=document.getElementById('collapseInspector');
const uiWake=document.getElementById('uiWake');
const sheetHandle=document.getElementById('sheetHandle');
const statsPanel=document.getElementById('statsPanel');
const toast=document.getElementById('toast');

const STORAGE={
  values:'oldOakTreeLab.values.v2',
  ui:'oldOakTreeLab.ui.v2',
  preset:'oldOakTreeLab.savedPreset.v2'
};

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,isMobile?1.35:1.8));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.92;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9aa69b);
const camera=new THREE.PerspectiveCamera(48,1,.1,300);
camera.position.set(16,8,18);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=.06;
controls.target.set(0,5.2,0);

scene.add(new THREE.HemisphereLight(0xe4edf0,0x394134,1.45));
const sun=new THREE.DirectionalLight(0xffe1b4,3.6);
sun.position.set(-16,24,14);
sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-20;sun.shadow.camera.right=20;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-12;
scene.add(sun);

const ground=new THREE.Mesh(
  new THREE.CircleGeometry(18,96),
  new THREE.MeshStandardMaterial({color:0x68745f,roughness:1})
);
ground.rotation.x=-Math.PI/2;
ground.receiveShadow=true;
scene.add(ground);

const grid=new THREE.GridHelper(30,30,0x566258,0x7a857c);
grid.position.y=.008;
scene.add(grid);

function terrainHeight(){return 0}
function mulberry32(seed){
  let a=(seed>>>0)||1;
  return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};
}

function makeLabBarkTexture(size=256){
  const c=document.createElement('canvas');c.width=c.height=size;
  const x=c.getContext('2d');
  x.fillStyle='#6b5440';x.fillRect(0,0,size,size);
  const rng=mulberry32(77);
  for(let i=0;i<150;i++){
    const px=rng()*size,w=.6+rng()*2.4;
    x.strokeStyle=`rgba(${25+Math.floor(rng()*30)},${18+Math.floor(rng()*22)},${12+Math.floor(rng()*18)},${.12+rng()*.32})`;
    x.lineWidth=w;x.beginPath();x.moveTo(px,-10);x.bezierCurveTo(px+(rng()-.5)*13,size*.35,px+(rng()-.5)*18,size*.7,px+(rng()-.5)*12,size+10);x.stroke();
  }
  const map=new THREE.CanvasTexture(c);
  map.colorSpace=THREE.SRGBColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;
  map.repeat.set(1.2,5);
  return map;
}
const barkMap=makeLabBarkTexture();

let treeGroup=null;
let leafMesh=null,woodMesh=null,rootMesh=null;
let currentSpec=null;
let lastBuildMs=0;
let silhouette=false;
let wire=false;
let leavesVisible=true;
let rootsVisible=true;
let inspectorCollapsed=isMobile;
let uiHidden=false;
let currentView='three';
let toastTimer=0;

const ids=['seed','height','radius','trunkClear','flare','collar','branches','angle','crownSpread','gnarl1','gnarl2','upPull','leafCount','leafSize'];
const el=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
const defaultValues=Object.fromEntries(ids.map(id=>[id,el[id].value]));
const accordionEls=[...document.querySelectorAll('.accordion')];
const viewButtons=[...document.querySelectorAll('[data-view]')];
const morphologyPresetEl=document.getElementById('morphologyPreset');

const MORPHOLOGY_PRESETS={
  current:{...defaultValues},
  // Research-informed experiment, not a sourced numeric standard.
  // USFS/Morton/NC State describe open-grown mature white oak as short/stocky,
  // broad-rounded, wide-spreading and strongly horizontal.
  'open-grown':{
    seed:'187',
    height:'10.75',
    radius:'0.96',
    trunkClear:'0.12',
    flare:'1.04',
    collar:'0.30',
    branches:'9',
    angle:'75',
    crownSpread:'0.64',
    gnarl1:'0.125',
    gnarl2:'0.220',
    upPull:'0.14',
    leafCount:'11',
    leafSize:'0.44'
  }
};

function safeParse(value,fallback=null){
  try{return JSON.parse(value)}catch{return fallback}
}
function readStored(key){
  try{return localStorage.getItem(key)}catch{return null}
}
function writeStored(key,value){
  try{localStorage.setItem(key,value);return true}catch{return false}
}
function removeStored(key){
  try{localStorage.removeItem(key)}catch{}
}
function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),1300);
}
function getValueState(){
  return Object.fromEntries(ids.map(id=>[id,el[id].value]));
}
function applyValueState(values,{rebuildNow=true,persist=true}={}){
  if(!values)return;
  for(const id of ids){
    if(values[id]!==undefined && values[id]!==null)el[id].value=values[id];
  }
  syncLabels();
  if(persist)writeStored(STORAGE.values,JSON.stringify(getValueState()));
  if(rebuildNow)rebuild();
}
function persistValues(){
  writeStored(STORAGE.values,JSON.stringify(getValueState()));
}
function getUIState(){
  return {
    inspectorCollapsed,
    currentView,
    statsOpen:statsPanel.open,
    sections:Object.fromEntries(accordionEls.map(d=>[d.dataset.section,d.open]))
  };
}
function persistUI(){
  writeStored(STORAGE.ui,JSON.stringify(getUIState()));
}
function setInspectorCollapsed(value,{persist=true}={}){
  inspectorCollapsed=!!value;
  appRoot.classList.toggle('inspector-collapsed',inspectorCollapsed);
  collapseInspectorBtn.setAttribute('aria-expanded',String(!inspectorCollapsed));
  collapseInspectorBtn.setAttribute('aria-label',inspectorCollapsed?'Inspectorを表示':'Inspectorを隠す');
  collapseInspectorBtn.textContent=isMobile?'⌄':'‹';
  if(persist)persistUI();
}
function setUIHidden(value){
  uiHidden=!!value;
  appRoot.classList.toggle('ui-hidden',uiHidden);
  uiWake.setAttribute('aria-hidden',String(!uiHidden));
}
function restoreState(){
  const values=safeParse(readStored(STORAGE.values));
  if(values)applyValueState(values,{rebuildNow:false,persist:false});

  const state=safeParse(readStored(STORAGE.ui));
  if(state){
    inspectorCollapsed=Boolean(state.inspectorCollapsed);
    currentView=state.currentView||'three';
    statsPanel.open=Boolean(state.statsOpen);
    if(state.sections){
      for(const d of accordionEls){
        if(d.dataset.section in state.sections)d.open=Boolean(state.sections[d.dataset.section]);
      }
    }
  }else{
    inspectorCollapsed=isMobile;
  }
  setInspectorCollapsed(inspectorCollapsed,{persist:false});
}

function cloneSpec(){
  return JSON.parse(JSON.stringify(OLD_OAK_SPEC));
}
function readSpec(){
  const s=cloneSpec();
  s.seed=Number(el.seed.value);
  s.trunkLength=Number(el.height.value);
  s.trunkRadius=Number(el.radius.value);
  s.trunkClear=Number(el.trunkClear.value);
  s.rootFlare=Number(el.flare.value);
  s.junctionCollarScale=Number(el.collar.value);
  s.children[0]=Math.round(Number(el.branches.value));
  s.branchAngle[0]=Number(el.angle.value);
  s.lengthRatio[0]=Number(el.crownSpread.value);
  s.gnarl[1]=Number(el.gnarl1.value);
  s.gnarl[2]=Number(el.gnarl2.value);
  s.upPull[2]=Number(el.upPull.value);
  s.foliage.desktopLeavesPerTwig=Math.round(Number(el.leafCount.value));
  s.foliage.mobileLeavesPerTwig=Math.max(2,Math.round(s.foliage.desktopLeavesPerTwig*.58));
  s.foliage.size=Number(el.leafSize.value);
  return s;
}
function syncLabels(){
  for(const id of ids){
    const out=document.querySelector(`[data-value="${id}"]`);
    if(out)out.textContent=el[id].value;
  }
}
function valuesEqualPreset(values,preset){
  return ids.every(id=>String(values[id])===String(preset[id]));
}
function syncMorphologyPreset(){
  const values=getValueState();
  if(valuesEqualPreset(values,MORPHOLOGY_PRESETS.current))morphologyPresetEl.value='current';
  else if(valuesEqualPreset(values,MORPHOLOGY_PRESETS['open-grown']))morphologyPresetEl.value='open-grown';
  else morphologyPresetEl.value='custom';
}
function applyMorphologyPreset(name){
  const preset=MORPHOLOGY_PRESETS[name];
  if(!preset)return;
  applyValueState(preset,{rebuildNow:true,persist:true});
  morphologyPresetEl.value=name;
  showToast(name==='open-grown'?'Open-grown oak applied':'Current baseline applied');
}

function disposeObject(obj){
  obj.traverse(o=>{
    if(o.geometry)o.geometry.dispose();
    if(o.material){
      const mats=Array.isArray(o.material)?o.material:[o.material];
      for(const m of mats){
        if(m.map && m.map!==barkMap)m.map.dispose();
        if(m.alphaMap)m.alphaMap.dispose();
        m.dispose();
      }
    }
  });
}
function makeBarkMaterial(){
  return new THREE.MeshStandardMaterial({map:barkMap,color:0xd9c9ad,roughness:.97,metalness:0});
}
function applyMode(){
  grid.visible=!silhouette;
  scene.background.set(silhouette?0xf5f3ea:0x9aa69b);
  if(woodMesh){
    woodMesh.material.wireframe=wire;
    woodMesh.material.color.set(silhouette?0x111111:0xd9c9ad);
    woodMesh.material.map=silhouette?null:barkMap;
    woodMesh.material.needsUpdate=true;
  }
  if(rootMesh){
    rootMesh.visible=rootsVisible;
    rootMesh.material.wireframe=wire;
    rootMesh.material.color.set(silhouette?0x111111:0xd0bfa2);
    rootMesh.material.map=silhouette?null:barkMap;
    rootMesh.material.needsUpdate=true;
  }
  if(leafMesh){
    leafMesh.visible=leavesVisible;
    leafMesh.material.wireframe=wire;
    leafMesh.material.color.set(silhouette?0x090909:0xffffff);
  }
  document.getElementById('silhouette').setAttribute('aria-pressed',String(silhouette));
  document.getElementById('wire').setAttribute('aria-pressed',String(wire));
  document.getElementById('leaves').setAttribute('aria-pressed',String(leavesVisible));
  document.getElementById('roots').setAttribute('aria-pressed',String(rootsVisible));
}

function rebuild(){
  const t0=performance.now();
  currentSpec=readSpec();
  if(treeGroup){
    scene.remove(treeGroup);
    disposeObject(treeGroup);
  }

  const skeleton=generateOldOakSkeleton(currentSpec,currentSpec.seed);
  const rootStems=buildOldOakSurfaceRootStems(currentSpec,currentSpec.seed,{x:0,y:0,z:0});
  const woodGeometry=buildOldOakWoodGeometry(skeleton.stems,currentSpec);
  const rootGeometry=buildOldOakWoodGeometry(rootStems,currentSpec);

  treeGroup=new THREE.Group();
  woodMesh=new THREE.Mesh(woodGeometry,makeBarkMaterial());
  rootMesh=new THREE.Mesh(rootGeometry,makeBarkMaterial());
  leafMesh=buildOldOakFoliage(skeleton,currentSpec,currentSpec.seed);

  woodMesh.castShadow=woodMesh.receiveShadow=true;
  rootMesh.castShadow=rootMesh.receiveShadow=true;
  treeGroup.add(woodMesh,rootMesh,leafMesh);
  scene.add(treeGroup);

  lastBuildMs=performance.now()-t0;
  treeGroup.userData.stats={
    stems:skeleton.stems.length,
    twigs:skeleton.terminalStems.length,
    leaves:leafMesh.count,
    woodTri:woodGeometry.index.count/3,
    rootTri:rootGeometry.index.count/3
  };
  applyMode();
  updateStaticStats();
}
function updateStaticStats(){
  const s=treeGroup?.userData.stats;
  if(!s)return;
  document.getElementById('treeStats').textContent=
    `STEMS ${s.stems} · TWIGS ${s.twigs} · LEAVES ${s.leaves} · TREE TRI ${Math.round(s.woodTri+s.rootTri).toLocaleString()} · BUILD ${lastBuildMs.toFixed(1)}ms`;
}

let rebuildTimer=0;
for(const id of ids){
  el[id].addEventListener('input',()=>{
    syncLabels();
    persistValues();
    syncMorphologyPreset();
    clearTimeout(rebuildTimer);
    rebuildTimer=setTimeout(rebuild,90);
  });
}

function setView(name,{persist=true}={}){
  currentView=name;
  const h=currentSpec?.trunkLength||12.5;
  const target=new THREE.Vector3(0,h*.45,0);
  if(name==='front')camera.position.set(0,h*.45,20);
  if(name==='side')camera.position.set(20,h*.45,0);
  if(name==='top')camera.position.set(.01,h+15,.01);
  if(name==='three')camera.position.set(15,h*.58,15);
  controls.target.copy(target);
  controls.update();

  for(const b of viewButtons)b.setAttribute('aria-pressed',String(b.dataset.view===name));
  if(persist)persistUI();
}
for(const b of viewButtons)b.addEventListener('click',()=>setView(b.dataset.view));

document.getElementById('silhouette').addEventListener('click',()=>{silhouette=!silhouette;applyMode()});
document.getElementById('wire').addEventListener('click',()=>{wire=!wire;applyMode()});
document.getElementById('leaves').addEventListener('click',()=>{leavesVisible=!leavesVisible;applyMode()});
document.getElementById('roots').addEventListener('click',()=>{rootsVisible=!rootsVisible;applyMode()});

morphologyPresetEl.addEventListener('change',()=>{
  if(morphologyPresetEl.value==='custom')return;
  applyMorphologyPreset(morphologyPresetEl.value);
});

document.getElementById('random').addEventListener('click',()=>{
  el.seed.value=1+Math.floor(Math.random()*999);
  syncLabels();persistValues();syncMorphologyPreset();rebuild();
  showToast('New seed');
});
document.getElementById('reset').addEventListener('click',()=>{
  removeStored(STORAGE.values);
  applyValueState(defaultValues,{rebuildNow:true,persist:false});
  morphologyPresetEl.value='current';
  showToast('Defaults restored');
});
document.getElementById('savePreset').addEventListener('click',()=>{
  writeStored(STORAGE.preset,JSON.stringify(getValueState()));
  showToast('Preset saved');
});
document.getElementById('loadPreset').addEventListener('click',()=>{
  const saved=safeParse(readStored(STORAGE.preset));
  if(!saved){showToast('No saved preset');return}
  applyValueState(saved);
  syncMorphologyPreset();
  showToast('Preset loaded');
});
document.getElementById('copyPreset').addEventListener('click',async()=>{
  const payload=JSON.stringify({
    type:'OLD_OAK_TREE_LAB_PRESET',
    version:2,
    values:getValueState()
  },null,2);
  try{
    await navigator.clipboard.writeText(payload);
    showToast('Preset JSON copied');
  }catch{
    const ta=document.createElement('textarea');
    ta.value=payload;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();
    document.execCommand('copy');ta.remove();
    showToast('Preset JSON copied');
  }
});

collapseInspectorBtn.addEventListener('click',()=>setInspectorCollapsed(true));
inspectorTab.addEventListener('click',()=>setInspectorCollapsed(false));
uiWake.addEventListener('click',()=>setUIHidden(false));
for(const d of accordionEls)d.addEventListener('toggle',persistUI);
statsPanel.addEventListener('toggle',persistUI);

let dragStartY=null;
sheetHandle.addEventListener('pointerdown',e=>{
  dragStartY=e.clientY;
  sheetHandle.setPointerCapture?.(e.pointerId);
});
sheetHandle.addEventListener('pointerup',e=>{
  if(dragStartY!==null && e.clientY-dragStartY>44)setInspectorCollapsed(true);
  dragStartY=null;
});

document.addEventListener('keydown',e=>{
  const tag=e.target?.tagName?.toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select')return;
  const k=e.key.toLowerCase();
  if(k==='i'){setInspectorCollapsed(!inspectorCollapsed);e.preventDefault()}
  else if(k==='h'){setUIHidden(!uiHidden);e.preventDefault()}
  else if(k==='w'){wire=!wire;applyMode();e.preventDefault()}
  else if(k==='s'){silhouette=!silhouette;applyMode();e.preventDefault()}
  else if(k==='1')setView('three');
  else if(k==='2')setView('front');
  else if(k==='3')setView('side');
  else if(k==='4')setView('top');
});

function resize(){
  const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
  renderer.setSize(w,h,false);
  camera.aspect=w/h;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

syncLabels();
restoreState();
syncMorphologyPreset();
rebuild();
setView(currentView,{persist:false});

let frames=0,fpsLast=performance.now();
renderer.setAnimationLoop(now=>{
  controls.update();
  renderer.render(scene,camera);
  frames++;
  if(now-fpsLast>700){
    const fps=frames*1000/(now-fpsLast);
    const info=renderer.info;
    document.getElementById('renderStats').textContent=
      `FPS ${fps.toFixed(1)} · ${info.render.triangles.toLocaleString()} TRI · ${info.render.calls} CALL · ${info.memory.geometries} GEO · ${info.memory.textures} TEX · DPR ${renderer.getPixelRatio().toFixed(2)}`;
    frames=0;fpsLast=now;
  }
});
