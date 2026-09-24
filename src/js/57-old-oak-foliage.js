  // OLD OAK FOLIAGE — base-anchored individual oak leaves
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

    // Transparent pixels keep green RGB so mip filtering does not make black halos.
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
    const rows=4,positions=[],uvs=[],indices=[];
    for(let r=0;r<rows;r++){
      const y=r/(rows-1),bow=Math.sin(Math.PI*y)*.055;
      for(let side=0;side<2;side++){
        const x=side?.5:-.5;
        const z=bow*(1-Math.abs(x)*.35)+(side?-.008:.008);
        positions.push(x,y,z);
        uvs.push(side,y);
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

  function buildOldOakFoliage(skeleton,spec,seed){
    const tex=makeWhiteOakLeafTextures(seed+71,isMobile?192:256);
    const material=new THREE.MeshStandardMaterial({
      map:tex.map,
      alphaMap:tex.alphaMap,
      alphaTest:spec.foliage.alphaTest,
      side:THREE.DoubleSide,
      roughness:.88,
      metalness:0,
      envMapIntensity:.82,
      depthWrite:true
    });
    material.alphaToCoverage=!isMobile;

    const geometry=createOldOakLeafGeometry();
    const leavesPerTwig=isMobile?spec.foliage.mobileLeavesPerTwig:spec.foliage.desktopLeavesPerTwig;
    const maxLeaves=skeleton.terminalStems.length*leavesPerTwig;
    const mesh=new THREE.InstancedMesh(geometry,material,maxLeaves);
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
    for(let s=0;s<skeleton.terminalStems.length;s++){
      const stem=skeleton.terminalStems[s],rng=mulberry32(seed*7001+s*149);
      for(let i=0;i<leavesPerTwig;i++){
        const t=THREE.MathUtils.clamp(.24+(i+.35+rng()*.32)/(leavesPerTwig+.45)*.73,.22,.96);
        const ring=oldOakRingAt(stem.rings,t);
        binormal.crossVectors(ring.tangent,ring.normal).normalize();

        const roll=i*OAK_GOLDEN_ANGLE+(rng()*2-1)*.34;
        radial.copy(ring.normal).multiplyScalar(Math.cos(roll))
          .addScaledVector(binormal,Math.sin(roll)).normalize();

        const angle=(spec.foliage.downAngle+(rng()*2-1)*spec.foliage.angleVariance)*OAK_DEG2RAD;
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
        const leafSize=spec.foliage.size*(1+(rng()*2-1)*spec.foliage.sizeVariance);
        dummy.scale.set(leafSize*.62,leafSize,1);
        dummy.updateMatrix();
        mesh.setMatrixAt(count,dummy.matrix);

        const color=palette[Math.floor(rng()*palette.length)%palette.length].clone();
        color.offsetHSL((rng()-.5)*.025,(rng()-.5)*.06,(rng()-.5)*.055);
        mesh.setColorAt(count,color);
        count++;
      }
    }

    mesh.count=count;
    mesh.instanceMatrix.needsUpdate=true;
    if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    mesh.computeBoundingSphere();
    return mesh;
  }
