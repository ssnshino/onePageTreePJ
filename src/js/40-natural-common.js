  // ---------------------------------------------------------------------------
  // TREES & ROCKS QUALITY PASS
  // ---------------------------------------------------------------------------

  // Deterministic helpers used by geometry generation.
  function mulberry32(seed){
    let a=(seed>>>0)||1;
    return ()=>{
      a|=0;a=a+0x6D2B79F5|0;
      let t=Math.imul(a^a>>>15,1|a);
      t=t+Math.imul(t^t>>>7,61|t)^t;
      return ((t^t>>>14)>>>0)/4294967296;
    };
  }
  function hash3(x,y,z){
    const s=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453123;
    return s-Math.floor(s);
  }
  function noise3(x,y,z){
    const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
    const xf=x-xi, yf=y-yi, zf=z-zi;
    const u=smooth(xf), v=smooth(yf), w=smooth(zf);
    const h=(dx,dy,dz)=>hash3(xi+dx,yi+dy,zi+dz);
    const x00=THREE.MathUtils.lerp(h(0,0,0),h(1,0,0),u);
    const x10=THREE.MathUtils.lerp(h(0,1,0),h(1,1,0),u);
    const x01=THREE.MathUtils.lerp(h(0,0,1),h(1,0,1),u);
    const x11=THREE.MathUtils.lerp(h(0,1,1),h(1,1,1),u);
    const y0=THREE.MathUtils.lerp(x00,x10,v);
    const y1=THREE.MathUtils.lerp(x01,x11,v);
    return THREE.MathUtils.lerp(y0,y1,w)*2-1;
  }
  function fbm3(x,y,z){
    let a=.55,f=1,s=0,n=0;
    for(let i=0;i<4;i++){
      s+=noise3(x*f,y*f,z*f)*a;
      n+=a;a*=.5;f*=2.07;
    }
    return s/n;
  }

  // ---------------------------------------------------------------------------
  // Procedural surface maps: no external texture assets.
  // ---------------------------------------------------------------------------
  function makeStoneTextures(seed=1,size=256){
    const colorCanvas=document.createElement('canvas');
    const bumpCanvas=document.createElement('canvas');
    colorCanvas.width=colorCanvas.height=bumpCanvas.width=bumpCanvas.height=size;
    const cc=colorCanvas.getContext('2d'), bc=bumpCanvas.getContext('2d');
    const ci=cc.createImageData(size,size), bi=bc.createImageData(size,size);
    const rng=mulberry32(seed*9187+17);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const i=(y*size+x)*4;
      const n1=fbm((x+seed*31)*.045,(y-seed*19)*.045);
      const n2=fbm((x-seed*11)*.12,(y+seed*7)*.12);
      const grain=THREE.MathUtils.clamp(.52+n1*.28+n2*.10,0,1);
      const lichen=fbm((x+53)*.022,(y-71)*.022)>.18 && noise2(x*.09+seed,y*.09-seed)>.25;
      let r=92+grain*55, g=91+grain*51, b=84+grain*45;
      if(lichen){r*=.77;g*=.94;b*=.70;}
      ci.data[i]=Math.round(r);ci.data[i+1]=Math.round(g);ci.data[i+2]=Math.round(b);ci.data[i+3]=255;
      const bump=THREE.MathUtils.clamp(125+n1*72+n2*35,12,242);
      bi.data[i]=bi.data[i+1]=bi.data[i+2]=Math.round(bump);bi.data[i+3]=255;
    }
    cc.putImageData(ci,0,0);bc.putImageData(bi,0,0);

    // Fracture lines. Dark in albedo, deeply recessed in bump.
    for(let k=0;k<18;k++){
      let x=rng()*size,y=rng()*size;
      cc.strokeStyle=`rgba(35,32,28,${.16+rng()*.18})`;
      cc.lineWidth=.7+rng()*1.6;
      bc.strokeStyle=`rgba(25,25,25,${.48+rng()*.28})`;
      bc.lineWidth=1+rng()*2.2;
      cc.beginPath();bc.beginPath();cc.moveTo(x,y);bc.moveTo(x,y);
      const steps=3+Math.floor(rng()*6);
      for(let s=0;s<steps;s++){
        x+=(-18+rng()*36);y+=(-14+rng()*28);
        cc.lineTo(x,y);bc.lineTo(x,y);
      }
      cc.stroke();bc.stroke();
    }

    const map=new THREE.CanvasTexture(colorCanvas);
    const bump=new THREE.CanvasTexture(bumpCanvas);
    map.colorSpace=THREE.SRGBColorSpace;
    [map,bump].forEach(t=>{
      t.wrapS=t.wrapT=THREE.RepeatWrapping;
      t.repeat.set(1.7,1.4);
      t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    });
    return {map,bump};
  }

  function makeBarkTextures(seed=1,size=256){
    const colorCanvas=document.createElement('canvas');
    const bumpCanvas=document.createElement('canvas');
    colorCanvas.width=colorCanvas.height=bumpCanvas.width=bumpCanvas.height=size;
    const cc=colorCanvas.getContext('2d'), bc=bumpCanvas.getContext('2d');
    const ci=cc.createImageData(size,size),bi=bc.createImageData(size,size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const i=(y*size+x)*4;
      const vertical=Math.sin(x*.19+noise2(x*.035+seed,y*.012)*3.2);
      const fine=noise2(x*.10+seed*3,y*.065-seed);
      const fissure=Math.abs(vertical)>.78 ? -.35 : 0;
      const v=THREE.MathUtils.clamp(.49+vertical*.10+fine*.10+fissure,0,1);
      ci.data[i]=Math.round(70+v*60);
      ci.data[i+1]=Math.round(47+v*42);
      ci.data[i+2]=Math.round(31+v*28);
      ci.data[i+3]=255;
      const b=THREE.MathUtils.clamp(125+vertical*55+fine*35+fissure*130,8,245);
      bi.data[i]=bi.data[i+1]=bi.data[i+2]=Math.round(b);bi.data[i+3]=255;
    }
    cc.putImageData(ci,0,0);bc.putImageData(bi,0,0);
    const map=new THREE.CanvasTexture(colorCanvas),bump=new THREE.CanvasTexture(bumpCanvas);
    map.colorSpace=THREE.SRGBColorSpace;
    [map,bump].forEach(t=>{
      t.wrapS=t.wrapT=THREE.RepeatWrapping;
      t.repeat.set(1.1,4.2);
      t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    });
    return {map,bump};
  }

  const stoneTexA=makeStoneTextures(11), stoneTexB=makeStoneTextures(29);
  const rockMatA=new THREE.MeshStandardMaterial({map:stoneTexA.map,bumpMap:stoneTexA.bump,bumpScale:.16,roughness:.91,metalness:0});
  const rockMatB=new THREE.MeshStandardMaterial({map:stoneTexB.map,bumpMap:stoneTexB.bump,bumpScale:.12,roughness:.94,metalness:0,color:0xc2beb3});
  const underwaterRockMat=new THREE.MeshStandardMaterial({map:stoneTexA.map,bumpMap:stoneTexA.bump,bumpScale:.08,roughness:.97,metalness:0,color:0x8b8e79});

  const barkTex=makeBarkTextures(7);
  const treeBarkMat=new THREE.MeshStandardMaterial({
    map:barkTex.map,bumpMap:barkTex.bump,bumpScale:.075,roughness:.96,metalness:0,color:0xffffff
  });
  const treeLeafMat=new THREE.MeshStandardMaterial({
    color:0xffffff,roughness:.91,metalness:0,envMapIntensity:.72
  });

