import { renderSvg as renderClassic } from './legacy.mjs';

const ink = '#172b37';
const secondary = '#3e5560';
const pale = '#f6f5ef';
const diagram = '#123841';
const accent = '#eeac66';
const mint = '#83d9bc';
const mono = 'Menlo,Consolas,monospace';
const glyphs = {
  gear:'<path d="M-46 34h92m-107-34h22m78 0h22"/><circle r="33"/><circle r="21"/><circle r="8"/>' + Array.from({length:12},(_,i)=>'<path transform="rotate('+i*30+')" d="M-5-33v-7h10v7"/>').join(''),
  arm:'<path d="M-59 35h53l-5-9h-43zm12-9 14-41 12 3-11 38m9-44 49-15 5 9-46 21m44-24 14 19-6 5-17-15m23 12 10 4-2 8m-8-9-3 8"/><circle cx="-24" cy="-13" r="8"/><circle cx="24" cy="-28" r="6"/>',
  cell:'<path d="M-68 35v-71h136v71zm6-65h94v58h-94zm100 0h24v58H38zM-53 22h25l-8-8 11-25 25 9 6 17m-1-10 13 5m-8 3h18v6H4zm38-37h15v8H42z"/><circle cx="-25" cy="-9" r="3"/>',
  weld:'<path d="m-66 22 54-36 14 9-52 37zm68-27 48 25 15-9-51-28zm-6-7 15-9m-71 47v8l13 7L3 7l47 24 15-9v-10"/><path stroke-dasharray="3 5" d="m-40 21 42-28"/>',
  input:'<path d="M-57-26h52v52h-52zm67 26h45m-14-12L55 0 41 12"/>',
  process:'<rect x="-40" y="-29" width="80" height="58" rx="7"/><path d="M-62 0h22m80 0h22m-76 0 10 10 22-23"/>',
  output:'<path d="M-52 0h38m-10-10 10 10-10 10m24-38h51v56H0zm10 21h31m-31 11h23"/>',
  stack:'<path d="m-46-16 46-21 46 21L0 6zm0 13L0 18 46-3m-92 13L0 31l46-21"/>'
};
function esc(s) {
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}
function string(v, field, max=300) {
  if (typeof v!=='string'||!v.trim()||Array.from(v).length>max) throw Error(field+' 无效或过长');
  return v.replace(/\s+/g,' ').trim();
}
function list(v, field, min, max) {
  if (!Array.isArray(v)||v.length<min||v.length>max) throw Error(field+' 数量应为 '+min+'–'+max);
  return v;
}
function refs(v, total) {
  if (!Array.isArray(v)||v.some(i=>!Number.isInteger(i)||i<1||i>total)) throw Error('依据编号与 sources 不匹配');
  return v;
}
function validate(input) {
  const s=input;
  if (!['mechanism','industry'].includes(s?.mode)) throw Error('请选择 mechanism 或 industry');
  const sources=list(s.sources,'sources',0,8).map(x=>{
    const label=string(x.label,'来源名称',65);
    if (!x.url) return {label,url:''};
    let u;
    try {u=new URL(x.url)} catch {throw Error('来源网址无效')}
    if (!['https:','http:'].includes(u.protocol)) throw Error('来源须为网页或带页码的资料名称');
    return {label,url:u.href};
  });
  const annotation=x=>({title:string(x.title,'分析标题',80),body:string(x.body,'分析正文',300),refs:refs(x.refs,sources.length)});
  const stages=list(s.stages,'图中对象',2,5).map(x=>{
    const v=x.visual;
    if (v?.type==='matrix') {
      const values=[v.rows,v.cols,v.lit];
      if (!values.every(Number.isInteger)||v.rows<1||v.rows>8||v.cols<1||v.cols>32||v.lit<0||v.lit>v.rows*v.cols) throw Error('阵列行列数或高亮数量无效');
    } else if (v?.type!=='symbol'||!Object.hasOwn(glyphs,v.symbol)) throw Error('图形类型无效');
    return {name:string(x.name,'对象名',40),caption:string(x.caption,'图注',65),detail:string(x.detail,'图中说明',110),visual:v};
  });
  return {mode:s.mode,title:string(s.title,'标题',85),scope:string(s.scope,'范围',120),lead:string(s.lead,'导语',240),figure:string(s.figure,'图题',100),relation:string(s.relation,'箭头含义',24),stages,notes:list(s.notes,'分析段落',2,4).map(annotation),insight:annotation(s.insight),boundary:string(s.boundary,'适用边界',240),sources,feedback:s.feedback?string(s.feedback,'末端回传给前一环的要求',140):''};
}
function text(x,y,s,size=22,fill=ink,weight=400,extra='') {
  return '<text x="'+x+'" y="'+y+'" fill="'+fill+'" font-size="'+size+'" font-weight="'+weight+'" '+extra+'>'+esc(s)+'</text>';
}
function lines(s,width,size) {
  const result=[];
  let row='', used=0;
  for(const c of Array.from(s)) {
    const cw=/[\x20-\x7e]/.test(c)?0.67*size:1.04*size;
    if(used+cw>width&&row&&!/[，。；、！？）〕》]/.test(c)){result.push(row.trim());row='';used=0}
    row+=c; used+=cw;
  }
  if(row)result.push(row.trim());
  return result;
}
function para(p,x,y,s,width,size,fill=ink,weight=400,step=Math.ceil(size*1.5)) {
  for(const line of lines(s,width,size)){p.push(text(x,y,line,size,fill,weight));y+=step}
  return y;
}
const rect=(x,y,w,h,c)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';
const path=(d,c,w=2,extra='')=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" '+extra+'/>';
function art(v,x,y,w) {
  if(v.type==='symbol')return '<g transform="translate('+x+' '+y+')" fill="none" stroke="'+mint+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">'+glyphs[v.symbol]+'</g>';
  const dx=Math.min(29,(w-12)/v.cols),dy=Math.min(22,76/v.rows);
  return Array.from({length:v.rows*v.cols},(_,i)=>rect(x-v.cols*dx/2+i%v.cols*dx,y-v.rows*dy/2+Math.floor(i/v.cols)*dy,dx*.78,dy*.70,i<v.lit?accent:'#63998f')).join('');
}
function hero(p,s,y) {
  const inner=[], gap=57, n=s.stages.length;
  const width=(1408-gap*(n-1))/n;
  const top=para(inner,96,y+56,s.figure,1350,29,'#ffffff',650);
  const leadY=top+12;
  let bottom=0;
  s.stages.forEach((v,i)=>{
    const x=96+i*(width+gap),mid=x+width/2;
    inner.push(art(v.visual,mid,leadY+58,width));
    let ty=para(inner,x,leadY+145,v.name,width,29,'#ffffff',700);
    ty=para(inner,x,ty+2,v.caption,width,23,mint,570);
    ty=para(inner,x,ty+4,v.detail,width,20,'#dae9e5',400);
    bottom=Math.max(bottom,ty);
    if(i<n-1){
      const ax=x+width+2;
      inner.push(path('M'+ax+' '+(leadY+60)+'h45m-10-8 10 8-10 8',accent));
    }
  });
  bottom=para(inner,96,bottom+17,'→  '+s.relation,1400,17,accent,550);
  if(s.feedback){
    const lastMid=96+(n-1)*(width+gap)+width/2;
    inner.push(path('M'+lastMid+' '+(bottom+4)+'v10h-'+(width+gap)+'m10-7-10 7 10 7',accent));
    bottom=para(inner,96,bottom+45,'←  '+s.feedback,1380,20,'#f1dbb8',500);
  }
  const end=bottom+14;
  p.push(rect(56,y,1488,end-y,diagram),...inner);
  return end;
}
function cite(v){return v.length?'  〔'+v.join('·')+'〕':''}
export function renderSvg(input) {
  if(input?.layout==='flow'||input?.layout==='grid')return renderClassic(input);
  const s=validate(input),p=[];
  const kind=s.mode==='mechanism'?'运行原理':'产业链条';
  p.push(rect(56,46,8,26,'#bc7042'),text(78,67,'拆开看',22,ink,700),text(170,66,'TAKE IT APART',15,secondary,500,'font-family="'+mono+'"'),text(1544,66,kind,20,ink,600,'text-anchor="end"'));
  p.push(path('M56 91H1544','#adbbb4',1));
  let y=para(p,56,174,s.title,1475,59,ink,750);
  y=para(p,60,y-12,s.lead,1470,25,secondary);
  y=para(p,60,y+4,'研究范围  /  '+s.scope,1460,18,'#336861',550);
  y=hero(p,s,y+15)+58;
  const w=(1488-48*(s.notes.length-1))/s.notes.length;
  let next=y;
  s.notes.forEach((v,i)=>{
    const x=56+i*(w+48);
    p.push(path('M'+x+' '+(y-24)+'h'+w,'#aebdb7',1.5));
    const n=para(p,x,y+12,v.title,w,26,ink,700);
    next=Math.max(next,para(p,x,n+8,v.body+cite(v.refs),w,22,secondary));
  });
  const iy=next+25;
  const takeaway=[];
  let a=para(takeaway,83,iy+44,s.insight.title,740,26,ink,700);
  a=para(takeaway,83,a+1,s.insight.body+cite(s.insight.refs),740,21,ink);
  takeaway.push(text(915,iy+44,'适用边界',22,ink,680));
  const b=para(takeaway,915,iy+86,s.boundary,580,21,secondary);
  y=Math.max(a,b)+10;
  p.push(rect(56,iy,1488,y-iy,'#e4ece5'),rect(56,iy,7,y-iy,'#428177'),...takeaway);
  y+=42;
  p.push(text(56,y,'资料索引',18,ink,700));
  for(let i=0;i<s.sources.length;i++){
    const src=s.sources[i],x=56+(i%2)*740;
    if(i%2===0)y+=35;
    const label=text(x,y,'['+(i+1)+']   '+src.label,18,'#275e63',500);
    p.push(src.url?'<a href="'+esc(src.url)+'" xlink:href="'+esc(src.url)+'">'+label+'</a>':label);
  }
  if(!s.sources.length)p.push(text(170,y,'概念示意，未附外部引文',17,secondary));
  const height=y+35,width=1600;
  const svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="'+height+'" viewBox="0 0 1600 '+height+'" role="img" aria-labelledby="t d"><title id="t">'+esc(s.title)+'</title><desc id="d">'+esc(s.lead)+'</desc>'+rect(0,0,width,height,pale)+'<g font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,Arial,sans-serif">'+p.join('')+'</g></svg>';
  return {svg,width,height,spec:s};
}
