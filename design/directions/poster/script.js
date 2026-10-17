(function(){
const $=s=>document.querySelector(s);
const b=$('.burger'),n=$('#nav');
b.onclick=()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)};
n.addEventListener('click',e=>{if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded',false)}});
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const today=new Date();
const days=[...Array(7)].map((_,i)=>{const d=new Date(today);d.setDate(d.getDate()+i+1);return d});
const hash=(a,b)=>((a*131+b*17+7)*2654435761>>>0)%100;
function mk(el,items,cls,fn,sel){el.innerHTML='';items.forEach((it,i)=>{const x=document.createElement('button');x.className=cls;x.type='button';fn(x,it,i);x.setAttribute('aria-pressed',i===sel);el.appendChild(x)})}
function single(el){el.addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;[...el.children].forEach(c=>c.setAttribute('aria-pressed',c===x))})}
/* booking */
const L=[['Taster','30 min',40,30],['Private lesson','60 min',105,60],['5 hour package','5 hours',495,60],['10 hour package','10 hours',950,60]];
const T=['Any teacher','Viktoriya Wilton','Byron Rowe','Roman Sukhomlyn','Olga Gandembul','Maksym Svyatobatko','Oleksandr Kutniakov','Anastasia Sheptitskaya','Oleksandr Yasynskyi'];
const st={l:0,t:0,d:0,s:null};
function slotsFor(d,len,seed){const wk=d.getDay()%6===0,end=wk?19.75:21.75,out=[];for(let m=600;m+len<=end*60;m+=len===30?30:60){out.push(m)}return out}
const fmt=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function render(){
 mk($('#lessons'),L,'opt',(x,l)=>{x.innerHTML=`<span>${l[0]}<small>${l[1]}</small></span><b>£${l[2]}</b>`},st.l);
 mk($('#teachers'),T,'chip',(x,t)=>x.textContent=t,st.t);
 mk($('#days'),days,'day',(x,d)=>x.innerHTML=`<small>${DN[d.getDay()]}</small><b>${d.getDate()}</b>`,st.d);
 const len=L[st.l][3],ss=slotsFor(days[st.d],len);
 mk($('#slots'),ss,'slot',(x,m)=>{x.textContent=fmt(m);x.dataset.m=m;if(hash(m+st.t*3,st.d+st.l)<30)x.disabled=true},-1);
 sum();
}
function sum(){
 $('#tot').textContent='£'+L[st.l][2];$('#s-l').textContent=L[st.l][0]+', '+L[st.l][1];$('#s-t').textContent=T[st.t];
 const d=days[st.d];$('#s-w').textContent=DN[d.getDay()]+' '+d.getDate()+'/'+(d.getMonth()+1)+(st.s!=null?' at '+fmt(st.s):'');
 $('#s-go').textContent=st.s!=null?'Confirm booking':'Choose a time';
}
$('#lessons').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;st.l=[...x.parentNode.children].indexOf(x);st.s=null;render()});
$('#teachers').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;st.t=[...x.parentNode.children].indexOf(x);st.s=null;render()});
$('#days').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;st.d=[...x.parentNode.children].indexOf(x);st.s=null;render()});
$('#slots').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;st.s=+x.dataset.m;[...x.parentNode.children].forEach(c=>c.setAttribute('aria-pressed',c===x));sum()});
render();
/* hire */
const H={r:0,d:0,s:new Set()};
const R=['Main room','Small room','Balcony'];
function hrender(){
 mk($('#hroom'),R,'chip',(x,r)=>x.textContent=r,H.r);
 mk($('#hdays'),days,'day',(x,d)=>x.innerHTML=`<small>${DN[d.getDay()]}</small><b>${d.getDate()}</b>`,H.d);
 const d=days[H.d],wk=d.getDay()%6===0,last=wk?18:20,ss=[];for(let h=10;h<=last;h++)ss.push(h*60);
 mk($('#hslots'),ss,'slot',(x,m)=>{x.textContent=fmt(m);x.dataset.m=m;if(hash(m+H.r*5,H.d*3+1)<35)x.disabled=true;else if(H.s.has(m))x.setAttribute('aria-pressed',true)},-1);
 [...$('#hslots').children].forEach(c=>c.setAttribute('aria-pressed',H.s.has(+c.dataset.m)));
 hsum();
}
function hsum(){const n=H.s.size;$('#hsum').textContent=n?`${n} slot${n>1?'s':''}, £${n*22}`:'Select a slot'}
$('#hroom').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;H.r=[...x.parentNode.children].indexOf(x);H.s.clear();hrender()});
$('#hdays').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;H.d=[...x.parentNode.children].indexOf(x);H.s.clear();hrender()});
$('#hslots').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const m=+x.dataset.m;H.s.has(m)?H.s.delete(m):H.s.add(m);x.setAttribute('aria-pressed',H.s.has(m));hsum()});
hrender();
})();
