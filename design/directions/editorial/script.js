(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
// Menu
const burger=$('.burger'), menu=$('#menu');
burger.addEventListener('click',()=>{const o=burger.getAttribute('aria-expanded')==='true';burger.setAttribute('aria-expanded',!o);menu.hidden=o;document.body.style.overflow=o?'':'hidden'});
$$('a',menu).forEach(a=>a.addEventListener('click',()=>{burger.setAttribute('aria-expanded','false');menu.hidden=true;document.body.style.overflow=''}));

// Data
const TYPES=[
 {id:'taster',name:'Taster',price:40,min:30,sub:'30 min'},
 {id:'single',name:'Private lesson',price:105,min:60,sub:'60 min'},
 {id:'five',name:'5 hour package',price:495,min:60,sub:'5 × 60 min'},
 {id:'ten',name:'10 hour package',price:950,min:60,sub:'10 × 60 min'}];
const TEACHERS=[['viktoriya-wilton','Viktoriya Wilton'],['byron-rowe','Byron Rowe'],['roman-sukhomlyn','Roman Sukhomlyn'],['olga-gandembul','Olga Gandembul'],['maksym-svyatobatko','Maksym Svyatobatko'],['oleksandr-kutniakov','Oleksandr Kutniakov'],['anastasia-sheptitskaya','Anastasia Sheptitskaya'],['oleksandr-yasynskyi','Oleksandr Yasynskyi']];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const state={type:'taster',teacher:'Any teacher',date:0,time:null};
const dates=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()+i+1);return d});
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const pad=n=>String(n).padStart(2,'0');
const fmt=m=>pad(Math.floor(m/60))+':'+pad(m%60);
const closeMin=d=>[0,6].includes(d.getDay())?19*60+45:21*60+45;

function mkOpt(parent,html,checked,cls,onclick){const b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',checked);b.className=cls;b.innerHTML=html;b.addEventListener('click',()=>{onclick();});parent.appendChild(b);return b}
function setChecked(parent,btn){$$('[role=radio],[aria-pressed]',parent).forEach(x=>x.setAttribute('aria-checked',x===btn))}

// Booking
const gType=$('[data-group=type]'), gTeacher=$('[data-group=teacher]'), gDate=$('[data-group=date]'), gTime=$('[data-group=time]');
TYPES.forEach(t=>{const b=mkOpt(gType,`<b>${'£'+t.price}</b><span>${t.name}, ${t.sub}</span>`,t.id===state.type,'opt',()=>{state.type=t.id;state.time=null;setChecked(gType,b);renderTimes();sum()});b.dataset.id=t.id});
[['','Any teacher'],...TEACHERS].forEach(([slug,name],i)=>{const img=slug?`<img src="../../assets/img/team-${slug}.webp" alt="" width="46" height="46">`:'<div class="any">?</div>';const b=mkOpt(gTeacher,`${img}<span>${name}</span>`,i===0,'opt opt-t',()=>{state.teacher=name;state.time=null;setChecked(gTeacher,b);renderTimes();sum()})});
function dateBtn(parent,onsel,sel){dates.forEach((d,i)=>{const b=mkOpt(parent,`<small>${DAYS[d.getDay()]}</small><b>${d.getDate()}</b><small>${MONTHS[d.getMonth()]}</small>`,i===sel,'date',()=>{setChecked(parent,b);onsel(i)})})}
dateBtn(gDate,i=>{state.date=i;state.time=null;renderTimes();sum()},0);
function renderTimes(){
  gTime.innerHTML='';const t=TYPES.find(x=>x.id===state.type), d=dates[state.date];
  for(let m=10*60;m+t.min<=closeMin(d);m+=60){
    const taken=hash(state.teacher+d.toDateString()+m)%100<(state.teacher==='Any teacher'?18:38);
    const b=document.createElement('button');b.type='button';b.className='slot';b.textContent=fmt(m);b.disabled=taken;b.setAttribute('role','radio');b.setAttribute('aria-checked',state.time===m);
    b.addEventListener('click',()=>{state.time=m;setChecked(gTime,b);sum()});gTime.appendChild(b);
  }}
function sum(){
  const t=TYPES.find(x=>x.id===state.type), d=dates[state.date];
  $$('[data-s=type]').forEach(e=>e.textContent=t.name);
  $('[data-s=teacher]').textContent=state.teacher;
  $('[data-s=date]').textContent=`${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  $('[data-s=time]').textContent=state.time==null?'Choose a time':fmt(state.time);
  $('[data-s=dur]').textContent=t.sub;$('[data-s=price]').textContent='£'+t.price;
}
$('#confirm').addEventListener('click',()=>{$('#confirm-msg').textContent=state.time==null?'Choose a time first.':'Reserved (sample only). We would confirm by email.'});
$$('[data-pick]').forEach(a=>a.addEventListener('click',()=>{state.type=a.dataset.pick;setChecked(gType,$(`[data-id=${state.type}]`,gType));state.time=null;renderTimes();sum()}));
renderTimes();sum();

// Rooms
const ROOMS={
 main:['Main room','The ballroom itself, under the painted ceiling.','9 × 15 m','Chandeliers, painted ceiling'],
 small:['Small room','A quieter square room for practice and small groups.','10 × 10 m','Square floor'],
 balcony:['Balcony','Overlooks the main floor. Somewhere to sit, watch and rest.','3 areas','Seating overlooking the floor']};
function room(k){
  $$('.room').forEach(r=>r.classList.toggle('on',r.dataset.room===k));
  $$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.room===k));
  const r=ROOMS[k];$('#room-title').textContent=r[0];$('#room-desc').textContent=r[1];$('#room-size').textContent=r[2];$('#room-feat').textContent=r[3];
}
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>room(b.dataset.room)));
$$('.room').forEach(r=>r.addEventListener('click',()=>room(r.dataset.room)));
room('main');

// Hire
const hs={date:0,len:60,sel:new Set()};
const gH=$('[data-group=hdate]'), gS=$('[data-group=hslot]');
dateBtn(gH,i=>{hs.date=i;hs.sel.clear();hslots();hsum()},0);
function hslots(){
  gS.innerHTML='';const d=dates[hs.date];
  for(let m=10*60;m+hs.len<=closeMin(d);m+=hs.len){
    const taken=hash('h'+hs.len+d.toDateString()+m)%100<32;
    const b=document.createElement('button');b.type='button';b.className='slot';b.textContent=fmt(m);b.disabled=taken;b.setAttribute('aria-pressed',hs.sel.has(m));b.setAttribute('aria-checked',hs.sel.has(m));
    b.addEventListener('click',()=>{hs.sel.has(m)?hs.sel.delete(m):hs.sel.add(m);b.setAttribute('aria-checked',hs.sel.has(m));b.setAttribute('aria-pressed',hs.sel.has(m));hsum()});gS.appendChild(b);
  }}
function hsum(){const n=hs.sel.size;$('#hb-count').textContent=n+(n===1?' slot':' slots');$('#hb-price').textContent='£'+n*22}
$$('.seg button').forEach(b=>b.addEventListener('click',()=>{hs.len=+b.dataset.len;hs.sel.clear();$$('.seg button').forEach(x=>x.setAttribute('aria-checked',x===b));hslots();hsum()}));
$('#hb-go').addEventListener('click',()=>{if(!hs.sel.size)$('#hb-count').textContent='Pick a slot'});
hslots();hsum();
})();
