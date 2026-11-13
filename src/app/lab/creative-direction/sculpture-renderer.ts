/** Local prototype renderer: closed parametric meshes, perspective and analytic sky light.
 * No textures, downloaded geometry, framework, continuous idle loop or runtime service.
 */
type Vec3 = [number, number, number];
export type SculptureVariant = 'A'|'B'|'C';
const unit = (a:Vec3):Vec3 => {const n=Math.hypot(...a)||1;return a.map(x=>x/n) as Vec3};
const sub = (a:Vec3,b:Vec3):Vec3 => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross = (a:Vec3,b:Vec3):Vec3 => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function geometry(kind:SculptureVariant) {
  const vertices:number[]=[];
  const point=(t:number,u:number,face:number,branch:number):Vec3=>{
    const s=branch?1:-1;
    const bend=kind==='A'?.25:kind==='B'?.13:.14;
    const length=kind==='C'?.9:1.22;
    const x=s*(t*.94+bend*Math.sin(t*Math.PI));
    const y=t*length;
    const dx=s*(.94+bend*Math.PI*Math.cos(t*Math.PI));
    const dy=length;
    const twist=(kind==='A'?1.3:kind==='B'?.9:.6)*Math.sin(t*2.2)+s*.18;
    const w=(kind==='C'?.32:kind==='B'?.29:.27)+.065*Math.cos(t*1.8);
    const len=Math.hypot(dx,dy);
    const depth=kind==='C'?.19:.105;
    return [x-dy/len*u*w*Math.cos(twist), y+dx/len*u*w*Math.cos(twist),
      s*(kind==='C'?.23:.2)+Math.sin(t*2.7)*.23+u*w*Math.sin(twist)+face*depth*(1-.18*u*u)];
  };
  const vertex=(t:number,u:number,face:number,b:number)=>{
    const p=point(t,u,face,b);
    let n=unit(cross(sub(point(t+.001,u,face,b),p),sub(point(t,u+.001,face,b),p)));
    if(n[2]*face<0)n=n.map(x=>-x) as Vec3;
    return [...p,...n,b];
  };
  const tri=(a:number[],b:number[],c:number[])=>vertices.push(...a,...b,...c);
  const steps=48,bands=10;
  for(let b=0;b<2;b++){
    for(const face of [-1,1])for(let i=0;i<steps;i++)for(let j=0;j<bands;j++){
      const t=-1+2*i/steps,tn=t+2/steps,u=-1+2*j/bands,un=u+2/bands;
      const a=vertex(t,u,face,b),c=vertex(tn,un,face,b);
      tri(a,vertex(tn,u,face,b),c);tri(a,c,vertex(t,un,face,b));
    }
    // Close the narrow edges and terminal faces, with their own normals.
    const edge=(p:Vec3,q:Vec3,r:Vec3,s:Vec3)=>{
      const n=unit(cross(sub(q,p),sub(r,p))),a=[...p,...n,b],c=[...r,...n,b];
      tri(a,[...q,...n,b],c);tri(a,c,[...s,...n,b]);
    };
    for(const u of [-1,1])for(let i=0;i<steps;i++){
      const t=-1+i*2/steps,tn=t+2/steps;
      edge(point(t,u,-1,b),point(tn,u,-1,b),point(tn,u,1,b),point(t,u,1,b));
    }
    for(const t of [-1,1])for(let j=0;j<bands;j++){
      const u=-1+j*2/bands,un=u+2/bands;
      edge(point(t,u,-1,b),point(t,un,-1,b),point(t,un,1,b),point(t,u,1,b));
    }
  }
  return new Float32Array(vertices);
}
const vertexSource=`
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute float aMaterial;
uniform vec2 uRotation;
uniform float uAspect;
uniform float uMorph;
uniform float uIntro;
uniform float uKind;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vMaterial;
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
void main(){
 vec3 scale=vec3(1.,1.,1.);
 if(uKind>0.5 && uKind<1.5)scale=vec3(1.+uMorph*.45,1.-uMorph*.12,1.-uMorph*.65);
 vec3 p=aPosition*scale;
 mat3 rotation=rotZ(-.24+uMorph*.15)*rotY(uRotation.x+(1.-uIntro)*.9)*rotX(uRotation.y-.10);
 p=rotation*p;
 vNormal=rotation*normalize(aNormal/scale);
 vPosition=p;vMaterial=aMaterial;
 float distance=5.5-p.z;
 float focal=2.8;
 gl_Position=vec4(p.x*focal/uAspect,p.y*focal,.99*distance-.4,distance);
}`;
const fragmentSource=`
precision highp float;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vMaterial;
uniform float uKind;
vec3 environment(vec3 d){
 vec3 ground=vec3(.73,.79,.80),sky=vec3(.28,.57,.82),cloud=vec3(.98,.985,.96);
 float horizon=smoothstep(-.35,.65,d.y);
 vec3 e=mix(ground,sky,horizon);
 float ribbons=sin(d.x*5.+d.y*3.)*.55+sin(d.z*7.-d.x*2.)*.28;
 float c=smoothstep(.15,.55,ribbons)*smoothstep(-.05,.45,d.y);
 return mix(e,cloud,c*.85);
}
void main(){
 vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;
 vec3 v=normalize(vec3(0.,0.,5.5)-vPosition);
 vec3 l=normalize(vec3(-1.8,2.8,3.5));
 float diffuse=max(dot(n,l),0.);
 vec3 blue=uKind>1.5?vec3(.10,.49,.73):uKind>.5?vec3(.19,.40,.64):vec3(.22,.49,.72);
 vec3 albedo=mix(blue,vec3(.87,.92,.92),vMaterial);
 vec3 reflectColor=environment(reflect(-v,n));
 float fresnel=.13+.7*pow(1.-max(dot(n,v),0.),4.);
 float spec=pow(max(dot(n,normalize(l+v)),0.),uKind>1.5?64.:110.);
 vec3 color=albedo*(.36+.58*diffuse)+reflectColor*(.20+fresnel*.50)+vec3(1.,.98,.91)*spec*.62;
 color+=pow(1.-abs(dot(n,v)),3.)*vec3(.12,.2,.25);
 gl_FragColor=vec4(clamp(color,0.,1.),1.);
}`;
export function createSculptureRenderer(canvas:HTMLCanvasElement,kind:SculptureVariant){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:false});
  if(!gl)return null;
  const shader=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Sculpture shader compilation failed')};return s};
  const vs=shader(gl.VERTEX_SHADER,vertexSource),fs=shader(gl.FRAGMENT_SHADER,fragmentSource);
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Sculpture link failed');
  const data=geometry(kind),buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  gl.useProgram(program);
  for(const [name,size,offset]of [['aPosition',3,0],['aNormal',3,12],['aMaterial',1,24]] as const){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,28,offset)}
  const uniforms=Object.fromEntries(['uRotation','uAspect','uMorph','uIntro','uKind'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
  gl.uniform1f(uniforms.uKind,kind==='A'?0:kind==='B'?1:2);
  let disposed=false,cssWidth=1,cssHeight=1;
  const resize=(width:number,height:number)=>{cssWidth=Math.max(1,width);cssHeight=Math.max(1,height)};
  return {
    resize,
    draw(x:number,y:number,morph:number,intro:number){
      if(disposed||gl.isContextLost())return;
      const dpr=Math.min(devicePixelRatio||1,1.25,Math.sqrt(420000/(cssWidth*cssHeight)));
      const width=Math.max(1,Math.round(cssWidth*dpr)),height=Math.max(1,Math.round(cssHeight*dpr));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height)}
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform2f(uniforms.uRotation,x,y);gl.uniform1f(uniforms.uAspect,width/height);gl.uniform1f(uniforms.uMorph,morph);gl.uniform1f(uniforms.uIntro,intro);gl.drawArrays(gl.TRIANGLES,0,data.length/7);
    },
    dispose(){disposed=true;gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext()},
    triangles:data.length/21,
  };
}
