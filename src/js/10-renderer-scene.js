  // ---------------------------------------------------------------------------
  // Renderer / Scene / Camera
  // ---------------------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.35 : 1.9));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.68;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xb6c6c8, 0.0059);

  const camera = new THREE.PerspectiveCamera(52, 1, 0.2, 1200);
  camera.position.set(28, 6.6, 44);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.target.set(0, 1.4, -29);
  controls.minDistance = 7;
  controls.maxDistance = 120;
  controls.maxPolarAngle = Math.PI * 0.495;

