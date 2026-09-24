  // HERO TREE PROTOTYPE 02 — OLD OAK
  function buildHeroOldOak(spec,seed,worldOrigin){
    const skeleton=generateOldOakSkeleton(spec,seed);
    const rootStems=buildOldOakSurfaceRootStems(spec,seed,worldOrigin);
    const woodGeometry=buildOldOakWoodGeometry([...skeleton.stems,...rootStems],spec);

    const barkMaterial=treeBarkMat.clone();
    barkMaterial.color.set(0xd9c9ad);
    barkMaterial.bumpScale=.095;
    barkMaterial.roughness=.97;

    const wood=new THREE.Mesh(woodGeometry,barkMaterial);
    wood.castShadow=true;wood.receiveShadow=true;
    const foliage=buildOldOakFoliage(skeleton,spec,seed);

    const group=new THREE.Group();
    group.add(wood,foliage);
    group.userData.heroTreeStats={
      stems:skeleton.stems.length,
      terminalStems:skeleton.terminalStems.length,
      foliageLeaves:foliage.count,
      woodTriangles:woodGeometry.index?woodGeometry.index.count/3:woodGeometry.attributes.position.count/3
    };
    return group;
  }

  const heroTreeXZ={x:-24,z:-50};
  const heroTreeY=terrainHeight(heroTreeXZ.x,heroTreeXZ.z);
  const heroTreeOrigin={x:heroTreeXZ.x,y:heroTreeY,z:heroTreeXZ.z};
  const heroTree=buildHeroOldOak(OLD_OAK_SPEC,OLD_OAK_SPEC.seed,heroTreeOrigin);
  heroTree.position.set(heroTreeXZ.x,heroTreeY,heroTreeXZ.z);
  heroTree.rotation.y=-.18;
  scene.add(heroTree);

  camera.position.set(heroTreeXZ.x+22,heroTreeY+8.2,heroTreeXZ.z+25);
  controls.target.set(heroTreeXZ.x,heroTreeY+6.0,heroTreeXZ.z);
  controls.minDistance=4;
  controls.maxDistance=140;
  controls.update();
