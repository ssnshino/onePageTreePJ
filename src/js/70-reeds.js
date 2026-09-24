  // ---------------------------------------------------------------------------
  // Reeds / grass clumps near shore
  // ---------------------------------------------------------------------------
  const reedMat = new THREE.MeshStandardMaterial({ color:0x6e7f47, roughness:1.0 });
  function addReedClump(x,z,scale=1){
    const baseY = terrainHeight(x,z);
    if(baseY < -0.25 || baseY > 0.9) return;
    const g = new THREE.Group();
    const count = 6 + Math.floor(hash2(x,z)*7);
    for(let i=0;i<count;i++){
      const h = (0.45 + hash2(x+i*0.3,z-i*0.2)*0.7) * scale;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.024,h,4), reedMat);
      const offA = hash2(i,x)*Math.PI*2;
      const offR = hash2(z,i)*0.12*scale;
      stem.position.set(Math.cos(offA)*offR, h*0.5, Math.sin(offA)*offR);
      stem.rotation.z = (hash2(i+3,z+9)-0.5)*0.18;
      stem.rotation.x = (hash2(i+5,x+7)-0.5)*0.12;
      stem.castShadow = true;
      stem.receiveShadow = true;
      g.add(stem);
    }
    g.position.set(x, baseY, z);
    scene.add(g);
  }
  const reedSamples = isMobile ? 65 : 120;
  for(let i=0;i<reedSamples;i++){
    const ang = hash2(i,71)*Math.PI*2;
    const shore = lakeRadius(ang, Math.cos(ang)*50, Math.sin(ang)*50);
    const radius = shore + (-0.9 + hash2(i,19)*2.4);
    const x = Math.cos(ang)*radius;
    const z = Math.sin(ang)*radius;
    addReedClump(x,z,0.8 + hash2(i,25)*0.8);
  }

