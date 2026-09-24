const isMobile = matchMedia('(max-width: 700px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);
const stage=document.getElementById('stage');
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

const ids=['seed','height','radius','flare','collar','branches','angle','gnarl1','gnarl2','upPull','leafCount','leafSize'];
const el=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));

function cloneSpec(){
  return JSON.parse(JSON.stringify(OLD_OAK_SPEC));
}
function readSpec(){
  const s=cloneSpec();
  s.seed=Number(el.seed.value);
  s.trunkLength=Number(el.height.value);
  s.trunkRadius=Number(el.radius.value);
  s.rootFlare=Number(el.flare.value);
  s.junctionCollarScale=Number(el.collar.value);
  s.children[0]=Math.round(Number(el.branches.value));
  s.branchAngle[0]=Number(el.angle.value);
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

function disposeObject(obj){
  obj.traverse(o=>{
    if(o.geometry)o.geometry.dispose();
    if(o.material){
      const mats=Array.isArray(o.material)?o.material:[o.material];
      for(const m of mats){if(m.map)m.map.dispose();if(m.alphaMap)m.alphaMap.dispose();m.dispose()}
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
  document.getElementById('silhouette').classList.toggle('on',silhouette);
  document.getElementById('wire').classList.toggle('on',wire);
  document.getElementById('leaves').classList.toggle('on',!leavesVisible);
  document.getElementById('roots').classList.toggle('on',!rootsVisible);
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
    clearTimeout(rebuildTimer);
    rebuildTimer=setTimeout(rebuild,90);
  });
}

function setView(name){
  const h=currentSpec?.trunkLength||12.5;
  const target=new THREE.Vector3(0,h*.45,0);
  if(name==='front')camera.position.set(0,h*.45,20);
  if(name==='side')camera.position.set(20,h*.45,0);
  if(name==='top')camera.position.set(.01,h+15,.01);
  if(name==='three')camera.position.set(15,h*.58,15);
  controls.target.copy(target);
  controls.update();
}
document.getElementById('front').onclick=()=>setView('front');
document.getElementById('side').onclick=()=>setView('side');
document.getElementById('top').onclick=()=>setView('top');
document.getElementById('three').onclick=()=>setView('three');
document.getElementById('random').onclick=()=>{el.seed.value=1+Math.floor(Math.random()*999);syncLabels();rebuild()};
document.getElementById('silhouette').onclick=()=>{silhouette=!silhouette;applyMode()};
document.getElementById('wire').onclick=()=>{wire=!wire;applyMode()};
document.getElementById('leaves').onclick=()=>{leavesVisible=!leavesVisible;applyMode()};
document.getElementById('roots').onclick=()=>{rootsVisible=!rootsVisible;applyMode()};

function resize(){
  const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
  renderer.setSize(w,h,false);
  camera.aspect=w/h;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);resize();

syncLabels();rebuild();setView('three');

let last=performance.now(),frames=0,fpsLast=last;
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
