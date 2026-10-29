// Paste into Extensions > Apps Script of the Google Sheet. Run setup() once, then Deploy > Web app (Execute as: Me, Access: Anyone).
const CFG={SHEET:'Form Responses 3',
 NOTIFY:['nicholas@gamewatchers.co.ke','john@gamewatchers.co.ke']};
const N=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const esc=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function doGet(){return out({ok:true,msg:'Gamewatchers log API'})}
function setup(){const ss=SpreadsheetApp.getActive();
 if(!ss.getSheetByName('Guides'))ss.insertSheet('Guides').getRange(1,1,2,2).setValues([['Gmail (allowed to submit)','Name'],['','']]);
 MailApp.getRemainingDailyQuota()} // forces mail permission prompt
function doPost(e){const lock=LockService.getScriptLock();let locked=false;
 try{const b=JSON.parse(e.postData.contents);
  if(b.action=='sendcode'){sendCode(String(b.email).trim().toLowerCase());return out({ok:true})}
  if(b.action=='verify')return out(checkCode(String(b.email).trim().toLowerCase(),String(b.code).trim()));
  const email=verify(b.token);lock.waitLock(30000);locked=true;
  const r=save(b.trip,email);lock.releaseLock();locked=false;
  try{mail(b.trip,email)}catch(x){console.error(x)}
  return out({ok:true,rows:r})}
 catch(err){return out({ok:false,error:String(err.message||err)})}
 finally{if(locked)lock.releaseLock()}}
// ---- one-time-code sign-in ----
const SECRET=()=>{const p=PropertiesService.getScriptProperties();let s=p.getProperty('SECRET');if(!s){s=Utilities.getUuid()+Utilities.getUuid();p.setProperty('SECRET',s)}return s};
const sign=x=>Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(x,SECRET()));
const hash=x=>Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,x+SECRET()));
function allowed(email){const g=SpreadsheetApp.getActive().getSheetByName('Guides');let name='';
 if(g&&g.getLastRow()>1){const rows=g.getRange(2,1,g.getLastRow()-1,2).getValues().filter(r=>String(r[0]).trim());
  if(rows.length){const m=rows.find(r=>String(r[0]).trim().toLowerCase()==email);if(!m)throw new Error('auth: '+email+' is not on the Guides list');name=m[1]}}
 return name}
function sendCode(email){if(!/^\S+@\S+\.\S+$/.test(email))throw new Error('Enter a valid email address.');allowed(email);
 const c=CacheService.getScriptCache(),rk='r'+hash(email),n=+c.get(rk)||0;
 if(n>=5)throw new Error('Too many codes requested. Try again in an hour.');c.put(rk,n+1,3600);
 const code=String(parseInt(Utilities.getUuid().replace(/-/g,'').slice(0,8),16)%900000+100000);
 c.put('c'+hash(email),hash(code+email),600);c.remove('a'+hash(email));
 MailApp.sendEmail({to:email,subject:'Gamewatchers Field Log code: '+code,htmlBody:'<p>Your sign-in code is</p><h2 style="letter-spacing:4px">'+code+'</h2><p>It is valid for 10 minutes. If you did not ask for it, ignore this email.</p>'})}
function checkCode(email,code){const c=CacheService.getScriptCache(),k=hash(email),a=+c.get('a'+k)||0;
 if(a>=5)throw new Error('Too many wrong attempts. Request a new code.');
 const h=c.get('c'+k);if(!h)throw new Error('Code expired. Request a new one.');
 if(h!=hash(code+email)){c.put('a'+k,a+1,600);throw new Error('Wrong code.')}
 c.remove('c'+k);const x=Date.now()+30*864e5,p=Utilities.base64EncodeWebSafe(JSON.stringify({e:email,x}));
 return{ok:true,token:p+'.'+sign(p),exp:x,name:allowed(email)}}
function verify(t){const s=String(t).split('.');if(s.length!=2||sign(s[0])!=s[1])throw new Error('auth: please sign in again');
 const o=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(s[0])).getDataAsString());
 if(o.x<Date.now())throw new Error('auth: session expired, sign in again');allowed(o.e);return o.e}
function save(t,email){const sh=SpreadsheetApp.getActive().getSheetByName(CFG.SHEET);
 const hd=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
 ['Trip ID','Day No.','Total Days','Submitted By'].forEach(h=>{if(hd.map(N).indexOf(N(h))<0){sh.getRange(1,hd.length+1).setValue(h);hd.push(h)}});
 const ix={};hd.forEach((h,i)=>ix[N(h)]=i);
 const last=sh.getLastRow(),data=last>1?sh.getRange(2,1,last-1,hd.length).getValues():[],rowOf={};
 data.forEach((r,i)=>{if(r[ix.tripid])rowOf[r[ix.tripid]+'|'+r[ix.dayno]]=i+2});
 t.days.slice(0,t.n).forEach((d,i)=>{
  const o={timestamp:new Date(),tripid:t.id,dayno:i+1,totaldays:t.n,submittedby:email};
  for(const k in t.trip)o[N(k)]=t.trip[k];for(const k in d)o[N(k)]=d[k];
  if(o.date){const p=String(o.date).split('-');o.date=new Date(p[0],p[1]-1,p[2])}
  const key=t.id+'|'+(i+1),n=rowOf[key]||sh.getLastRow()+1;
  const cur=rowOf[key]?sh.getRange(n,1,1,hd.length).getValues()[0]:hd.map(()=>'');
  sh.getRange(n,1,1,hd.length).setValues([hd.map((h,j)=>o[N(h)]!==undefined?o[N(h)]:cur[j])]);rowOf[key]=n});
 return t.n}
function mail(t,email){const f=(d,n)=>{for(const k in d)if(N(k).indexOf(n)==0)return d[k]||'';return ''};
 const name=Object.values(t.trip)[0]||email;let concern=0;
 const rows=t.days.slice(0,t.n).map((d,i)=>{const c=f(d,'conservation'),b=['lion','leopard','elephant','buffalo','rhino'].filter(x=>f(d,x)).length;
  if(c&&!/^(n\/?a|none|no)\b/i.test(c.trim()))concern++;
  return `<tr><td>${i+1}</td><td>${d.date||''}</td><td>${esc(f(d,'area'))}</td><td>${b}/5</td><td>${esc(c)}</td></tr>`}).join('');
 const html=`<h3>Safari log submitted: ${esc(name)}</h3><p><b>Sent by:</b> ${email}<br><b>Days:</b> ${t.n} (from ${t.start})<br>`+
  Object.keys(t.trip).map(k=>`<b>${esc(k.trim())}:</b> ${esc(t.trip[k])}`).join('<br>')+
  `</p><table border="1" cellpadding="5" style="border-collapse:collapse"><tr><th>Day</th><th>Date</th><th>Area</th><th>Big Five</th><th>Conservation concern</th></tr>${rows}</table><p><a href="${SpreadsheetApp.getActive().getUrl()}">Open the sightings workbook</a></p>`;
 MailApp.sendEmail({to:CFG.NOTIFY.join(','),subject:`[Gamewatchers] ${name}: ${t.n}-day safari log`+(concern?' ⚠ conservation concern':''),htmlBody:html})}
