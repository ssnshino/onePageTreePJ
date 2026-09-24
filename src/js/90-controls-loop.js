  // ---------------------------------------------------------------------------
  // Sun / environment now that water exists
  // ---------------------------------------------------------------------------
  updateSun(true);

  // ---------------------------------------------------------------------------
  // Controls
  // ---------------------------------------------------------------------------
  const clarityEl = document.getElementById('clarity');
  const waveEl = document.getElementById('wave');
  const windEl = document.getElementById('wind');
  const sunEl = document.getElementById('sun');
  const clarityVal = document.getElementById('clarityVal');
  const waveVal = document.getElementById('waveVal');
  const windVal = document.getElementById('windVal');
  const sunVal = document.getElementById('sunVal');

  let windSpeed = 0.48;
  let clarity = 0.74;

  function syncControls(doEnv=false){
    clarity = Math.max(0.35, Math.min(0.92, Number(clarityEl.value) || 0.74));
    const distortion = Math.max(0, Math.min(8, Number(waveEl.value) || 0));
    windSpeed = Math.max(0, Math.min(2.5, Number(windEl.value) || 0));
    sunElevation = Math.max(2, Math.min(45, Number(sunEl.value) || 11));

    if(water.material.uniforms.alpha) water.material.uniforms.alpha.value = clarity;
    water.material.uniforms.distortionScale.value = distortion;

    // Clearer water -> more turquoise and slightly less milky.
    const waterColor = new THREE.Color().lerpColors(
      new THREE.Color(0x083d43),
      new THREE.Color(0x159091),
      (clarity - 0.35)/(0.92 - 0.35)
    );
    water.material.uniforms.waterColor.value.copy(waterColor);

    clarityVal.textContent = clarity.toFixed(2);
    waveVal.textContent = distortion.toFixed(2);
    windVal.textContent = windSpeed.toFixed(2);
    sunVal.textContent = `${Math.round(sunElevation)}°`;

    // Brighter, broader bottom shimmer when clear.
    caustics.material.opacity = 0.05 + (clarity - 0.35)/(0.92 - 0.35) * 0.21;
    updateSun(doEnv);
  }

  function setPreset(name){
    if(name==='glass'){
      clarityEl.value='0.88';
      waveEl.value='1.1';
      windEl.value='0.10';
      sunEl.value='14';
    }else if(name==='breeze'){
      clarityEl.value='0.74';
      waveEl.value='2.2';
      windEl.value='0.48';
      sunEl.value='11';
    }else if(name==='sunset'){
      clarityEl.value='0.68';
      waveEl.value='2.4';
      windEl.value='0.45';
      sunEl.value='4';
    }
    syncControls(true);
  }

  [clarityEl,waveEl,windEl].forEach(el => el.addEventListener('input',()=>syncControls(false)));
  sunEl.addEventListener('input',()=>syncControls(false));
  sunEl.addEventListener('change',()=>syncControls(true));
  document.getElementById('glass').addEventListener('click',()=>setPreset('glass'));
  document.getElementById('breeze').addEventListener('click',()=>setPreset('breeze'));
  document.getElementById('sunset').addEventListener('click',()=>setPreset('sunset'));

  let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pauseBtn = document.getElementById('pause');
  if(!running){
    pauseBtn.textContent='RESUME';
    pauseBtn.classList.add('on');
  }
  pauseBtn.addEventListener('click',()=>{
    running=!running;
    pauseBtn.textContent = running ? 'PAUSE' : 'RESUME';
    pauseBtn.classList.toggle('on', !running);
  });

  // ---------------------------------------------------------------------------
  // Resize / Loop
  // ---------------------------------------------------------------------------
  function resize(){
    const w=Math.max(1,stage.clientWidth), h=Math.max(1,stage.clientHeight);
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  let last = performance.now(), waterTime = 0, fpsFrames = 0, fpsLast = last;
  const fpsEl = document.getElementById('fps');

  renderer.setAnimationLoop((now)=>{
    const dt = Math.min(0.05, Math.max(0,(now-last)/1000));
    last = now;

    if(running){
      waterTime += dt * windSpeed;
      water.material.uniforms.time.value = waterTime;

      buoyGroup.position.y = 0.03 + Math.sin(waterTime*1.8)*0.07 + Math.sin(waterTime*.7)*0.035;
      buoyGroup.rotation.z = Math.sin(waterTime*1.15)*0.025;
      buoyGroup.rotation.x = Math.cos(waterTime*.91)*0.02;

      caustics.material.map.offset.x = waterTime * 0.018;
      caustics.material.map.offset.y = waterTime * 0.011;
      caustics.material.map.rotation = Math.sin(waterTime*.17) * 0.15;
    }

    controls.update();
    renderer.render(scene,camera);

    fpsFrames++;
    if(now - fpsLast >= 700){
      const fps = fpsFrames * 1000 / (now - fpsLast);
      const tri = renderer.info.render.triangles;
      fpsEl.textContent = `FPS ${fps.toFixed(1)} · ${tri.toLocaleString()} TRI · REFLECT ${isMobile?'512':'1024'}²`;
      fpsFrames = 0;
      fpsLast = now;
    }
  });

  syncControls(false);
  loading.style.display = 'none';

}catch(err){
  console.error(err);
  loading.style.display='none';
  errorBox.style.display='block';
  errorBox.textContent =
    '初期化に失敗しました。\n\n' +
    (err?.stack || err?.message || String(err)) +
    '\n\nこの版は Three.js r186 をCDNから読み込むため、初回起動時はネット接続が必要です。';
}
