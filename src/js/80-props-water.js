  // ---------------------------------------------------------------------------
  // Pier + buoy
  // ---------------------------------------------------------------------------
  const woodMat = new THREE.MeshStandardMaterial({ color:0x6a4930, roughness:0.72 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color:0x3f2e22, roughness:0.84 });

  function box(w,h,d,x,y,z,mat=woodMat){
    const o = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
    o.position.set(x,y,z);
    o.castShadow = true; o.receiveShadow = true;
    scene.add(o); return o;
  }
  for(let z=23;z>-7;z-=3.2) box(4.8,0.22,3.0,10,0.42,z,woodMat);
  for(let z=23;z>-8;z-=6.4){
    box(0.28,3.0,0.28,8.1,-0.45,z,darkWoodMat);
    box(0.28,3.0,0.28,11.9,-0.45,z,darkWoodMat);
  }

  const buoyGroup = new THREE.Group();
  const buoyBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42,0.58,1.3,20),
    new THREE.MeshStandardMaterial({ color:0xd84b31, roughness:0.36, metalness:0.04 })
  );
  buoyBody.position.y = 0.52; buoyBody.castShadow = true;
  const buoyTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.35,20,12),
    new THREE.MeshStandardMaterial({ color:0xf1ddbd, roughness:0.30 })
  );
  buoyTop.position.y = 1.25; buoyTop.castShadow = true;
  buoyGroup.add(buoyBody, buoyTop);
  buoyGroup.position.set(-6,0.02,-12);
  scene.add(buoyGroup);

  // ---------------------------------------------------------------------------
  // Water normal texture
  // ---------------------------------------------------------------------------
  function makeNormalTexture(n=256){
    const data = new Uint8Array(n*n*4);
    const TAU = Math.PI*2;
    let p = 0;
    for(let y=0;y<n;y++){
      const v = y/n*TAU;
      for(let x=0;x<n;x++){
        const u = x/n*TAU;
        const du = 2.0*Math.cos(2*u+v) - 0.55*Math.cos(-u+3*v) + 1.75*Math.cos(5*u-2*v) + 1.4*Math.cos(7*u+6*v);
        const dv = 1.0*Math.cos(2*u+v) + 1.65*Math.cos(-u+3*v) - 0.70*Math.cos(5*u-2*v) + 1.2*Math.cos(7*u+6*v);
        const nx = -du*0.16, ny = -dv*0.16, nz = 1;
        const len = Math.hypot(nx,ny,nz) || 1;
        data[p++] = Math.round((nx/len*0.5+0.5)*255);
        data[p++] = Math.round((ny/len*0.5+0.5)*255);
        data[p++] = Math.round((nz/len*0.5+0.5)*255);
        data[p++] = 255;
      }
    }
    const tex = new THREE.DataTexture(data,n,n,THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    tex.needsUpdate = true;
    return tex;
  }

  // ---------------------------------------------------------------------------
  // Shallow "caustics-ish" moving light on lakebed
  // ---------------------------------------------------------------------------
  function makeCausticTexture(size=256){
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,size,size);
    for(let i=0;i<240;i++){
      const x=Math.random()*size, y=Math.random()*size, r=12+Math.random()*30;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(255,255,255,.20)');
      g.addColorStop(.45,'rgba(255,255,255,.07)');
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const waterNormals = makeNormalTexture(isMobile ? 128 : 256);
  const waterGeometry = new THREE.PlaneGeometry(232,232);

  water = new Water(waterGeometry,{
    textureWidth:isMobile ? 512 : 1024,
    textureHeight:isMobile ? 512 : 1024,
    clipBias:0.00025,
    alpha:0.74,
    waterNormals,
    sunDirection:sun.clone().normalize(),
    sunColor:0xfff2da,
    waterColor:0x0d6164,
    distortionScale:2.2,
    fog:true
  });
  water.rotation.x = -Math.PI/2;
  water.position.y = 0.03;
  water.material.transparent = true;
  water.material.depthWrite = false;
  water.renderOrder = 3;
  scene.add(water);

  const causticsTex = makeCausticTexture();
  const causticsMat = new THREE.MeshBasicMaterial({
    map:causticsTex,
    transparent:true,
    opacity:0.19,
    blending:THREE.AdditiveBlending,
    depthWrite:false,
    toneMapped:false
  });
  const caustics = new THREE.Mesh(new THREE.PlaneGeometry(96,96), causticsMat);
  caustics.rotation.x = -Math.PI/2;
  caustics.position.y = -1.15;
  caustics.renderOrder = 1;
  scene.add(caustics);

