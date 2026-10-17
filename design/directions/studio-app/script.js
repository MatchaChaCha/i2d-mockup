(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FULLD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const pad=n=>String(n).padStart(2,'0'), fmt=m=>pad(Math.floor(m/60))+':'+pad(m%60);
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const TEACHERS=[['Viktoriya Wilton','viktoriya-wilton'],['Byron Rowe','byron-rowe'],['Roman Sukhomlyn','roman-sukhomlyn'],['Olga Gandembul','olga-gandembul'],['Maksym Svyatobatko','maksym-svyatobatko'],['Oleksandr Kutniakov','oleksandr-kutniakov'],['Anastasia Sheptitskaya','anastasia-sheptitskaya'],['Oleksandr Yasynskyi','oleksandr-yasynskyi']];
const today=new Date();
const short=n=>n.startsWith('Oleksandr')?'Oleksandr '+n.split(' ')[1][0]+'.':n.split(' ')[0];
const radio=(group,sel)=>$$(sel,group).forEach(b=>b.addEventListener('click',()=>{$$(sel,group).forEach(x=>x.setAttribute('aria-checked',x===b));}));

/* mobile menu */
const mb=$('.menu-btn'), sheet=$('#sheet');
mb.addEventListener('click',()=>{const o=mb.getAttribute('aria-expanded')==='true';mb.setAttribute('aria-expanded',!o);sheet.hidden=o;});
$$('a',sheet).forEach(a=>a.addEventListener('click',()=>{mb.setAttribute('aria-expanded','false');sheet.hidden=true;}));

/* hero: today at I2D (sample data) */
$('#todayDate').textContent=FULLD[today.getDay()]+' '+today.getDate()+' '+MONTHS[today.getMonth()];
const weekend=[0,6].includes(today.getDay());
const tt=[[11*60,'Beginner Ballroom','Byron Rowe',6],[12*60+30,'Salsa','Maksym Svyatobatko',3],[18*60,'Latin Technique','Viktoriya Wilton',1],[19*60,'Social Practice','Open floor',0]].filter(r=>!weekend||r[0]<19*60);
const nowM=today.getHours()*60+today.getMinutes();
$('#timetable').innerHTML=tt.map(([m,n,t,s])=>`<li class="${m<nowM?'past':''}"><time>${fmt(m)}</time><span><b>${n}</b><small>${t}</small></span><span class="spots ${s===0?'full':s<=2?'low':''}">${s===0?'Full':s===1?'1 spot':s+' spots'}</span></li>`).join('');
const next=[]; for(let d=0;d<3&&next.length<5;d++){const dt=new Date(today);dt.setDate(dt.getDate()+d);[10,12,14,16,18].forEach(h=>{const m=h*60;if(d===0&&m<nowM+120)return;if(hash(dt.toDateString()+h)%3===0)return;if(next.length<5)next.push({dt,m});});}
const ns=$('#nextSlots');
ns.innerHTML=next.map((s,i)=>`<button class="chip" role="radio" aria-checked="${i===0}">${s.dt.toDateString()===today.toDateString()?'Today':DAYS[s.dt.getDay()]}<small>${fmt(s.m)}</small></button>`).join('');
radio(ns,'.chip');
$('#nextGo').addEventListener('click',()=>{const i=$$('.chip',ns).findIndex(c=>c.getAttribute('aria-checked')==='true');state.date=next[i].dt;state.time=next[i].m;renderDates();renderSlots();renderSummary();});

/* offers -> booking */
const state={lesson:$('.opt[aria-checked=true]').dataset,teacher:'Any teacher',date:null,time:null};
$$('[data-lesson]').forEach(a=>a.addEventListener('click',()=>{const o=$(`.opt[data-id=${a.dataset.lesson}]`);if(o)o.click();}));

/* booking widget */
const optL=$('#optLesson');
$$('.opt',optL).forEach(o=>o.addEventListener('click',()=>{$$('.opt',optL).forEach(x=>x.setAttribute('aria-checked',x===o));state.lesson=o.dataset;state.time=null;renderSlots();renderSummary();}));
const optT=$('#optTeacher');
optT.innerHTML=`<button class="tp" role="radio" aria-checked="true" data-n="Any teacher"><span class="any">*</span>Any teacher</button>`+TEACHERS.map(([n,s])=>`<button class="tp" role="radio" aria-checked="false" data-n="${n}"><img src="../../assets/img/team-${s}.webp" alt="">${short(n)}</button>`).join('');
$$('.tp',optT).forEach(b=>b.addEventListener('click',()=>{$$('.tp',optT).forEach(x=>x.setAttribute('aria-checked',x===b));state.teacher=b.dataset.n;state.time=null;renderSlots();renderSummary();}));
const datesEl=$('#dates'), slotsEl=$('#slots');
const off=(today.getHours()*60+today.getMinutes()>(([0,6].includes(today.getDay())?18:20)*60-60))?1:0;
const range=[];for(let i=0;i<14;i++){const d=new Date(today);d.setDate(d.getDate()+i+off);range.push(d)}
state.date=range[0];
function renderDates(){datesEl.innerHTML=range.map((d,i)=>`<button class="day" role="radio" aria-checked="${d.toDateString()===state.date.toDateString()}" data-i="${i}"><span>${DAYS[d.getDay()]}</span><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]}</span></button>`).join('');$$('.day',datesEl).forEach(b=>b.addEventListener('click',()=>{state.date=range[b.dataset.i];state.time=null;renderDates();renderSlots();renderSummary();}));}
function renderSlots(){
  const we=[0,6].includes(state.date.getDay()), close=we?19*60+45:21*60+45, len=+state.lesson.min, step=len===30?30:60, out=[];
  const isToday=state.date.toDateString()===today.toDateString();
  for(let m=10*60;m+len<=close;m+=step){
    const busy=hash(state.date.toDateString()+state.teacher+m)%100<(state.teacher==='Any teacher'?25:45);
    const past=isToday&&m<nowM+60;
    out.push(`<button class="slot" role="radio" data-m="${m}" aria-checked="${state.time===m}" ${busy||past?'disabled':''}>${fmt(m)}</button>`);
  }
  slotsEl.innerHTML=out.join('');
  $$('.slot',slotsEl).forEach(b=>b.addEventListener('click',()=>{state.time=+b.dataset.m;$$('.slot',slotsEl).forEach(x=>x.setAttribute('aria-checked',x===b));renderSummary();}));
}
function renderSummary(){
  $('#sLesson').textContent=state.lesson.name;$('#sTeacher').textContent=state.teacher;
  $('#sDate').textContent=DAYS[state.date.getDay()]+' '+state.date.getDate()+' '+MONTHS[state.date.getMonth()];
  $('#sTime').textContent=state.time==null?'Pick a time':fmt(state.time)+' to '+fmt(state.time+ +state.lesson.min);
  $('#sPrice').textContent='£'+state.lesson.price;
  const go=$('#sGo');go.disabled=state.time==null;go.textContent=state.time==null?'Pick a time':'Request this lesson';
  $('#nextPrice').textContent='£105';
}
renderDates();renderSlots();renderSummary();

/* studio hire */
const tabs=$$('.tabs [role=tab]');
tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);$('#'+x.getAttribute('aria-controls')).hidden=!on;});}));
let wk=0,hlen=60,hsel=null;
const week=$('#week');
$$('#lenSeg button').forEach(b=>b.addEventListener('click',()=>{$$('#lenSeg button').forEach(x=>x.setAttribute('aria-checked',x===b));hlen=+b.dataset.len;hsel=null;drawWeek();}));
$('#wkPrev').addEventListener('click',()=>{if(wk>0){wk--;hsel=null;drawWeek();}});
$('#wkNext').addEventListener('click',()=>{if(wk<3){wk++;hsel=null;drawWeek();}});
function drawWeek(){
  const mon=new Date(today);mon.setDate(mon.getDate()+wk*7);
  $('#wkLabel').textContent=(wk===0?'Next 7 days':'From '+mon.getDate()+' '+MONTHS[mon.getMonth()]);
  $('#wkPrev').disabled=wk===0;$('#wkNext').disabled=wk===3;
  const days=[...Array(7)].map((_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d});
  let h='<div></div>'+days.map(d=>`<div class="wh"><span>${DAYS[d.getDay()]}</span><b>${d.getDate()}</b></div>`).join('');
  const rows=[];for(let m=10*60;m<=20*60;m+=60)rows.push(m);
  rows.forEach(m=>{
    h+=`<div class="wt">${fmt(m)}</div>`;
    days.forEach(d=>{
      const we=[0,6].includes(d.getDay()), close=we?19*60+45:21*60+45;
      const slotStart=new Date(d);slotStart.setHours(Math.floor(m/60),m%60,0,0);
      const key=d.toDateString()+m;
      if(m+hlen>close) return h+='<button class="cell closed" disabled aria-label="Closed">-</button>';
      if(slotStart-today<12*3600e3) return h+='<button class="cell soon" disabled aria-label="Under 12 hours away">-</button>';
      const r=hash(key)%10; const c=r<3?'full':r<5?'few':'free';
      const sel=hsel===key;
      h+=`<button class="cell ${sel?'sel':c}" ${c==='full'?'disabled':''} data-k="${key}" data-l="${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${fmt(m)} to ${fmt(m+hlen)}" aria-label="${c==='full'?'Booked':'Available'}">${sel?'Picked':c==='full'?'Booked':c==='few'?'1 left':'Free'}</button>`;
    });
  });
  week.innerHTML=h;
  $$('.cell[data-k]',week).forEach(b=>b.addEventListener('click',()=>{hsel=b.dataset.k;hlabel=b.dataset.l;drawWeek();}));
  const price=hlen===60?'£22':'Price on request';
  $('#hSel').textContent=hsel?hlabel:'Pick a free slot';
  $('#hSub').textContent=hsel?(hlen===60?'Shared floor, £22':'Shared floor, 45 min slot (rate confirmed on request)'):'£22 per 60 min';
  $('#hGo').disabled=!hsel;
}
let hlabel='';
drawWeek();

/* team rail */
const rail=$('#teamRail');
$('#tPrev').addEventListener('click',()=>rail.scrollBy({left:-540,behavior:'smooth'}));
$('#tNext').addEventListener('click',()=>rail.scrollBy({left:540,behavior:'smooth'}));
})();
