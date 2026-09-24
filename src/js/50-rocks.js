  // ---------------------------------------------------------------------------
  // Fractured boulder geometry. Starts from a sphere but is deliberately cut by
  // several virtual fracture planes, then receives multi-scale displacement.
  // ---------------------------------------------------------------------------
  function createBoulderGeometry(seed=1,detail=3){
    let g=new THREE.IcosahedronGeometry(1,detail);
    const p=g.attributes.position;
    const rng=mulberry32(seed*9127+31);
    const planes=[];
    for(let i=0;i<5;i++){
      const v=new THREE.Vector3(rng()*2-1,rng()*2-1,rng()*2-1).normalize();
      planes.push({n:v,threshold:.52+rng()*.19,strength:.10+rng()*.15});
    }
    const shearX=(rng()-.5)*.18,shearZ=(rng()-.5)*.14;
    for(let i=0;i<p.count;i++){
      let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      const n=new THREE.Vector3(x,y,z).normalize();
      let radial=1 + fbm3(n.x*2.8+seed*.7,n.y*2.8-seed*.3,n.z*2.8+seed*.2)*.22;
      radial += fbm3(n.x*8.5-seed,n.y*8.5+seed,n.z*8.5)*.055;
      for(const pl of planes){
        const d=n.dot(pl.n);
        if(d>pl.threshold) radial -= (d-pl.threshold)*pl.strength*2.2;
      }
      x=n.x*radial; y=n.y*radial; z=n.z*radial;
      x+=y*shearX; z+=y*shearZ;
      y*=.82+rng()*.002;
      // Boulders sit *in* the ground instead of floating like potatoes.
      if(y<-.47)y=-.47+(y+.47)*.18;
      p.setXYZ(i,x,y,z);
    }
    p.needsUpdate=true;
    g.computeVertexNormals();
    g=BufferGeometryUtils.toCreasedNormals(g,THREE.MathUtils.degToRad(48));
    g.computeBoundingSphere();
    return g;
  }

  const heroRockGeos=[createBoulderGeometry(3,3),createBoulderGeometry(7,3),createBoulderGeometry(13,3),createBoulderGeometry(21,3)];
  const smallRockGeos=[createBoulderGeometry(5,1),createBoulderGeometry(17,1)];

  function placeBoulder(x,z,sx,sy,sz,seed=1,mat=null,sink=.28){
    const geo=heroRockGeos[Math.abs(seed)%heroRockGeos.length];
    const mesh=new THREE.Mesh(geo,mat || (seed%2?rockMatA:rockMatB));
    const floor=terrainHeight(x,z);
    mesh.position.set(x,floor + sy*(.48-sink),z);
    mesh.scale.set(sx,sy,sz);
    mesh.rotation.set((hash2(seed,2)-.5)*.18,hash2(seed,4)*Math.PI*2,(hash2(seed,8)-.5)*.14);
    mesh.castShadow=true;mesh.receiveShadow=true;
    scene.add(mesh);
    return mesh;
  }

  function addRockCluster(cx,cz,scale,seed){
    placeBoulder(cx,cz,scale*1.00,scale*.64,scale*.80,seed,seed%2?rockMatA:rockMatB,.34);
    const rng=mulberry32(seed*7717);
    const count=2+Math.floor(rng()*3);
    for(let i=0;i<count;i++){
      const a=rng()*Math.PI*2,r=scale*(.55+rng()*.65),s=scale*(.25+rng()*.42);
      placeBoulder(cx+Math.cos(a)*r,cz+Math.sin(a)*r,s*(.9+rng()*.5),s*(.55+rng()*.35),s*(.75+rng()*.45),seed*13+i, i%2?rockMatA:rockMatB,.43);
    }
  }

  // Natural outcrops instead of solitary perfect blobs.
  addRockCluster(-17,-18,4.5,3);
  addRockCluster(20,-34,4.0,7);
  addRockCluster(31,-45,5.0,13);
  addRockCluster(-35,-43,5.4,21);

  // Underwater rocks use instancing and the same geological language.
  const underCount=isMobile?22:42;
  const underA=new THREE.InstancedMesh(smallRockGeos[0],underwaterRockMat,underCount);
  const underB=new THREE.InstancedMesh(smallRockGeos[1],underwaterRockMat,underCount);
  underA.castShadow=underB.castShadow=false;underA.receiveShadow=underB.receiveShadow=true;
  const dummyRock=new THREE.Object3D();let ua=0,ub=0;
  for(let i=0;i<underCount*4 && ua+ub<underCount;i++){
    const a=hash2(i,77)*Math.PI*2,r=9+hash2(i,17)*29;
    const x=Math.cos(a)*r,z=Math.sin(a)*r,y=terrainHeight(x,z);
    if(y>-.65)continue;
    const s=.25+hash2(i,29)*1.0;
    dummyRock.position.set(x,y+s*.12,z);
    dummyRock.rotation.set(hash2(i,9)*.7,hash2(i,21)*Math.PI*2,hash2(i,41)*.6);
    dummyRock.scale.set(s*(.85+hash2(i,5)*.65),s*(.40+hash2(i,6)*.35),s*(.70+hash2(i,7)*.55));
    dummyRock.updateMatrix();
    if((i&1)===0 && ua<underCount){underA.setMatrixAt(ua++,dummyRock.matrix)}
    else if(ub<underCount){underB.setMatrixAt(ub++,dummyRock.matrix)}
  }
  underA.count=ua;underB.count=ub;underA.instanceMatrix.needsUpdate=true;underB.instanceMatrix.needsUpdate=true;
  scene.add(underA,underB);

  // Shore stones: irregular boulder instances, sunk into the wet band.
  const shoreCount=isMobile?48:90;
  const shoreA=new THREE.InstancedMesh(smallRockGeos[0],rockMatA,shoreCount);
  const shoreB=new THREE.InstancedMesh(smallRockGeos[1],rockMatB,shoreCount);
  shoreA.castShadow=shoreB.castShadow=true;shoreA.receiveShadow=shoreB.receiveShadow=true;
  let sa=0,sb=0;
  for(let i=0;i<shoreCount*3 && sa+sb<shoreCount;i++){
    const ang=i/shoreCount*Math.PI*2+hash2(i,3)*.10;
    const shore=lakeRadius(ang,Math.cos(ang)*50,Math.sin(ang)*50);
    const radius=shore+(-1.8+hash2(i,17)*3.8);
    const x=Math.cos(ang)*radius,z=Math.sin(ang)*radius,y=terrainHeight(x,z);
    if(y<-.72||y>1.15)continue;
    const s=.09+hash2(i,29)*.42;
    dummyRock.position.set(x,y+s*.02,z);
    dummyRock.rotation.set(hash2(i,41)*.7,hash2(i,57)*Math.PI*2,hash2(i,61)*.55);
    dummyRock.scale.set(s*(.9+hash2(i,4)*.75),s*(.36+hash2(i,5)*.38),s*(.72+hash2(i,6)*.60));
    dummyRock.updateMatrix();
    if((i&1)===0 && sa<shoreCount)shoreA.setMatrixAt(sa++,dummyRock.matrix);
    else if(sb<shoreCount)shoreB.setMatrixAt(sb++,dummyRock.matrix);
  }
  shoreA.count=sa;shoreB.count=sb;shoreA.instanceMatrix.needsUpdate=true;shoreB.instanceMatrix.needsUpdate=true;
  scene.add(shoreA,shoreB);

