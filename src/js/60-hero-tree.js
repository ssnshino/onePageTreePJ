  // ---------------------------------------------------------------------------
  // HERO TREE PROTOTYPE 01
  //
  // Goal: one near-view broadleaf tree that reads as a real old tree before
  // forest-scale optimisation.  The structure follows the same principles as
  // Three.js TreeGenerator: tapered swept branches, recursive hierarchy,
  // deterministic variation, root flare and a separate foliage layer.
  // ---------------------------------------------------------------------------
  const Y_AXIS=new THREE.Vector3(0,1,0);
  const X_AXIS=new THREE.Vector3(1,0,0);
  const GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));

  function mergeParts(parts){
    const valid=parts.filter(Boolean);
    if(!valid.length)return new THREE.BufferGeometry();
    const merged=BufferGeometryUtils.mergeGeometries(valid,false);
    valid.forEach(g=>g.dispose());
    merged.computeBoundingSphere();
    return merged;
  }

  function buildSweptBranch(points,r0,r1,radialSegments=9,seed=1){
    const curve=new THREE.CatmullRomCurve3(points,false,'centripetal',.5);
    const tubularSegments=Math.max(5,(points.length-1)*4);
    const positions=[],uvs=[],indices=[];
    const centers=[],tangents=[];
    for(let i=0;i<=tubularSegments;i++){
      const t=i/tubularSegments;
      centers.push(curve.getPointAt(t));
      tangents.push(curve.getTangentAt(t).normalize());
    }

    let normal=new THREE.Vector3(0,1,0);
    if(Math.abs(normal.dot(tangents[0]))>.92)normal.set(1,0,0);
    let binormal=new THREE.Vector3().crossVectors(tangents[0],normal).normalize();
    normal=new THREE.Vector3().crossVectors(binormal,tangents[0]).normalize();
    let prevT=tangents[0].clone();

    const q=new THREE.Quaternion();
    for(let i=0;i<=tubularSegments;i++){
      const t=i/tubularSegments;
      const tangent=tangents[i];
      if(i>0){
        q.setFromUnitVectors(prevT,tangent);
        normal.applyQuaternion(q).normalize();
        binormal.crossVectors(tangent,normal).normalize();
        normal.crossVectors(binormal,tangent).normalize();
      }
      prevT.copy(tangent);

      const taper=Math.pow(t,.78);
      const baseRadius=THREE.MathUtils.lerp(r0,r1,taper);
      const ringNoise=1+Math.sin(seed*1.71+i*1.43)*.020+Math.sin(seed*.37+i*2.77)*.012;
      for(let j=0;j<radialSegments;j++){
        const u=j/radialSegments;
        const ang=u*Math.PI*2;
        const barkWarp=1+Math.sin(seed*.83+i*.91+j*2.13)*.018;
        const radius=baseRadius*ringNoise*barkWarp;
        const c=centers[i];
        const vx=c.x+(normal.x*Math.cos(ang)+binormal.x*Math.sin(ang))*radius;
        const vy=c.y+(normal.y*Math.cos(ang)+binormal.y*Math.sin(ang))*radius;
        const vz=c.z+(normal.z*Math.cos(ang)+binormal.z*Math.sin(ang))*radius;
        positions.push(vx,vy,vz);
        uvs.push(u,t*3.6);
      }
    }

    for(let i=0;i<tubularSegments;i++){
      for(let j=0;j<radialSegments;j++){
        const nj=(j+1)%radialSegments;
        const a0=i*radialSegments+j;
        const a1=i*radialSegments+nj;
        const b0=(i+1)*radialSegments+j;
        const b1=(i+1)*radialSegments+nj;
        indices.push(a0,b0,a1,a1,b0,b1);
      }
    }

    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    g.setIndex(indices);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }

  function branchAxisPoints(start,dir,length,level,seed){
    const rng=mulberry32(seed*1907+level*977+41);
    const segs=level===0?11:level===1?7:level===2?5:4;
    const pts=[start.clone()];
    let p=start.clone(),d=dir.clone().normalize();
    let phase=rng()*Math.PI*2;

    for(let i=1;i<=segs;i++){
      const t=i/segs;
      phase+=.43+(rng()-.5)*.18;
      const lateral=new THREE.Vector3(Math.cos(phase),0,Math.sin(phase));
      const wander=(level===0?.035:level===1?.070:.095)*(1+.35*Math.sin(t*Math.PI));
      d.addScaledVector(lateral,(rng()-.5)*wander);
      d.y+=level===0?.030:level===1?.016:.008;
      d.y-=level>=2?.022*t:.006*t;
      d.normalize();
      p=p.clone().addScaledVector(d,length/segs);
      pts.push(p);
    }
    return pts;
  }

  function childDirection(parentDir,roll,spread,lift){
    const p=parentDir.clone().normalize();
    const ref=Math.abs(p.y)>.90?X_AXIS:Y_AXIS;
    const sideA=new THREE.Vector3().crossVectors(p,ref).normalize();
    const sideB=new THREE.Vector3().crossVectors(p,sideA).normalize();
    const radial=sideA.multiplyScalar(Math.cos(roll)).add(sideB.multiplyScalar(Math.sin(roll)));
    return p.multiplyScalar(1-spread)
      .addScaledVector(radial,spread)
      .addScaledVector(Y_AXIS,lift)
      .normalize();
  }

  function makeLeafClusterTextures(seed=1,size=256){
    const colorCanvas=document.createElement('canvas');
    const alphaCanvas=document.createElement('canvas');
    colorCanvas.width=colorCanvas.height=alphaCanvas.width=alphaCanvas.height=size;
    const cc=colorCanvas.getContext('2d'),ac=alphaCanvas.getContext('2d');
    const rng=mulberry32(seed*7129+3);

    // Keep RGB green even outside the alpha silhouette so mip filtering does
    // not drag transparent black into distant leaf edges.
    cc.fillStyle='#35512f';cc.fillRect(0,0,size,size);
    ac.fillStyle='#000';ac.fillRect(0,0,size,size);

    const branch=(ctx,color)=>{
      ctx.save();
      ctx.strokeStyle=color;ctx.lineWidth=size*.018;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(size*.15,size*.72);ctx.quadraticCurveTo(size*.48,size*.52,size*.82,size*.30);ctx.stroke();
      ctx.restore();
    };
    branch(cc,'#5d4d2d');branch(ac,'#f1f1f1');

    const leafCount=12;
    for(let i=0;i<leafCount;i++){
      const t=(i+.55)/leafCount;
      const cx=size*(.18+t*.65)+(rng()-.5)*size*.11;
      const cy=size*(.69-t*.39)+(rng()-.5)*size*.18;
      const rx=size*(.065+rng()*.040),ry=rx*(.42+rng()*.18);
      const angle=-.9+rng()*1.8;
      const hue=96+rng()*20, sat=34+rng()*18, light=28+rng()*16;

      cc.save();cc.translate(cx,cy);cc.rotate(angle);
      const grad=cc.createLinearGradient(-rx,0,rx,0);
      grad.addColorStop(0,`hsl(${hue-5} ${sat}% ${Math.max(18,light-8)}%)`);
      grad.addColorStop(.55,`hsl(${hue} ${sat+5}% ${light+5}%)`);
      grad.addColorStop(1,`hsl(${hue+4} ${sat}% ${light}%)`);
      cc.fillStyle=grad;
      cc.beginPath();cc.ellipse(0,0,rx,ry,0,0,Math.PI*2);cc.fill();
      cc.strokeStyle='rgba(220,235,180,.25)';cc.lineWidth=1;
      cc.beginPath();cc.moveTo(-rx*.72,0);cc.lineTo(rx*.75,0);cc.stroke();
      cc.restore();

      ac.save();ac.translate(cx,cy);ac.rotate(angle);
      ac.fillStyle='#fff';
      ac.beginPath();ac.ellipse(0,0,rx,ry,0,0,Math.PI*2);ac.fill();
      ac.restore();
    }

    const map=new THREE.CanvasTexture(colorCanvas);
    const alphaMap=new THREE.CanvasTexture(alphaCanvas);
    map.colorSpace=THREE.SRGBColorSpace;
    [map,alphaMap].forEach(tex=>{
      tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
      tex.minFilter=THREE.LinearMipmapLinearFilter;
      tex.magFilter=THREE.LinearFilter;
      tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate=true;
    });
    return {map,alphaMap};
  }

  function buildHeroTreePrototype(seed=83){
    const rng=mulberry32(seed);
    const woodParts=[];
    const foliageAnchors=[];
    let serial=0;

    function grow(start,dir,length,radius,level,localSeed){
      const pts=branchAxisPoints(start,dir,length,level,localSeed);
      const tipRadius=radius*(level===0?.19:.14);
      woodParts.push(buildSweptBranch(
        pts,radius,tipRadius,
        level===0?12:level===1?9:level===2?7:6,
        localSeed
      ));

      if(level>=2){
        const tip=pts[pts.length-1];
        const prev=pts[Math.max(0,pts.length-2)];
        const tipDir=tip.clone().sub(prev).normalize();
        foliageAnchors.push({pos:tip.clone(),dir:tipDir,level});
        if(level===2){
          const shoulder=pts[Math.max(1,pts.length-2)].clone();
          foliageAnchors.push({pos:shoulder,dir:tipDir,level});
        }
      }

      if(level>=3)return;

      const childCount=level===0?9:level===1?4:2;
      const startFrac=level===0?.23:level===1?.34:.45;
      for(let c=0;c<childCount;c++){
        const f=THREE.MathUtils.clamp(
          startFrac+(c+.35+rng()*.28)/(childCount+.65)*(1-startFrac),
          .18,.94
        );
        const idx=Math.max(1,Math.min(pts.length-2,Math.round(f*(pts.length-1))));
        const base=pts[idx].clone();
        const parentDir=pts[idx+1].clone().sub(pts[idx-1]).normalize();
        const roll=(serial++*GOLDEN_ANGLE)+(rng()-.5)*.48;
        const spread=level===0?(.64+rng()*.10):level===1?(.54+rng()*.09):(.46+rng()*.08);
        let lift=level===0?(.12+rng()*.24):level===1?(.10+rng()*.20):(.08+rng()*.16);
        if(level===0&&f>.72)lift+=.20;
        const childDir=childDirection(parentDir,roll,spread,lift);
        const lenFactor=level===0?(.46+rng()*.16):level===1?(.47+rng()*.14):(.42+rng()*.14);
        const childLength=length*lenFactor*(1-f*.10);
        const childRadius=radius*(level===0?(.33+rng()*.05):(.40+rng()*.06));
        grow(base,childDir,childLength,childRadius,level+1,localSeed*17+c*37+level*101+serial);
      }
    }

    // Visible surface roots / buttresses. They are short, broad and partially
    // buried, avoiding the "pole inserted into the terrain" look.
    const rootCount=8;
    for(let i=0;i<rootCount;i++){
      const ang=i/rootCount*Math.PI*2+(rng()-.5)*.32;
      const len=1.65+rng()*1.55;
      const side=.18+(rng()-.5)*.16;
      const p0=new THREE.Vector3(0,.12,0);
      const p1=new THREE.Vector3(Math.cos(ang)*len*.42,.02+side,Math.sin(ang)*len*.42);
      const p2=new THREE.Vector3(Math.cos(ang)*len,-.08-rng()*.10,Math.sin(ang)*len);
      woodParts.push(buildSweptBranch([p0,p1,p2],.30+rng()*.10,.035,8,seed*301+i));
    }

    const trunkLean=new THREE.Vector3(.035,1,-.022).normalize();
    grow(new THREE.Vector3(0,0,0),trunkLean,10.4,.72,0,seed*11+5);

    const wood=mergeParts(woodParts);

    const leafTex=makeLeafClusterTextures(seed+19,isMobile?192:256);
    const leafMat=new THREE.MeshStandardMaterial({
      map:leafTex.map,
      alphaMap:leafTex.alphaMap,
      alphaTest:.45,
      side:THREE.DoubleSide,
      roughness:.90,
      metalness:0,
      envMapIntensity:.72,
      depthWrite:true
    });
    leafMat.alphaToCoverage=!isMobile;

    const cardGeo=new THREE.PlaneGeometry(1.55,1.02,1,1);
    const cardsPerAnchor=isMobile?1:2;
    const maxCards=foliageAnchors.length*cardsPerAnchor;
    const leaves=new THREE.InstancedMesh(cardGeo,leafMat,maxCards);
    leaves.castShadow=true;
    leaves.receiveShadow=true;

    const dummy=new THREE.Object3D();
    const palette=[
      new THREE.Color(0x3f673c),
      new THREE.Color(0x557947),
      new THREE.Color(0x345b39),
      new THREE.Color(0x66804b),
      new THREE.Color(0x446c43)
    ];
    let cardIndex=0;
    for(let i=0;i<foliageAnchors.length;i++){
      const a=foliageAnchors[i];
      const localRng=mulberry32(seed*9001+i*131);
      for(let k=0;k<cardsPerAnchor;k++){
        const spread=.24+localRng()*.58;
        const off=new THREE.Vector3(
          (localRng()-.5)*spread,
          (localRng()-.42)*spread*.72,
          (localRng()-.5)*spread
        );
        dummy.position.copy(a.pos).add(off);
        dummy.rotation.set(
          -.42+localRng()*.84,
          localRng()*Math.PI*2,
          -.34+localRng()*.68
        );
        const s=(a.level===2?1.04:1.0)*(.88+localRng()*.48);
        dummy.scale.set(s*(.94+localRng()*.20),s*(.82+localRng()*.18),1);
        dummy.updateMatrix();
        leaves.setMatrixAt(cardIndex,dummy.matrix);
        const col=palette[Math.floor(localRng()*palette.length)%palette.length].clone();
        col.offsetHSL((localRng()-.5)*.026,(localRng()-.5)*.07,(localRng()-.5)*.06);
        leaves.setColorAt(cardIndex,col);
        cardIndex++;
      }
    }
    leaves.count=cardIndex;
    leaves.instanceMatrix.needsUpdate=true;
    if(leaves.instanceColor)leaves.instanceColor.needsUpdate=true;
    leaves.computeBoundingSphere();

    const group=new THREE.Group();
    const woodMesh=new THREE.Mesh(wood,treeBarkMat);
    woodMesh.castShadow=woodMesh.receiveShadow=true;
    group.add(woodMesh,leaves);
    group.userData.heroTreeStats={
      branchMeshes:woodParts.length,
      foliageAnchors:foliageAnchors.length,
      foliageCards:cardIndex,
      woodTriangles:wood.index?wood.index.count/3:wood.attributes.position.count/3
    };
    return group;
  }

  const heroTreeXZ={x:-24,z:-50};
  const heroTreeY=terrainHeight(heroTreeXZ.x,heroTreeXZ.z);
  const heroTree=buildHeroTreePrototype(83);
  heroTree.position.set(heroTreeXZ.x,heroTreeY,heroTreeXZ.z);
  heroTree.rotation.y=-.28;
  heroTree.scale.setScalar(1.18);
  scene.add(heroTree);

  // Prototype camera: keep the lake/reflection composition, but make the single
  // tree the subject so Human Review can judge trunk/branch/foliage quality.
  camera.position.set(18,8.2,22);
  controls.target.set(heroTreeXZ.x,heroTreeY+5.7,heroTreeXZ.z);
  controls.minDistance=5;
  controls.maxDistance=140;
  controls.update();

