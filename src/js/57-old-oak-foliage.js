  // OLD OAK FOLIAGE — base-anchored individual oak leaves
  //
  // Near foliage remains individual instanced leaves, but canopy volume is no
  // longer controlled by leaf-count alone. Distribution is shaped by:
  // canopy density, inner fill, clump span, dead-branch fraction, lower-crown
  // fill, and coherent sky gaps.
  function drawWhiteOakLeafShape(ctx,size,fillStyle){
    const cx=size*.5,yBase=size*.91,yTip=size*.08,left=[],right=[],steps=34;
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      const y=THREE.MathUtils.lerp(yBase,yTip,t);
      const body=Math.pow(Math.sin(Math.PI*t),.72);
      const lobes=.79+.21*Math.sin((t*4.15-.15)*Math.PI*2);
      const half=size*(.045+.255*body*lobes);
      left.push([cx-half,y]);
      right.push([cx+half,y]);
    }

    ctx.beginPath();
    ctx.moveTo(cx,yBase+size*.035);
    ctx.lineTo(left[0][0],left[0][1]);
    for(const p of left)ctx.lineTo(p[0],p[1]);
    for(let i=right.length-1;i>=0;i--)ctx.lineTo(right[i][0],right[i][1]);
    ctx.closePath();
    ctx.fillStyle=fillStyle;
    ctx.fill();
  }

  function makeWhiteOakLeafTextures(seed=1,size=256){
    const colorCanvas=document.createElement('canvas');
    const alphaCanvas=document.createElement('canvas');
    colorCanvas.width=colorCanvas.height=alphaCanvas.width=alphaCanvas.height=size;
    const cc=colorCanvas.getContext('2d'),ac=alphaCanvas.getContext('2d');
    const rng=mulberry32(seed*5011+29);

    // Transparent pixels keep foliage-green RGB so mip filtering does not make black halos.
    cc.fillStyle='#42663b';cc.fillRect(0,0,size,size);
    ac.fillStyle='#000';ac.fillRect(0,0,size,size);

    const grad=cc.createLinearGradient(0,size,0,0);
    grad.addColorStop(0,'#31532f');
    grad.addColorStop(.48,'#4f773f');
    grad.addColorStop(1,'#6f8b4c');
    drawWhiteOakLeafShape(cc,size,grad);
    drawWhiteOakLeafShape(ac,size,'#fff');

    cc.strokeStyle='rgba(220,235,170,.34)';
    cc.lineWidth=Math.max(1,size*.008);
    cc.beginPath();
    cc.moveTo(size*.5,size*.93);
    cc.lineTo(size*.5,size*.12);
    cc.stroke();

    cc.lineWidth=Math.max(.6,size*.0038);
    for(let i=0;i<7;i++){
      const t=.20+i*.095+(rng()-.5)*.018;
      const y=THREE.MathUtils.lerp(size*.91,size*.11,t);
      const spread=size*(.07+.12*Math.sin(Math.PI*t));
      cc.beginPath();
      cc.moveTo(size*.5,y);cc.lineTo(size*.5-spread,y-size*.04);
      cc.moveTo(size*.5,y);cc.lineTo(size*.5+spread,y-size*.04);
      cc.stroke();
    }

    const map=new THREE.CanvasTexture(colorCanvas),alphaMap=new THREE.CanvasTexture(alphaCanvas);
    map.colorSpace=THREE.SRGBColorSpace;
    for(const tex of [map,alphaMap]){
      tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
      tex.minFilter=THREE.LinearMipmapLinearFilter;
      tex.magFilter=THREE.LinearFilter;
      tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate=true;
    }
    return {map,alphaMap};
  }

  function createOldOakLeafGeometry(){
    // Trim the alpha card around the leaf silhouette instead of drawing a large
    // transparent rectangle. This reduces overdraw and the obvious "paper quad" edge.
    const rows=9,positions=[],uvs=[],indices=[];
    for(let r=0;r<rows;r++){
      const y=r/(rows-1);
      const body=Math.pow(Math.sin(Math.PI*y),.72);
      const lobes=.79+.21*Math.sin((y*4.15-.15)*Math.PI*2);
      const texHalf=.045+.255*body*lobes;
      const worldHalf=.10+.90*(texHalf/.30);
      const bow=Math.sin(Math.PI*y)*.055;

      for(let side=0;side<2;side++){
        const sign=side?1:-1;
        const x=sign*worldHalf*.5;
        const z=bow*(1-Math.abs(x)*.28)+(side?-.008:.008);
        positions.push(x,y,z);
        uvs.push(.5+sign*texHalf,y);
      }
    }
    for(let r=0;r<rows-1;r++){
      const a=r*2,b=a+1,c=a+2,d=a+3;
      indices.push(a,c,b,b,c,d);
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    g.setIndex(indices);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }

  function foliageCellHash(pos,seed){
    // Quantized spatial hash: nearby twigs share a gap decision, producing real
    // canopy holes instead of evenly deleting random leaves.
    const qx=Math.floor(pos.x*.58);
    const qy=Math.floor(pos.y*.42);
    const qz=Math.floor(pos.z*.58);
    const n=Math.sin(qx*127.1+qy*311.7+qz*74.7+seed*19.19)*43758.5453123;
    return n-Math.floor(n);
  }

  function stemTip(stem){
    return stem.rings[stem.rings.length-1].pos;
  }

  function foliageHeightRange(stems){
    let min=Infinity,max=-Infinity;
    for(const stem of stems){
      const y=stemTip(stem).y;
      min=Math.min(min,y);max=Math.max(max,y);
    }
    if(!Number.isFinite(min)||!Number.isFinite(max)||max-min<1e-4)return {min:0,max:1};
    return {min,max};
  }

  function buildFoliagePlan(skeleton,spec,seed){
    const f=spec.foliage;
    const terminalSet=new Set(skeleton.terminalStems.map(s=>s.id));
    const terminal=skeleton.terminalStems;
    const inner=skeleton.stems.filter(s=>s.level===2&&!terminalSet.has(s.id));
    const {min,max}=foliageHeightRange(terminal);
    const heightSpan=Math.max(.001,max-min);
    const plan=[];

    const addStem=(stem,index,isInner)=>{
      const tip=stemTip(stem);
      const rng=mulberry32(seed*7907+stem.id*173+index*31+(isInner?991:0));

      // Whole twig/stem omissions are intentional. They preserve old-tree dead wood.
      const deadChance=THREE.MathUtils.clamp(f.deadBranchFraction*(isInner?.45:1),0,.75);
      if(rng()<deadChance)return;

      // Spatially coherent holes create visible sky gaps through the crown.
      const gapField=foliageCellHash(tip,seed+(isInner?103:0));
      const gapChance=THREE.MathUtils.clamp(f.skyGap*(isInner?.45:1),0,.82);
      if(gapField<gapChance)return;

      const h=THREE.MathUtils.clamp((tip.y-min)/heightSpan,0,1);
      // lowerCrownFill=0 strongly thins the lower crown; 1 gives equal density.
      const lowerWeight=h<.50
        ? THREE.MathUtils.lerp(f.lowerCrownFill,1,h/.50)
        : 1;

      const base=isMobile?f.mobileLeavesPerTwig:f.desktopLeavesPerTwig;
      const innerWeight=isInner?f.innerFill*.62:1;
      const count=Math.max(0,Math.round(base*f.canopyDensity*lowerWeight*innerWeight));
      if(count<=0)return;

      plan.push({stem,count,isInner,rngSeed:seed*7001+stem.id*149+(isInner?31337:0)});
    };

    terminal.forEach((stem,i)=>addStem(stem,i,false));

    // Inner fill adds foliage to secondary stems as a separate canopy-volume layer.
    // It is intentionally lower density than terminal foliage so trunk/branch
    // structure still reads through the crown.
    if(f.innerFill>0){
      inner.forEach((stem,i)=>addStem(stem,i,true));
    }

    return plan;
  }

  function buildOldOakFoliage(skeleton,spec,seed){
    const f=spec.foliage;
    const tex=makeWhiteOakLeafTextures(seed+71,isMobile?192:256);
    const material=new THREE.MeshStandardMaterial({
      map:tex.map,
      alphaMap:tex.alphaMap,
      alphaTest:f.alphaTest,
      side:THREE.DoubleSide,
      roughness:.88,
      metalness:0,
      envMapIntensity:.82,
      depthWrite:true
    });
    material.alphaToCoverage=!isMobile;

    const geometry=createOldOakLeafGeometry();
    const plan=buildFoliagePlan(skeleton,spec,seed);
    const plannedLeaves=plan.reduce((sum,p)=>sum+p.count,0);
    const mesh=new THREE.InstancedMesh(geometry,material,Math.max(1,plannedLeaves));
    mesh.castShadow=true;mesh.receiveShadow=true;

    const dummy=new THREE.Object3D();
    const basis=new THREE.Matrix4(),quat=new THREE.Quaternion();
    const binormal=new THREE.Vector3(),radial=new THREE.Vector3(),leafDir=new THREE.Vector3();
    const side=new THREE.Vector3(),face=new THREE.Vector3();
    const palette=[
      new THREE.Color(0x4e753f),new THREE.Color(0x5d8248),new THREE.Color(0x41683a),
      new THREE.Color(0x6a8a4d),new THREE.Color(0x557944)
    ];

    let count=0;
    for(const item of plan){
      const stem=item.stem;
      const rng=mulberry32(item.rngSeed);
      const clumpSpan=THREE.MathUtils.clamp(f.clumpSpan,0.18,.96);
      const tMin=THREE.MathUtils.clamp(.96-clumpSpan+(item.isInner?.12:0),.08,.78);
      const tMax=item.isInner?.90:.975;

      for(let i=0;i<item.count;i++){
        // A gentle distal bias keeps leaves in branch-end masses while clumpSpan
        // controls how far those masses extend back toward the parent.
        const u=(i+.28+rng()*.44)/(item.count+.35);
        const biased=1-Math.pow(1-THREE.MathUtils.clamp(u,0,1),1.28);
        const t=THREE.MathUtils.lerp(tMin,tMax,biased);
        const ring=oldOakRingAt(stem.rings,t);
        binormal.crossVectors(ring.tangent,ring.normal).normalize();

        const roll=i*OAK_GOLDEN_ANGLE+(rng()*2-1)*.38;
        radial.copy(ring.normal).multiplyScalar(Math.cos(roll))
          .addScaledVector(binormal,Math.sin(roll)).normalize();

        const angle=(f.downAngle+(rng()*2-1)*f.angleVariance)*OAK_DEG2RAD;
        leafDir.copy(ring.tangent).multiplyScalar(Math.cos(angle))
          .addScaledVector(radial,Math.sin(angle))
          .lerp(OAK_UP,.10).normalize();

        face.copy(radial).lerp(OAK_UP,.10).normalize();
        side.crossVectors(leafDir,face);
        if(side.lengthSq()<1e-5)side.copy(binormal);
        side.normalize();
        face.crossVectors(side,leafDir).normalize();
        basis.makeBasis(side,leafDir,face);
        quat.setFromRotationMatrix(basis);

        dummy.position.copy(ring.pos).addScaledVector(radial,.018);
        dummy.quaternion.copy(quat);
        const leafSize=f.size*(1+(rng()*2-1)*f.sizeVariance);
        dummy.scale.set(leafSize*.62,leafSize,1);
        dummy.updateMatrix();
        mesh.setMatrixAt(count,dummy.matrix);

        const color=palette[Math.floor(rng()*palette.length)%palette.length].clone();
        const innerShade=item.isInner?-.055:0;
        color.offsetHSL((rng()-.5)*.025,(rng()-.5)*.06,(rng()-.5)*.055+innerShade);
        mesh.setColorAt(count,color);
        count++;
      }
    }

    mesh.count=count;
    mesh.instanceMatrix.needsUpdate=true;
    if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    mesh.computeBoundingSphere();
    mesh.userData.foliagePlan={
      plannedLeaves,
      renderedLeaves:count,
      terminalGroups:plan.filter(p=>!p.isInner).length,
      innerGroups:plan.filter(p=>p.isInner).length
    };
    return mesh;
  }
