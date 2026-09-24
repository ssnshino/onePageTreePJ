  // OLD OAK SKELETON — Weber/Penn + Three.js TreeGenerator inspired
  const OAK_UP=new THREE.Vector3(0,1,0);
  const OAK_GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
  const OAK_DEG2RAD=Math.PI/180;
  const _oakAxis=new THREE.Vector3();

  function oldOakPerpendicular(v){
    const a=Math.abs(v.x)<.9?_oakAxis.set(1,0,0):_oakAxis.set(0,1,0);
    return new THREE.Vector3().crossVectors(v,a).normalize();
  }
  function oldOakTransport(t0,t1,n){
    _oakAxis.crossVectors(t0,t1);
    const sin=_oakAxis.length();
    if(sin<1e-6)return;
    _oakAxis.divideScalar(sin);
    n.applyAxisAngle(_oakAxis,Math.atan2(sin,t0.dot(t1)));
  }
  function oldOakRingAt(rings,t){
    const f=THREE.MathUtils.clamp(t,0,.999)*(rings.length-1);
    const i=Math.floor(f),frac=f-i;
    const a=rings[i],b=rings[i+1];
    return {
      pos:a.pos.clone().lerp(b.pos,frac),
      tangent:a.tangent.clone().lerp(b.tangent,frac).normalize(),
      normal:a.normal.clone().lerp(b.normal,frac).normalize(),
      radius:THREE.MathUtils.lerp(a.radius,b.radius,frac)
    };
  }
  function oldOakShapeRatio(t){
    return .20+.80*Math.sin(Math.PI*THREE.MathUtils.clamp(t,0,1));
  }
  function oldOakCurveStep(spec,level,t,sections){
    const front=spec.curve[level]||0,back=spec.curveBack[level]||0;
    if(t<.5)return (front*2/sections)*OAK_DEG2RAD;
    return ((back||front)*2/sections)*OAK_DEG2RAD;
  }

  function generateOldOakSkeleton(spec,seed=spec.seed){
    const random=mulberry32(seed),stems=[],terminalStems=[];
    let nextId=1;

    function growBranch(base,dir,length,baseRadius,level,parentId){
      const sections=Math.max(3,Math.min(28,Math.round(length/spec.sectionLength[Math.min(level,3)])));
      const radial=spec.radialSegments[Math.min(level,3)];
      const step=length/sections;
      const gnarl=spec.gnarl[Math.min(level,3)];
      let tangent=dir.clone().normalize();
      const normal=oldOakPerpendicular(tangent),rings=[],pos=base.clone(),id=nextId++;

      for(let s=0;s<=sections;s++){
        const t=s/sections;
        let radius=baseRadius*((1-spec.taper)+spec.taper*Math.pow(1-t,spec.taperCurve));
        if(level===0){
          const flare=Math.max(0,(spec.flareFrac-t)/spec.flareFrac);
          radius*=1+spec.rootFlare*flare*flare*flare;
        }else if(spec.junctionCollarScale>0 && t<spec.junctionCollarLength){
          // Low-cost branch collar: soften the visual "tube stabbed into tube"
          // transition before a future continuous-junction mesh pass.
          const collar=1-t/spec.junctionCollarLength;
          radius*=1+spec.junctionCollarScale*collar*collar;
        }
        rings.push({pos:pos.clone(),tangent:tangent.clone(),normal:normal.clone(),radius});

        if(s<sections){
          const next=tangent.clone();
          const bend=oldOakCurveStep(spec,level,t,sections);
          if(Math.abs(bend)>1e-6)next.applyAxisAngle(normal,bend);
          next.x+=(random()*2-1)*gnarl;
          next.y+=(random()*2-1)*gnarl*.68;
          next.z+=(random()*2-1)*gnarl;
          if(level>0)next.y-=spec.droop[level]*step;
          const tropism=spec.upPull[level]||0;
          if(tropism>0)next.lerp(OAK_UP,Math.min(.075,tropism/sections*2.8));
          next.normalize();
          oldOakTransport(tangent,next,normal);
          pos.addScaledVector(next,step);
          tangent=next;
        }
      }

      const stem={id,parentId,level,length,baseRadius,radial,rings};
      stems.push(stem);
      if(level>=spec.levels-1||length<spec.minLength){
        terminalStems.push(stem);
        return stem;
      }

      const n=spec.children[Math.min(level,spec.children.length-1)];
      const start=level===0?spec.trunkClear:spec.childStart[Math.min(level,spec.childStart.length-1)];
      const pipeDrop=Math.pow(1/n,1/spec.radiusExponent);

      for(let i=0;i<n;i++){
        if(level>0&&random()<(spec.pruneChance[level]||0))continue;
        const t=THREE.MathUtils.clamp(
          start+(i+.5+(random()-.5)*.58)/n*(1-start),
          start+.01,.965
        );
        const ring=oldOakRingAt(rings,t);

        let angle=spec.branchAngle[Math.min(level,spec.branchAngle.length-1)];
        if(level===0){
          const crownT=(t-spec.trunkClear)/(1-spec.trunkClear);
          angle+=THREE.MathUtils.lerp(7,-13,crownT);
        }
        angle+=(random()*2-1)*spec.angleVariance[Math.min(level,spec.angleVariance.length-1)];

        const roll=i*OAK_GOLDEN_ANGLE+(random()*2-1)*.42;
        const childDir=ring.tangent.clone()
          .applyAxisAngle(ring.normal,angle*OAK_DEG2RAD)
          .applyAxisAngle(ring.tangent,roll);

        const pull=spec.upPull[Math.min(level+1,spec.upPull.length-1)]||0;
        if(pull>0)childDir.lerp(OAK_UP,pull).normalize();

        const childBase=Math.max(spec.minRadius,Math.min(baseRadius*pipeDrop,ring.radius*.92));
        let childLength=length*spec.lengthRatio[Math.min(level,spec.lengthRatio.length-1)];
        if(level===0){
          const crownT=(t-spec.trunkClear)/(1-spec.trunkClear);
          childLength*=oldOakShapeRatio(crownT);
        }
        childLength*=1-(spec.branchLengthFalloff[level]||0)*t;
        childLength*=1+(random()*2-1)*spec.lengthVariance[Math.min(level,spec.lengthVariance.length-1)];
        growBranch(ring.pos,childDir,childLength,childBase,level+1,id);
      }
      return stem;
    }

    growBranch(new THREE.Vector3(0,0,0),new THREE.Vector3(.025,1,-.018),spec.trunkLength,spec.trunkRadius,0,null);
    return {stems,terminalStems};
  }

  function oldOakStemFromPoints(points,r0,r1,radial=8,level=0){
    const rings=[];
    let normal=null,prevTangent=null;
    for(let i=0;i<points.length;i++){
      let tangent;
      if(i===0)tangent=points[1].clone().sub(points[0]).normalize();
      else if(i===points.length-1)tangent=points[i].clone().sub(points[i-1]).normalize();
      else tangent=points[i+1].clone().sub(points[i-1]).normalize();

      if(!normal)normal=oldOakPerpendicular(tangent);
      else if(prevTangent)oldOakTransport(prevTangent,tangent,normal);
      prevTangent=tangent.clone();

      const t=i/(points.length-1);
      rings.push({
        pos:points[i].clone(),
        tangent,
        normal:normal.clone(),
        radius:THREE.MathUtils.lerp(r0,r1,Math.pow(t,.72))
      });
    }
    let length=0;
    for(let i=1;i<points.length;i++)length+=points[i].distanceTo(points[i-1]);
    return {id:-1,parentId:null,level,length,baseRadius:r0,radial,rings};
  }

  function buildOldOakSurfaceRootStems(spec,seed,worldOrigin){
    const random=mulberry32(seed*3023+91),stems=[];
    for(let i=0;i<spec.rootCount;i++){
      const a=i/spec.rootCount*Math.PI*2+(random()-.5)*.34;
      const len=THREE.MathUtils.lerp(spec.rootLength[0],spec.rootLength[1],random());
      const r0=THREE.MathUtils.lerp(spec.rootRadius[0],spec.rootRadius[1],random());
      const pts=[],segs=4;

      for(let s=0;s<=segs;s++){
        const t=s/segs;
        const drift=(random()-.5)*.22*t;
        const ang=a+drift;
        const dist=len*Math.pow(t,.90);
        const x=Math.cos(ang)*dist,z=Math.sin(ang)*dist;
        const ground=terrainHeight(worldOrigin.x+x,worldOrigin.z+z)-worldOrigin.y;
        const arch=Math.sin(Math.PI*t)*(.14+.16*random())*(1-t*.35);
        const y=THREE.MathUtils.lerp(.20,ground+.015,t)+arch;
        pts.push(new THREE.Vector3(x,y,z));
      }
      stems.push(oldOakStemFromPoints(pts,r0,.025,8,0));
    }
    return stems;
  }

  function buildOldOakWoodGeometry(stems,spec){
    let vertexCount=0,indexCount=0;
    for(const stem of stems){
      vertexCount+=stem.rings.length*stem.radial;
      indexCount+=(stem.rings.length-1)*stem.radial*6;
    }

    const positions=new Float32Array(vertexCount*3);
    const normals=new Float32Array(vertexCount*3);
    const uvs=new Float32Array(vertexCount*2);
    const indices=new (vertexCount>65535?Uint32Array:Uint16Array)(indexCount);
    const binormal=new THREE.Vector3();
    let vo=0,io=0,po=0,uo=0;

    for(const stem of stems){
      const radial=stem.radial;
      for(let r=0;r<stem.rings.length;r++){
        const ring=stem.rings[r];
        binormal.crossVectors(ring.tangent,ring.normal).normalize();
        const v=(r/(stem.rings.length-1))*Math.max(1,stem.length/spec.barkTileWorldSize);

        for(let j=0;j<radial;j++){
          const ang=j/radial*Math.PI*2,c=Math.cos(ang),s=Math.sin(ang);
          const nx=c*ring.normal.x+s*binormal.x;
          const ny=c*ring.normal.y+s*binormal.y;
          const nz=c*ring.normal.z+s*binormal.z;
          const barkWarp=1+.016*Math.sin(j*2.27+r*.83+stem.id*.37);
          const rr=ring.radius*barkWarp;
          positions[po]=ring.pos.x+nx*rr;normals[po++]=nx;
          positions[po]=ring.pos.y+ny*rr;normals[po++]=ny;
          positions[po]=ring.pos.z+nz*rr;normals[po++]=nz;
          uvs[uo++]=j/radial;
          uvs[uo++]=v;
        }
      }

      for(let r=0;r<stem.rings.length-1;r++){
        const a=vo+r*radial,b=a+radial;
        for(let j=0;j<radial;j++){
          const n=(j+1)%radial;
          indices[io++]=a+j;indices[io++]=b+n;indices[io++]=b+j;
          indices[io++]=a+j;indices[io++]=a+n;indices[io++]=b+n;
        }
      }
      vo+=stem.rings.length*radial;
    }

    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(positions,3));
    g.setAttribute('normal',new THREE.BufferAttribute(normals,3));
    g.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
    g.setIndex(new THREE.BufferAttribute(indices,1));
    g.computeBoundingSphere();
    return g;
  }
