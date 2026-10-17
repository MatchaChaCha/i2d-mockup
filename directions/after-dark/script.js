(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var hdr=$('#hdr'),bg=$('#burger'),mm=$('#mmenu');
  addEventListener('scroll',function(){hdr.classList.toggle('solid',scrollY>40)},{passive:true});
  function menu(o){bg.setAttribute('aria-expanded',o);mm.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''}
  bg.onclick=function(){menu(bg.getAttribute('aria-expanded')!=='true')};
  $$('a',mm).forEach(function(a){a.onclick=function(){menu(false)}});

  // exclusive single-select groups
  function group(root,cb){$$('button',root).forEach(function(b){b.onclick=function(){$$('button',root).forEach(function(x){x.setAttribute('aria-pressed',x===b)});cb&&cb(b)}})}
  var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var base=new Date();base.setHours(0,0,0,0);
  function dayList(el,cb,start){
    el.innerHTML='';var first=null;
    for(var i=0;i<7;i++){var d=new Date(base);d.setDate(d.getDate()+i+(start||0));
      var b=document.createElement('button');b.type='button';b.className='day';b.setAttribute('aria-pressed',i===0);
      b.innerHTML='<small>'+D[d.getDay()]+'</small><b>'+d.getDate()+'</b>';b.dataset.label=D[d.getDay()]+' '+d.getDate()+' '+M[d.getMonth()];b.dataset.dow=d.getDay();
      b.onclick=function(){$$('.day',el).forEach(function(x){x.setAttribute('aria-pressed',x===this)}.bind(this));cb(this)};el.appendChild(b)}
    return el.firstChild}
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
  function slots(el,day,seed,step,len,pick,minHour){
    el.innerHTML='';var wk=day.dataset.dow%6===0,end=wk?19.75:21.75;
    for(var m=600;m+len<=end*60;m+=step){
      var t=pad(m/60|0)+':'+pad(m%60),b=document.createElement('button');b.type='button';b.className='time';b.textContent=t;
      b.disabled=hash(seed+day.dataset.label+t)%100<34;b.setAttribute('aria-pressed','false');
      b.onclick=function(){$$('.time',el).forEach(function(x){x.setAttribute('aria-pressed',x===this)}.bind(this));pick(this.textContent)};el.appendChild(b)}}
  function pad(n){return (n<10?'0':'')+n}

  // booking
  var bk={type:'Taster, 30 min',price:40,t:'Viktoriya W.',day:null,time:null},len=30;
  var bd=$('#bdays'),bt=$('#btimes');
  function bsum(){$('#s-type').textContent=bk.type;$('#s-tch').textContent=bk.t;$('#s-total').textContent='£'+bk.price;
    $('#s-when').textContent=bk.time?bk.day.dataset.label+', '+bk.time:'Choose a time'}
  function bslots(){bk.time=null;slots(bt,bk.day,bk.t+bk.type,30,len,function(t){bk.time=t;bsum()});bsum()}
  bk.day=dayList(bd,function(d){bk.day=d;bslots()});
  group($('[data-group=type]'),function(b){bk.type=b.dataset.name;bk.price=+b.dataset.price;len=bk.price===40?30:60;bslots()});
  group($('[data-group=teacher]'),function(b){bk.t=b.textContent.trim();bslots()});
  bslots();

  // hire
  var h={room:'Main room',len:60,day:null,time:null},hd=$('#hdays'),ht=$('#htimes');
  function hsum(){$('#h-room').textContent=h.room+', '+h.len+' min';$('#h-when').textContent=h.time?h.day.dataset.label+', '+h.time:'Choose a slot'}
  function hslots(){h.time=null;slots(ht,h.day,h.room+h.len,h.len,h.len,function(t){h.time=t;hsum()});hsum()}
  h.day=dayList(hd,function(d){h.day=d;hslots()},1);
  group($('[data-group=room]'),function(b){h.room=b.dataset.name;hslots()});
  group($('#hlen'),function(b){h.len=+b.dataset.min;hslots()});
  hslots();
  $$('.tab').forEach(function(t){t.onclick=function(){$$('.tab').forEach(function(x){x.setAttribute('aria-selected',x===t)});
    var ex=t.dataset.m==='exclusive';$('#hshared').hidden=ex;$('#hexcl').hidden=!ex}});
})();
