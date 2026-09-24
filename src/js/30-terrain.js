  // ---------------------------------------------------------------------------
  // Noise helpers / lake shape
  // ---------------------------------------------------------------------------
  function hash2(x,z){
    const s = Math.sin(x*127.1 + z*311.7) * 43758.5453123;
    return s - Math.floor(s);
  }
  function smooth(t){ return t*t*(3 - 2*t); }
  function noise2(x,z){
    const xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
    const a=hash2(xi,zi), b=hash2(xi+1,zi), c=hash2(xi,zi+1), d=hash2(xi+1,zi+1);
    const u=smooth(xf), v=smooth(zf);
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a,b,u),THREE.MathUtils.lerp(c,d,u),v);
  }
  function fbm(x,z){
    let a=.5, f=1, s=0, n=0;
    for(let i=0;i<5;i++){
      s += (noise2(x*f,z*f)*2 - 1) * a;
      n += a;
      a *= .5;
      f *= 2.03;
    }
    return s / n;
  }
  function lakeRadius(angle, x, z){
    return 49
      + Math.sin(angle * 2.0) * 8
      + Math.sin(angle * 5.1 + 1.2) * 5
      + fbm(x * .022, z * .022) * 8.2;
  }
  function terrainHeight(x,z){
    const r = Math.hypot(x,z);
    const ang = Math.atan2(z,x);
    const shore = lakeRadius(ang,x,z);
    const d = r - shore;
    let y;
    if(d < 0){
      const t = THREE.MathUtils.clamp((-d)/shore,0,1); // 0 near shore, 1 deep center
      const bowl = -0.35 - Math.pow(t,1.55)*9.0;
      const shelf = Math.max(0, 1 - t*1.65) * 0.65; // broad shallow shelf
      const detail = fbm(x*.055,z*.055)*(.18 + t*.95);
      y = bowl + shelf + detail;
    }else{
      const rise = Math.pow(Math.max(0,d)/41,1.23)*19;
      const detail = fbm(x*.060,z*.060)*(1.0 + Math.min(7,d*.07));
      y = -0.15 + rise + detail;
    }
    return y;
  }

  // ---------------------------------------------------------------------------
  // Terrain mesh with lake-depth-aware colors and wet shoreline band
  // ---------------------------------------------------------------------------
  const terrainGeo = new THREE.PlaneGeometry(272, 272, isMobile ? 112 : 162, isMobile ? 112 : 162);
  terrainGeo.rotateX(-Math.PI/2);
  const pos = terrainGeo.attributes.position;
  const colors = [];
  const cDeepSand = new THREE.Color(0x85755a);
  const cShallowSand = new THREE.Color(0xc9ba8e);
  const cWet = new THREE.Color(0x665a44);
  const cGrass = new THREE.Color(0x5e744a);
  const cRock = new THREE.Color(0x656860);
  const cDeepWaterFloor = new THREE.Color(0x4f6d67);
  const tmp = new THREE.Color();

  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), z=pos.getZ(i);
    const y=terrainHeight(x,z);
    pos.setY(i,y);

    if(y < -5.2){
      tmp.copy(cDeepWaterFloor);
    }else if(y < -1.1){
      tmp.copy(cDeepSand).lerp(cDeepWaterFloor, THREE.MathUtils.clamp((-y-1.1)/5.5,0,1)*0.55);
    }else if(y < 0.06){
      const t = THREE.MathUtils.clamp((y + 1.1)/1.16,0,1);
      tmp.copy(cShallowSand).lerp(cWet, 1-t);
    }else if(y < 0.85){
      const t = THREE.MathUtils.clamp(y/0.85,0,1);
      tmp.copy(cWet).lerp(cGrass, t*0.75);
    }else if(y < 15){
      tmp.copy(cGrass);
    }else{
      tmp.copy(cRock);
    }

    // Local variation.
    const variation = 0.88 + hash2(x*.7,z*.7)*0.22;
    tmp.multiplyScalar(variation);

    colors.push(tmp.r,tmp.g,tmp.b);
  }
  terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors:true,
    roughness:0.95,
    metalness:0.0
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  scene.add(terrain);

