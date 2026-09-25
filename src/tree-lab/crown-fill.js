// TREE LAB ONLY — CROWN FILL PASS / hybrid Space Colonization experiment
//
// This file intentionally stays out of the production one-page world build.
// It takes the existing OLD_OAK skeleton and performs a small number of
// terminal-tip extension passes toward deterministic attraction points.
//
// Research basis:
// Runions, Lane & Prusinkiewicz (2007), Space Colonization Algorithm.
// Each attraction point influences its closest eligible tip within an
// influence radius; the tip grows in the average normalized direction.
// Reached points are removed using a kill distance.

function createCrownTargetCloud(spec,seed,count){
  const targetHeight=Math.max(4,spec.trunkLength);
  const spreadRatio=THREE.MathUtils.clamp(spec.lengthRatio?.[0]||.52,.42,.88);
  // Keep the Bedford-like oblate envelope used by the diagnostic, but let
  // crownSpread expand/contract it modestly around the established baseline.
  const spreadScale=THREE.MathUtils.clamp(.72+spreadRatio*.32,.84,1.02);
  const rx=targetHeight*.87*spreadScale;
  const rz=rx*.86;
  const ry=targetHeight*.48;
  const cy=targetHeight*.53;
  const rng=mulberry32(seed*9127+17);
  const points=[];
  let guard=0;

  while(points.length<count&&guard<count*12){
    guard++;
    const z=rng()*2-1;
    const phi=rng()*Math.PI*2;
    const s=Math.sqrt(Math.max(0,1-z*z));
    const surfaceBiased=rng()<.68;
    const radial=surfaceBiased?(.58+.42*Math.sqrt(rng())):Math.cbrt(rng())*.82;
    const p=new THREE.Vector3(
      Math.cos(phi)*s*radial*rx,
      cy+z*radial*ry,
      Math.sin(phi)*s*radial*rz
    );
    if(p.y<.45)continue;
    points.push(p);
  }
  return {points,targetHeight,rx,ry,rz,cy};
}

function crownFillBranchSamples(skeleton){
  const samples=[];
  for(const stem of skeleton.stems){
    if(stem.level===0)continue;
    for(const ring of stem.rings)samples.push(ring.pos);
  }
  return samples;
}

function crownFillPointNearSamples(point,samples,radiusSq){
  for(const q of samples){
    const dx=point.x-q.x,dy=point.y-q.y,dz=point.z-q.z;
    if(dx*dx+dy*dy+dz*dz<=radiusSq)return true;
  }
  return false;
}

function crownFillCullReached(points,skeleton,killDistance){
  const samples=crownFillBranchSamples(skeleton);
  const r2=killDistance*killDistance;
  return points.filter(p=>!crownFillPointNearSamples(p,samples,r2));
}

function crownFillLimitTurn(currentDir,targetDir,maxAngleRad){
  const a=currentDir.clone().normalize();
  const b=targetDir.clone().normalize();
  const dot=THREE.MathUtils.clamp(a.dot(b),-1,1);
  const angle=Math.acos(dot);
  if(angle<=maxAngleRad)return b;
  const t=maxAngleRad/Math.max(angle,1e-6);
  return a.lerp(b,t).normalize();
}

function crownFillMakeExtension(parent,dir,segmentLength,spec,nextId,passIndex){
  const last=parent.rings[parent.rings.length-1];
  const base=last.pos.clone();
  const tangent=last.tangent.clone().normalize();
  const midDir=tangent.clone().lerp(dir,.58).normalize();
  const mid=base.clone().addScaledVector(midDir,segmentLength*.48);
  const end=base.clone().addScaledVector(dir,segmentLength);

  const level=Math.min(spec.levels-1,Math.max(2,parent.level));
  const radial=spec.radialSegments[Math.min(level,3)];
  const r0=Math.max(spec.minRadius*1.08,last.radius*.94);
  const r1=Math.max(spec.minRadius*.72,r0*.58);
  const stem=oldOakStemFromPoints([base,mid,end],r0,r1,radial,level);
  stem.id=nextId;
  stem.parentId=parent.id;
  stem.growthPass=passIndex;
  stem.isCrownFill=true;
  return stem;
}

