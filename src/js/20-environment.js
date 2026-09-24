  // ---------------------------------------------------------------------------
  // Sky / Environment / Sun
  // ---------------------------------------------------------------------------
  const sky = new Sky();
  sky.scale.setScalar(1000);
  scene.add(sky);

  const envScene = new THREE.Scene();
  const envSky = new Sky();
  envSky.scale.setScalar(1000);
  envScene.add(envSky);

  function configureSky(mat){
    const u = mat.uniforms;
    u.turbidity.value = 7.2;
    u.rayleigh.value = 2.35;
    u.mieCoefficient.value = 0.0065;
    u.mieDirectionalG.value = 0.84;
  }
  configureSky(sky.material);
  configureSky(envSky.material);

  const sun = new THREE.Vector3();
  let sunElevation = 11;
  const sunAzimuth = 208;

  const hemi = new THREE.HemisphereLight(0xd8edf4, 0x293126, 0.72);
  scene.add(hemi);

  const sunLight = new THREE.DirectionalLight(0xffdeb3, 3.1);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
  sunLight.shadow.camera.left = -100;
  sunLight.shadow.camera.right = 100;
  sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.bottom = -100;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 320;
  sunLight.shadow.bias = -0.00032;
  scene.add(sunLight);
  scene.add(sunLight.target);

  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT = null;
  let water = null;

  function sunVector(elev){
    const phi = THREE.MathUtils.degToRad(90 - elev);
    const theta = THREE.MathUtils.degToRad(sunAzimuth);
    return new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
  }

  function rebuildEnvironment(){
    if(envRT) envRT.dispose();
    envRT = pmrem.fromScene(envScene, 0.04, 0.1, 1200, { size:isMobile ? 128 : 256 });
    scene.environment = envRT.texture;
  }

  function updateSun(doEnv=true){
    sun.copy(sunVector(sunElevation));
    sky.material.uniforms.sunPosition.value.copy(sun);
    envSky.material.uniforms.sunPosition.value.copy(sun);
    sunLight.position.copy(sun).multiplyScalar(165);
    sunLight.target.position.set(0, 0, -30);

    if(water) water.material.uniforms.sunDirection.value.copy(sun).normalize();

    const daylight = THREE.MathUtils.smoothstep(sunElevation, 2, 30);
    renderer.toneMappingExposure = 0.54 + daylight * 0.26;
    hemi.intensity = 0.38 + daylight * 0.42;
    sunLight.intensity = 1.8 + daylight * 2.25;
    scene.fog.density = 0.0053 + (1 - daylight) * 0.0030;

    if(doEnv) rebuildEnvironment();
  }