function runCrownFillPasses(skeleton,spec,seed,passCount,options={}){
  const requested=Math.max(0,Math.floor(passCount||0));
  const segmentLength=THREE.MathUtils.clamp(options.segmentLength??.68,.25,1.50);
  const maxTips=Math.max(1,Math.floor(options.maxTips??10));
  // Practical ratios follow the classic SCA parameter relationship:
  // influence several segment lengths, kill distance around ~2D.
  const influenceRadius=segmentLength*(options.influenceRatio??4.2);
  const killDistance=segmentLength*(options.killRatio??1.8);
  const continuity=THREE.MathUtils.clamp(options.continuity??.72,0,2);
  const attractionWeight=THREE.MathUtils.clamp(options.attractionWeight??1.0,.1,3);
  const upBias=THREE.MathUtils.clamp(options.upBias??.05,-.4,.4);
  const maxTurn=(options.maxTurnDeg??34)*OAK_DEG2RAD;
  const cloud=createCrownTargetCloud(spec,seed,options.pointCount??(isMobile?260:440));

  let active=crownFillCullReached(cloud.points,skeleton,killDistance);
  let nextId=skeleton.stems.reduce((m,s)=>Math.max(m,s.id||0),0)+1;
  const passStats=[];
  const grownStems=[];

  for(let pass=0;pass<requested;pass++){
    if(active.length===0)break;
    const tips=skeleton.terminalStems.filter(s=>s.level>=2&&s.rings.length>1);
    if(tips.length===0)break;

    const assignments=new Map();
    for(const p of active){
      let best=null,bestD2=influenceRadius*influenceRadius;
      for(const stem of tips){
        const tip=stem.rings[stem.rings.length-1].pos;
        const d2=tip.distanceToSquared(p);
        if(d2<bestD2){bestD2=d2;best=stem}
      }
      if(!best)continue;
      let a=assignments.get(best.id);
      if(!a){
        a={stem:best,points:[],dir:new THREE.Vector3(),score:0,nearest:Infinity};
        assignments.set(best.id,a);
      }
      const tip=best.rings[best.rings.length-1].pos;
      const v=p.clone().sub(tip);
      const dist=Math.max(v.length(),1e-5);
      a.points.push(p);
      a.dir.addScaledVector(v.divideScalar(dist),1);
      a.nearest=Math.min(a.nearest,dist);
    }

    const candidates=[];
    for(const a of assignments.values()){
      if(a.points.length===0||a.dir.lengthSq()<1e-8)continue;
      const tipRing=a.stem.rings[a.stem.rings.length-1];
      const attractionDir=a.dir.normalize();
      const continuityDir=tipRing.tangent.clone().normalize();
      const desired=attractionDir.multiplyScalar(attractionWeight)
        .addScaledVector(continuityDir,continuity)
        .addScaledVector(OAK_UP,upBias)
        .normalize();
      const finalDir=crownFillLimitTurn(continuityDir,desired,maxTurn);

      // Favor tips claimed by many targets; mild bonus for closer targets.
      a.score=a.points.length+(1/Math.max(.25,a.nearest))*.35;
      candidates.push({stem:a.stem,dir:finalDir,score:a.score,claimed:a.points.length});
    }

    candidates.sort((a,b)=>b.score-a.score);
    const chosen=candidates.slice(0,maxTips);
    if(chosen.length===0){
      passStats.push({pass:pass+1,grown:0,active:active.length});
      break;
    }

    const grownParents=new Set();
    const newTerminals=[];
    for(const c of chosen){
      const child=crownFillMakeExtension(c.stem,c.dir,segmentLength,spec,nextId++,pass+1);
      skeleton.stems.push(child);
      grownStems.push(child);
      grownParents.add(c.stem.id);
      newTerminals.push(child);
    }

    skeleton.terminalStems=skeleton.terminalStems.filter(s=>!grownParents.has(s.id));
    skeleton.terminalStems.push(...newTerminals);
    active=crownFillCullReached(active,skeleton,killDistance);
    passStats.push({pass:pass+1,grown:newTerminals.length,active:active.length});
  }

  return {
    skeleton,
    cloud,
    activePoints:active,
    grownStems,
    passesCompleted:passStats.length,
    passStats,
    segmentLength,
    influenceRadius,
    killDistance
  };
}
