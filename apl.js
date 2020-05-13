//usr/bin/env node "$0" $@;exit $?
'use strict'
// ⊒\ ⚇⌾
const prelude=`
⍬←() ⋄ •d←'0123456789' ⋄ •a←'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
_atop←{⍶⍹⍵;⍶⍺⍹⍵}
¬←(1+-)⍁1
⊏←⊣´⍠⊏
↓←{s←(≠⍺)(⊣↑⊢∾1⥊˜×⟜(0=≠))≢⍵ ⋄ ((s×¯1⋆⍺>0)+(-s)⌈s⌊⍺)↑⍵}
↑←((↕1+≠)↑¨<)⍠↑
↓←((↕1+≠)↓¨<)⍠↓
∊←⊐˜≠≠∘⊢
∧←⍋⊸⊏⍠∧⍁1
∨←⍒⊸⊏⍠∨⍁0
∪←0⊸↑(⊣∾¬∘∊˜/≍∘⊢)˜´⌽
`

,A=(a,s=[a.length])=>{
  if(a.length&&a instanceof Array){
    let t=1;for(let i=0;i<a.length;i++)if(typeof a[i]!=='number'){t=0;break}
    if(t)a=new Float64Array(a)
  }
  if(!(s instanceof Array)){let s0=s;s=Array(s0.length);for(let i=0;i<s0.length;i++)s[i]=s0[i]}
  return{isA:1,a,s}
}
,toA=x=>x.isA?x:A.scal(x)
,getVec=x=>x.isA?(x.s.length<=1||rnkErr(),x.a):[x]
,has=x=>x!==undefined
,toF=f=>typeof f==='function'?f:(y,x)=>f
,strides=s=>{let r=Array(s.length),u=1;for(let i=r.length-1;i>=0;i--){asrt(isInt(s[i],0));r[i]=u;u*=s[i]};return r}
,toInt=(x,m,M)=>{let r=unw(x);if(r!==r|0||m!=null&&r<m||M!=null&&M<=r)domErr();return r}
,str=x=>{x.s.length>1&&rnkErr();for(let i=0;i<x.a.length;i++)typeof x.a[i]!=='string'&&domErr();return x.a.join('')}
,unw=x=>{if(!x.isA)return x;x.a.length===1||lenErr();return x.a[0]} // unwrap
,getProt=x=>!x.a.length||typeof x.a[0]!=='string'?0:' ' // todo
,asrt=x=>{if(typeof x==='function'){if(!x())throw Error('assertion failed: '+x)}
          else                     {if(!x)  throw Error('assertion failed'    )}}
,isInt=(x,m,M)=>x===~~x&&(m==null||m<=x&&(M==null||x<M))
,prd=x=>{let r=1;for(let i=0;i<x.length;i++)r*=x[i];return r}
,extend=(x,y)=>{for(let k in y)x[k]=y[k];return x}
,fmtNum=x=>(''+x).replace('Infinity','∞').replace(/-/g,'¯')
,rpt=(x,n)=>{
  let m=n*x.length;if(!m)return x.slice(0,0)
  if(x.set){let r=new(x.constructor)(x.length);r.set(x);while(n<m){r.copyWithin(n,0,n);n*=2};return r}
  else{while(x.length*2<m)x=x.concat(x);return x.concat(x.slice(0,m-x.length))}
}
,err=(s,o)=>{
  let m
  if(o&&o.aplCode&&o.offset!=null){
    let a=o.aplCode.slice(0,o.offset).split('\n')
    let l=a.length,c=1+(a[a.length-1]||'').length // line and column
    m='\n'+(o.file||'-')+':'+l+':'+c+o.aplCode.split('\n')[l-1]+'_'.repeat(c-1)+'^'
  }
  let e=Error(m);e.name=s;for(let k in o)e[k]=o[k];throw e
}
,synErr=o=>err('SYNTAX ERROR',o)
,domErr=o=>err('DOMAIN ERROR',o)
,lenErr=o=>err('LENGTH ERROR',o)
,rnkErr=o=>err(  'RANK ERROR',o)
,idxErr=o=>err( 'INDEX ERROR',o)
,nyiErr=o=>err( 'NONCE ERROR',o)
,valErr=o=>err( 'VALUE ERROR',o)

A.zld=A(new Float64Array(),[0])
A.scal=x=>A([x],[])

const Zify=x=>typeof x==='number'?new Z(x,0):x instanceof Z?x:domErr() // complexify
const smplfy=(re,im)=>im===0?re:new Z(re,im)
function Z(re,im){asrt(typeof re==='number');asrt(typeof im==='number'||im==null)
  if(re!==re||im!==im)domErr(); this.re=re;this.im=im||0}
Z.prototype.toString=function(){return fmtNum(this.re)+'J'+fmtNum(this.im)}
Z.prototype.repr=function(){return'new Z('+repr(this.re)+','+repr(this.im)+')'}
Z.exp=x=>{x=Zify(x);let r=Math.exp(x.re);return smplfy(r*Math.cos(x.im),r*Math.sin(x.im))}
Z.log=x=>{if(typeof x==='number'&&x>0){return Math.log(x)}
          else{x=Zify(x);return smplfy(Math.log(Math.sqrt(x.re*x.re+x.im*x.im)),Z.dir(x))}}
Z.cjg=x=>new Z(x.re,-x.im)
Z.neg=x=>new Z(-x.re,-x.im)
Z.add=(x,y)=>{x=Zify(x);y=Zify(y);return smplfy(x.re+y.re,x.im+y.im)}
Z.sub=(x,y)=>{x=Zify(x);y=Zify(y);return smplfy(x.re-y.re,x.im-y.im)}
Z.mul=(x,y)=>{x=Zify(x);y=Zify(y);return smplfy(x.re*y.re-x.im*y.im,x.re*y.im+x.im*y.re)}
Z.div=(x,y)=>{x=Zify(x);y=Zify(y);const d=y.re*y.re+y.im*y.im
              return smplfy((x.re*y.re+x.im*y.im)/d,(y.re*x.im-y.im*x.re)/d)}
Z.rcp=x=>{let d=x.re*x.re+x.im*x.im;return smplfy(x.re/d,-x.im/d)}
Z.it =x=>{x=Zify(x);return smplfy(-x.im,x.re)} // i times
Z.nit=x=>{x=Zify(x);return smplfy(x.im,-x.re)} // -i times
Z.pow=(x,y)=>{
  if(typeof x==='number'&&typeof y==='number'&&(x>=0||isInt(y)))return Math.pow(x,y)
  if(typeof y==='number'&&isInt(y,0)){let r=1;while(y){(y&1)&&(r=Z.mul(r,x));x=Z.mul(x,x);y>>=1};return r}
  if(typeof x==='number'&&y===.5)return x<0?new Z(0,Math.sqrt(-x)):Math.sqrt(x)
  return Z.exp(Z.mul(y,Z.log(x)))
}
Z.sqrt=x=>Z.pow(x,.5)
Z.mag=x=>Math.sqrt(x.re*x.re+x.im*x.im)
Z.dir=x=>Math.atan2(x.im,x.re)
Z.sin=x=>Z.nit(Z.sh(Z.it(x)))
Z.cos=x=>Z.ch(Z.it(x))
Z.tg =x=>Z.nit(Z.th(Z.it(x)))
Z.asin=x=>{x=Zify(x);return Z.nit(Z.log(Z.add(Z.it(x),Z.sqrt(Z.sub(1,Z.pow(x,2))))))}
Z.acos=x=>{x=Zify(x);const r=Z.nit(Z.log(Z.add(x,Z.sqrt(Z.sub(Z.pow(x,2),1)))))
           return r instanceof Z&&(r.re<0||(r.re===0&&r.im<0))?Z.neg(r):r} // dubious?
Z.atg=x=>{x=Zify(x);const ix=Z.it(x);return Z.mul(new Z(0,.5),Z.sub(Z.log(Z.sub(1,ix)),Z.log(Z.add(1,ix))))}
Z.sh=x=>{let a=Z.exp(x);return Z.mul(.5,Z.sub(a,Z.div(1,a)))}
Z.ch=x=>{let a=Z.exp(x);return Z.mul(.5,Z.add(a,Z.div(1,a)))}
Z.th=x=>{let a=Z.exp(x),b=Z.div(1,a);return Z.div(Z.sub(a,b),Z.add(a,b))}
Z.ash=x=>Z.it(Z.asin(Z.nit(x)))
Z.ach=x=>{x=Zify(x);let sign=x.im>0||(!x.im&&x.re<=1)?1:-1;return Z.mul(new Z(0,sign),Z.acos(x))}
Z.ath=x=>Z.it(Z.atg(Z.nit(x)))
Z.floor=x=>{
  if(typeof x==='number')return Math.floor(x)
  x=Zify(x)
  let re=Math.floor(x.re),im=Math.floor(x.im),r=x.re-re,i=x.im-im
  if(r+i>=1)r>=i?re++:im++
  return smplfy(re,im)
}
Z.ceil=x=>{
  if(typeof x==='number')return Math.ceil(x)
  x=Zify(x);let re=Math.ceil(x.re),im=Math.ceil(x.im),r=re-x.re,i=im-x.im
  if(r+i>=1)r>=i?re--:im--
  return smplfy(re,im)
}
const iszero=x=>!x||(x instanceof Z&&!x.re&&!x.im)
Z.mod=(x,y)=>typeof x==='number'&&typeof y==='number'?(x?y-x*Math.floor(y/x):y)
                 :iszero(x)?y:Z.sub(y,Z.mul(x,Z.floor(Z.div(y,x))))
Z.isint=x=>typeof x==='number'?x===Math.floor(x):x.re===Math.floor(x.re)&&x.im===Math.floor(x.im)
Z.gcd=(x,y)=>{
  if(typeof x==='number'&&typeof y==='number'){while(y){let z=y;y=x%y;x=z}return Math.abs(x)}
  while(!iszero(y)){let z=y;y=Z.mod(y,x);x=z}
  if(typeof x==='number'){return Math.abs(x)} // rotate into first quadrant
  else{x.re<0&&(x=Z.neg(x));x.im<0&&(x=Z.it(x));return x.re?x:x.im}
}
Z.lcm=(x,y)=>{let p=Z.mul(x,y);return iszero(p)?p:Z.div(p,Z.gcd(x,y))}

const LDC=1,VEC=2,GET=3,SET=4,MON=5,DYA=6,LAM=7,RET=8,POP=9,SPL=10,JEQ=11,EMB=12,CON=13
,Proc=function(b,p,size,h){this.b=b;this.p=p;this.size=size;this.h=h;this.toString=_=>'#procedure'}
,toFn=f=>(x,y)=>vm(f.b,f.h.concat([[x,f,y,null]]),f.p)
,vm=(b,h,p=0,t=[])=>{while(1)switch(b[p++]){default:asrt(0) // b:bytecode,h:environment,p:program counter,t:stack
  case LDC:t.push(b[p++]);break
  case VEC:{t.push(A(t.splice(t.length-b[p++])));break}
  case GET:{let r=h[b[p++]][b[p++]];r!=null||valErr();t.push(r);break}
  case SET:{h[b[p++]][b[p++]]=t[t.length-1];break}
  case MON:{let[x,f]=t.splice(-2)
            if(typeof f==='function'){if(x instanceof Proc)x=toFn(x)
                                      if(f.cps){f(x,undefined,undefined,r=>{t.push(r);vm(b,h,p,t)});return}
                                      t.push(f(x))}
            else{let bp=t.length;t.push(b,p,h);b=f.b;p=f.p;h=f.h.concat([[x,f,null,bp]])}
            break}
  case DYA:{let[y,f,x]=t.splice(-3)
            if(typeof f==='function'){if(y instanceof Proc)y=toFn(y)
                                      if(x instanceof Proc)x=toFn(x)
                                      if(f.cps){f(y,x,undefined,r=>{t.push(r);vm(b,h,p,t)});return}
                                      t.push(f(y,x))}
            else{let bp=t.length;t.push(b,p,h);b=f.b;p=f.p;h=f.h.concat([[y,f,x,bp]])}
            break}
  case LAM:{let size=b[p++];t.push(new Proc(b,p,size,h));p+=size;break}
  case RET:{if(t.length===1)return t[0];[b,p,h]=t.splice(-4,3);break}
  case POP:{t.pop();break}
  case SPL:{let n=b[p++],a=t[t.length-1].a.slice().reverse(),a1=Array(a.length)
            for(let i=0;i<a.length;i++)a1[i]=a[i]
            if(a1.length===1){a1=rpt(a1,n)}else if(a1.length!==n){lenErr()}
            t.push.apply(t,a1);break}
  case JEQ:{const n=b[p++];toInt(t[t.length-1],0,2)||(p+=n);break}
  case EMB:{let frm=h[h.length-1];t.push(b[p++](frm[0],frm[2]));break}
  case CON:{let frm=h[h.length-1],cont={b,h:h.map(x=>x.slice()),t:t.slice(0,frm[3]),p:frm[1].p+frm[1].size-1}
            asrt(b[cont.p]===RET);t.push(r=>{b=cont.b;h=cont.h;t=cont.t;p=cont.p;t.push(r)});break}
}}
const ltr='_A-Za-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶ-ͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮ-ٯٱ-ۓەۥ-ۦۮ-ۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴ-ߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএ-ঐও-নপ-রলশ-হঽৎড়-ঢ়য়-ৡৰ-ৱਅ-ਊਏ-ਐਓ-ਨਪ-ਰਲ-ਲ਼ਵ-ਸ਼ਸ-ਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલ-ળવ-હઽૐૠ-ૡଅ-ଌଏ-ଐଓ-ନପ-ରଲ-ଳଵ-ହଽଡ଼-ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘ-ౙౠ-ౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠ-ೡೱ-ೲഅ-ഌഎ-ഐഒ-ഺഽൎൠ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะา-ำเ-ๆກ-ຂຄງ-ຈຊຍດ-ທນ-ຟມ-ຣລວສ-ຫອ-ະາ-ຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥ-ၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮ-ᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵ-ᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〆〱-〵〻-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪ-ꘫꙀ-ꙮꙿ-ꚗꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵ-ꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ'
,td=[['-',/^ +|^[⍝#].*/],           // whitespace or comment
     ['N',/^¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞))?/i], // number
     ['S',/^(?:'[^']*')+/],         // string
     ['.',/^[\(\)\[\]\{\}:;←⋄\n]/], // punctuation
     ['J',/^«[^»]*»/],              // JS literal
     ['X',RegExp('^(?:•?['+ltr+']['+ltr+'0-9]*|⍺⍺|⍵⍵|∇∇|[^¯\'":«»])','i')]] // identifier
,prs=(s,o)=>{
  // tokens are {t:type,v:value,o:offset,s:aplCode}
  // "stk" tracks bracket nesting and causes '\n' tokens to be dropped when the latest unclosed bracket is '(' or '['
  let i=0,a=[],stk=['{'],l=s.length // i:offset in s, a:tokens
  while(i<l){
    let m,t,v,r=s.slice(i) // m:match object, t:type, v:value, r:remaining source code
    for(let j=0;j<td.length;j++)if(m=r.match(td[j][1])){v=m[0];t=td[j][0];t==='.'&&(t=v);break}
    t||synErr({file:o?o.file:null,o:i,s:s})
    '([{'.includes(t)?stk.push(t):')]}'.includes(t)?stk.pop():0
    if(t!=='-'&&(t!=='\n'||stk[stk.length-1]==='{'))a.push({t:t,v:v[0]==='•'?v.toUpperCase():v,o:i,s:s})
    i+=v.length
  }
  a.push({t:'$',v:'',o:i,s})
  // AST node types: 'B' a⋄b  ':' a:b  'N' 1  'S' 'a'  'X' a  'J' «a»  '⍬' ()  '{' {}  '[' a[b]  '←' a←b  '.' a b
  // '.' gets replaced with: 'V' 1 2  'M' +1  'D' 1+2  'A' +/  'C' +.×  'T' +÷
  i=0 // offset in a
  const dmnd=x=>a[i].t===x?i++:prsErr()
  ,prsErr=x=>synErr({file:o.file,offset:a[i].o,aplCode:s})
  ,body=_=>{
    let r=['B']
    while(1){
      while('⋄\n'.includes(a[i].t))i++
      if('$};'.includes(a[i].t))return r
      let e=expr();if(a[i].t===':'){i++;e=[':',e,expr()]}
      r.push(e)
    }
  }
  ,expr=_=>{
    let r=['.'],x
    while(1){
      if('NSXJ'.includes(a[i].t)){x=[a[i].t,a[i].v];i++}
      else if(a[i].t==='('){i++;if(a[i].t===')'){i++;x=['⍬']}else{x=expr();dmnd(')')}}
      else if(a[i].t==='{'){i++;x=['{',body()];while(a[i].t===';'){i++;x.push(body())}dmnd('}')}
      else{prsErr()}
      if(a[i].t==='['){
        i++;x=['[',x]
        while(1){if(a[i].t===';'){i++;x.push(null)}
                 else if(a[i].t===']'){x.push(null);break}
                 else{x.push(expr());if(a[i].t===']'){break}else{dmnd(';')}}}
        dmnd(']')
      }
      if(a[i].t==='←'){i++;return r.concat([['←',x,expr()]])}
      r.push(x);if(')]}:;⋄\n$'.includes(a[i].t))return r
    }
  }
  return[body(),dmnd('$')][0]
}
const voc={}
,retNum=r=>{typeof r==='number'&&r!==r&&domErr();return r}
,perv=(f1,f2)=>{ // pervasive f1:monad, f2:dyad (arguments reversed!)
  let g1=!f1?nyiErr:y=>y.isA?each(g1)(y):retNum(f1(y))
  let g2=!f2?nyiErr:(y,x)=>y.isA||x.isA?each(g2)(y,x):retNum(f2(y,x))
  return(y,x)=>has(x)?g2(x,y):g1(y)
}
,real=f=>(x,y,h)=>typeof x!=='number'||y!=null&&typeof y!=='number'?domErr():f(x,y,h)
,numeric=(f,g)=>(x,y,h)=>(typeof x!=='number'||y!=null&&typeof y!=='number'?g(Zify(x),y==null?y:Zify(y),h):f(x,y,h))
,match=(x,y)=>{
  if(x.isA){
    if(!y.isA||x.s!=''+y.s)return 0
    let r=1,n=x.a.length;for(let i=0;i<n;i++)r&=match(x.a[i],y.a[i])
    return r
  }else{
    if(y.isA)return 0
    if(x instanceof Z&&y instanceof Z)return x.re===y.re&&x.im===y.im
    return x===y
  }
}
,nAprx=(x,y)=>x===y||Math.abs(x-y)<1e-11 // approximate equality for numbers
,aprx=(x,y)=>{ // like match(), but approximate
  if(x.isA){
    if(!y.isA)return 0
    if(x.s.length!==y.s.length)return 0
    if(x.s!=''+y.s)return 0
    let r=1,n=x.a.length;for(let i=0;i<n;i++)r&=aprx(x.a[i],y.a[i])
    return r
  }else{
    if(y.isA)return 0
    if(x==null||y==null)return 0
    if(typeof x==='number')x=new Z(x)
    if(typeof y==='number')y=new Z(y)
    if(x instanceof Z)return y instanceof Z&&nAprx(x.re,y.re)&&nAprx(x.im,y.im)
    return x===y
  }
}
,withId=(x,f)=>{f.identity=x;return f}
,adv =f=>{f.adv =1;return f}
,conj=f=>{f.conj=1;return f}
,cps =f=>{f.cps =1;return f}

voc['π']=Math.PI
voc['+']=withId(0,perv(
  numeric(x=>x,Z.cjg),
  numeric((x,y)=>x+y,Z.add)
))
voc['-']=withId(0,perv(
  numeric(x=>-x,Z.neg),
  numeric((x,y)=>x-y,Z.sub)
))
voc['×']=withId(1,perv(
  numeric(x=>(x>0)-(x<0),x=>{let d=Math.sqrt(x.re*x.re+x.im*x.im);return smplfy(x.re/d,x.im/d)}),
  numeric((x,y)=>x*y,Z.mul)
))
voc['÷']=withId(1,perv(
  numeric(x=>1/x,Z.rcp),
  numeric((x,y)=>x/y,Z.div)
))
voc['⋆']=withId(1,perv(
  numeric(Math.exp,Z.exp),
  Z.pow
))
voc['√']=withId(1,perv(
  Z.sqrt,
  (w,x)=>Z.pow(w,Z.rcp(x))
))
voc['|']=withId(0,perv(
  numeric(x=>Math.abs(x),Z.mag),
  Z.mod
))
voc['⌊']=withId(Infinity,perv(
  Z.floor,
  real((x,y)=>Math.min(x,y))
))
voc['⌈']=withId(-Infinity,perv(
  Z.ceil,
  real((x,y)=>Math.max(x,y))
))
voc['∨']=perv(null,(x,y)=>Z.isint(x)&&Z.isint(y)?Z.gcd(x,y):domErr())
voc['∧']=perv(null,(x,y)=>Z.isint(x)&&Z.isint(y)?Z.lcm(x,y):domErr())
const eq=(x,y)=>+(x instanceof Z&&y instanceof Z?x.re===y.re&&x.im===y.im:x===y)
voc['=']=withId(1,perv(null,eq))
voc['≠']=withId(0,(y,x)=>has(x)?perv(null,(x,y)=>1-eq(y,x))(y,x):(y.isA&&y.s.length?y.s[0]:1))
voc['<']=withId(0,(y,x)=>has(x)?perv(null,real((x,y)=>+(x< y)))(y,x):A.scal(y))
voc['>']=withId(0,(y,x)=>has(x)?perv(null,real((x,y)=>+(x> y)))(y,x):mix(y))
voc['≤']=withId(1,perv(null,real((x,y)=>+(x<=y))))
voc['≥']=withId(1,perv(null,real((x,y)=>+(x>=y))))
voc['≡']=(y,x)=>has(x)? +match(y,x):depth(y)
voc['≢']=(y,x)=>has(x)?1-match(y,x):A(new Float64Array(y.s))
const depth=x=>{if(!x.isA)return 0
                let r=0,n=x.a.length;for(let i=0;i<n;i++)r=Math.max(r,depth(x.a[i]));return r+1}
const mix=y=>{
  if(!y.isA||y.a.length===0)return y
  if(y.s.length===0)return y.a[0]
  let e=y.a[0];
  if(!e.isA){for(let yi=1;yi<y.a.length;yi++){y.a[yi].isA&&domErr()}return y}
  const s=e.s,c=s.length
  for(let yi=1;yi<y.a.length;yi++){
    e=y.a[yi];e.isA&&e.s.length===c||rnkErr()
    for(let a=0;a<c;a++)if(e.s[a]!==s[a])lenErr()
  }
  return A([].concat.apply([],y.a.map(e=>Array.from(e.a))),y.s.concat(s))
}
voc['≍']=(y,x)=>mix(A(has(x)?[x,y]:[y]))
voc['∾']=(y,x)=>{
  if(!has(x)){
    y.isA||domErr()
    if(y.s.length===0)return y.a[0]
    if(y.a.length===0)return y
    let dim=y.s.map(l=>Array(l)),i=y.s.map(_=>0)
    const f=y.s.length
    let e=y.a[0];e.isA||rnkErr();const c=e.s.length;c>=f||rnkErr()
    const s=e.s;for(let a=0;a<f;a++)dim[a][0]=s[a]
    let k=f-1;while(k>=0&&y.s[k]===1)k-- // trailingest incomplete axis
    for(let yi=1;yi<y.a.length;yi++){ // verify shapes
      e=y.a[yi];e.isA&&e.s.length===c||rnkErr()
      for(let a=c;a-->f;)if(e.s[a]!==s[a])lenErr()
      for(let a=f;a--;){
        if(++i[a]===y.s[a]){
          i[a]=0
        }else{
          if(a===k){dim[a][i[a]]=e.s[a];if(i[a]+1===y.s[a])k--}
          break
        }
      }
      for(let a=f;a--;)if(dim[a][i[a]]!==e.s[a])lenErr()
    }
    const sum=y=>{let r=0;for(let i=0;i<y.length;i++)r+=y[i];return r}
    const st=s.slice(f,c),rs=dim.map(sum).concat(st),l=prd(st)
    let n=l,rd=Array(f);for(let a=f;a--;){rd[a]=n;n*=rs[a]}
    let r=Array(n);i=y.s.map(_=>0)
    for(let yi=0,r0=0;yi<y.a.length;yi++){
      e=y.a[yi];let j=y.s.map(_=>0)
      for(let ei=0,r1=r0;ei<e.a.length;ei+=l){
        for(let ci=0;ci<l;ci++)r[r1+ci]=e.a[ei+ci]
        for(let a=f;a--;){r1+=rd[a];if(++j[a]===e.s[a]){r1-=j[a]*rd[a];j[a]=0}else{break}}
      }
      for(let a=f;a--;){r0+=rd[a]*e.s[a];if(++i[a]===y.s[a]){r0-=rs[a]*rd[a];i[a]=0}else{break}}
    }
    return A(r,rs)
  }else{
    x=toA(x);y=toA(y)
    const q=x.s.length,r=y.s.length,c=Math.max(q,r)-1,o=q-c,p=r-c
    o>=0&&p>=0||rnkErr()
    for(let i=0;i<c;i++)x.s[o+i]===y.s[p+i]||lenErr()
    return A(Array.from(x.a).concat(Array.from(y.a)),
             c<0?[2]:[(o?x.s[0]:1)+(p?y.s[0]:1)].concat(x.s.slice(o)))
  }
}
voc['⊢']=(y,x)=>y
voc['⊣']=(y,x)=>has(x)?x:y
voc['˜']=adv(f=>(y,x)=>toF(f)(has(x)?x:y,y))
voc['∘']=conj((g,f)=>(y,x)=>f(toF(g)(y,x)))
voc['○']=conj((g,f)=>(y,x)=>f(g(y),has(x)?g(x):undefined))
voc['⊸']=conj((g,f)=>(y,x)=>g(y,toF(f)(has(x)?x:y)))
voc['⟜']=conj((g,f)=>(y,x)=>f(toF(g)(y),has(x)?x:y))
voc['⊥']=(y,x)=>{
  asrt(x)
  if(!x.s.length)x=A([unw(x)])
  if(!y.s.length)y=A([unw(y)])
  let lastDimA=x.s[x.s.length-1],firstDimB=y.s[0]
  if(lastDimA!==1&&firstDimB!==1&&lastDimA!==firstDimB)lenErr()
  let r=[],ni=x.a.length/lastDimA,nj=y.a.length/firstDimB
  for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){
    let u=x.a.slice(i*lastDimA,(i+1)*lastDimA)
    let v=[];for(let l=0;l<firstDimB;l++)v.push(y.a[j+l*(y.a.length/firstDimB)])
    if(u.length===1)u=rpt([u[0]],v.length)
    if(v.length===1)v=rpt([v[0]],u.length)
    let z=v[0];for(let k=1;k<v.length;k++)z=Z.add(Z.mul(z,u[k]),v[k])
    r.push(z)
  }
  return A(r,x.s.slice(0,-1).concat(y.s.slice(1)))
}
voc['⌜']=adv(f=>{
  f=toF(f)
  return(y,x)=>{
    y=toA(y)
    if(!has(x)){
      return A(Array.from(y.a).map(e=>f(e)),y.s)
    }else{
      x=toA(x)
      const m=x.a.length,n=y.a.length,r=Array(m*n)
      for(let i=0;i<m;i++)for(let j=0;j<n;j++){
        r[i*n+j]=f(y.a[j],x.a[i])
      }
      return A(r,x.s.concat(y.s))
    }
  }
})
const each=fn=>{
  fn=toF(fn)
  return(y,x)=>{
    y=toA(y)
    if(!has(x)){
      return A(Array.from(y.a).map(e=>fn(e)),y.s)
    }else{
      x=toA(x);let e=y.s.length,f=x.s.length,w=0;if(e<f){w=1;let t=e;e=f;f=t}
      for(let i=0;i<f;i++)y.s[i]===x.s[i]||lenErr()
      const af=w?y:x,ae=w?x:y,c=prd(ae.s.slice(f));let r=Array(prd(af.s)*c)
      for(let i=0,j=0;i<r.length;j++){
        let u=af.a[j],f1=w?(a=>fn(u,a)):(a=>fn(a,u))
        for(let ie=i+c;i<ie;i++)r[i]=f1(ae.a[i])
      }
      return A(r,ae.s)
    }
  }
}
const rank=(getK,f)=>{
  f=toF(f);getK=toF(getK)
  const efr=(k,r)=>{k=toInt(k);return k<0?Math.min(-k,r):Math.max(r-k,0)} // effective frame
  return(y,x)=>{
    let k=getVec(getK(y,x));1<=k.length&&k.length<=3||lenErr()
    let yx=[y=toA(y)];if(has(x))yx=yx.concat([x=toA(x)])
    k.reverse();k=yx.map((a,i)=>efr(k[(i+(has(x)?0:2))%k.length],a.s.length))
    let fr=k[0],fe=fr,we=0;if(has(x)){let fx=k[1];we=fx>fr?1:0;if(we)fe=fx;else fr=fx}
    if(has(x))for(let i=0;i<fr;i++)y.s[i]===x.s[i]||lenErr()
    const fs=y.s.slice(0,fr),es=has(x)?yx[we].s.slice(fr,fe):[],cs=yx.map((a,i)=>a.s.slice(k[i])),c=cs.map(s=>prd(s))
    const el=prd(es);let r=Array(prd(fs)*el)
    const cell=(w,i)=>A(yx[w].a.slice(i,i+c[w]),cs[w])
    for(let i=0,j=0,si=0;j<r.length;si++){
      let f1=f;if(has(x)){let cc=cell(1-we,si*c[1-we]);f1=we?(a=>f(cc,a)):(a=>f(a,cc))}
      for(let je=j+el;j<je;i+=c[we],j++)r[j]=f1(cell(we,i))
    }
    return mix(A(r,fs.concat(es)))
  }
}
voc['¨']=adv(each)
voc['⎉']=conj(rank)
voc['˘']=adv(f=>rank(-1,f))
voc['⊤']=(y,x)=>{
  x||synErr()
  let s=x.s.concat(y.s),r=Array(prd(s)),n=x.s.length?x.s[0]:1,m=x.a.length/n
  for(let i=0;i<m;i++)for(let j=0;j<y.a.length;j++){
    let v=y.a[j];v=typeof v==='number'?Math.abs(v):v
    for(let k=n-1;k>=0;k--){let u=x.a[k*m+i];r[(k*m+i)*y.a.length+j]=iszero(u)?v:Z.mod(u,v)
                            v=iszero(u)?0:Z.div(Z.sub(v,Z.mod(u,v)),u)}
  }
  return A(r,s)
}
const enlist=(x,r)=>{if(x.isA){const n=x.a.length;for(let i=0;i<n;i++)enlist(x.a[i],r)}else{r.push(x)}}
let Beta
voc['!']=withId(1,perv(
  real(x=>!isInt(x)?Γ(x+1):x<0?domErr():x<smallFactorials.length?smallFactorials[x]:Math.round(Γ(x+1))),
  Beta=real((k,n)=>{
    let r                                                               // Neg int?
    switch(4*negInt(k)+2*negInt(n)+negInt(n-k)){                        // ⍺ ⍵ ⍵-⍺
      case 0:r=Math.exp(lnΓ(n+1)-lnΓ(k+1)-lnΓ(n-k+1))            ;break // 0 0 0   (!⍵)÷(!⍺)×!⍵-⍺
      case 1:r=0                                                 ;break // 0 0 1   0
      case 2:r=domErr()                                          ;break // 0 1 0   domain error
      case 3:r=Math.pow(-1,k)*Beta(k,k-n-1)                      ;break // 0 1 1   (¯1*⍺)×⍺!⍺-⍵+1
      case 4:r=0                                                 ;break // 1 0 0   0
      case 5:asrt(0)                                             ;break // 1 0 1   cannot arise
      case 6:r=Math.pow(-1,n-k)*Beta(Math.abs(n+1),Math.abs(k+1));break // 1 1 0   (¯1*⍵-⍺)×(|⍵+1)!(|⍺+1)
      case 7:r=0                                                 ;break // 1 1 1   0
    }
    return isInt(n)&&isInt(k)?Math.round(r):r
  })
))
const negInt=x=>isInt(x)&&x<0
let smallFactorials=[1];(_=>{let x=1;for(let i=1;i<=25;i++)smallFactorials.push(x*=i)})()
let Γ,lnΓ
;(_=>{
  const g=7
  ,p=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,
      12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7]
  ,g_ln=607/128
  ,p_ln=[0.99999999999999709182,57.156235665862923517,-59.597960355475491248,14.136097974741747174,
         -0.49191381609762019978,0.33994649984811888699e-4,0.46523628927048575665e-4,-0.98374475304879564677e-4,
         0.15808870322491248884e-3,-0.21026444172410488319e-3,0.21743961811521264320e-3,-0.16431810653676389022e-3,
         0.84418223983852743293e-4,-0.26190838401581408670e-4,0.36899182659531622704e-5]
  // Spouge approximation (suitable for large arguments)
  lnΓ=z=>{
    if(z<0)return NaN
    let x=p_ln[0];for(let i=p_ln.length-1;i>0;i--)x+=p_ln[i]/(z+i)
    let t=z+g_ln+.5
    return.5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)-Math.log(z)
  }
  Γ=z=>{
    if(z<.5)return Math.PI/(Math.sin(Math.PI*z)*Γ(1-z))
    if(z>100)return Math.exp(lnΓ(z))
    z--;let x=p[0];for(let i=1;i<g+2;i++)x+=p[i]/(z+i)
    let t=z+g+.5
    return Math.sqrt(2*Math.PI)*Math.pow(t,z+.5)*Math.exp(-t)*x
  }
})()
voc['⍎']=(y,x)=>has(x)?nyiErr():exec(str(y))
voc['⍷']=(y,x)=>{
  x||nyiErr()
  x=toA(x);y=toA(y);
  const r=new Float64Array(y.a.length)
  if(x.s.length>y.s.length)return A(r,y.s)
  if(x.s.length<y.s.length)x=A(x.a,rpt([1],y.s.length-x.s.length).concat(x.s))
  if(!x.a.length)return A(r.fill(1),y.s)
  const s=new Int32Array(y.s.length) // find shape
  for(let i=0;i<y.s.length;i++){s[i]=y.s[i]-x.s[i]+1;if(s[i]<=0)return A(r,y.s)}
  let d=strides(y.s),i=new Int32Array(s.length),j=new Int32Array(s.length),nk=x.a.length,p=0
  while(1){
    let q=p;r[q]=1;j.fill(0)
    for(let k=0;k<nk;k++){
      r[p]&=+match(x.a[k],y.a[q])
      let a=s.length-1;while(a>=0&&j[a]+1===x.s[a]){q-=j[a]*d[a];j[a--]=0}
      if(a<0)break
      q+=d[a];j[a]++
    }
    let a=s.length-1;while(a>=0&&i[a]+1===s[a]){p-=i[a]*d[a];i[a--]=0}
    if(a<0)break
    p+=d[a];i[a]++
  }
  return A(r,y.s)
}
voc._fork1=(h,g)=>{asrt(typeof h==='function');return[h,g]}
voc._fork2=(hg,f)=>{let[h,g]=hg;return(b,a)=>g(h(b,a),toF(f)(b,a))}
voc['⍕']=(y,x)=>{x&&nyiErr();let t=fmt(y);return A(t.join(''),[t.length,t[0].length])}
const fmt=x=>{ // as array of strings
  const t=typeof x
  if(x===null)return['null']
  if(t==='undefined')return['undefined']
  if(t==='string')return[x]
  if(t==='number'){const r=[fmtNum(x)];r.al=1;return r}
  if(t==='function')return['#procedure']
  if(!x.isA)return[''+x]
  if(!x.a.length)return['']
  if(!x.s.length)return fmt(x.a[0])
  // {t:type(0=chr,1=num,2=nst),w:width,h:height,lm:leftMargin,rm:rightMargin,bm:bottomMargin,al:align(0=lft,1=rgt)}
  const nr=prd(x.s.slice(0,-1)),nc=x.s[x.s.length-1],rows=Array(nr),cols=Array(nc)
  for(let i=0;i<nr;i++)rows[i]={h:0,bm:0};for(let i=0;i<nc;i++)cols[i]={t:0,w:0,lm:0,rm:0}
  let g=Array(nr) // grid
  for(let i=0;i<nr;i++){
    const r=rows[i],gr=g[i]=Array(nc) // gr:grid row
    for(let j=0;j<nc;j++){
      const c=cols[j],u=x.a[nc*i+j],b=fmt(u) // b:box
      r.h=Math.max(r.h,b.length);c.w=Math.max(c.w,b[0].length)
      c.t=Math.max(c.t,typeof u==='string'&&u.length===1?0:u.isA?2:1);gr[j]=b
    }
  }
  let step=1;for(let d=x.s.length-2;d>0;d--){step*=x.s[d];for(let i=step-1;i<nr-1;i+=step)rows[i].bm++}
  for(let j=0;j<nc;j++){const c=cols[j];if(j<nc-1&&(c.t!==cols[j+1].t||c.t))c.rm++;if(c.t===2){c.lm++;c.rm++}}
  const a=[] // result
  for(let i=0;i<nr;i++){
    const r=rows[i]
    for(let j=0;j<nc;j++){
      const c=cols[j],t=g[i][j],d=c.w-t[0].length,lft=' '.repeat(c.lm+!!t.al*d),rgt=' '.repeat(c.rm+ !t.al*d)
      for(let k=0;k<t.length;k++)t[k]=lft+t[k]+rgt
      const btm=' '.repeat(t[0].length);for(let h=r.h+r.bm-t.length;h>0;h--)t.push(btm)
    }
    const nk=r.h+r.bm;for(let k=0;k<nk;k++){let s='';for(let j=0;j<nc;j++)s+=g[i][j][k];a.push(s)}
  }
  return a
}
voc['⍋']=(y,x)=>grd(y,x,1)
voc['⍒']=(y,x)=>grd(y,x,-1)
const grd=(y,x,dir)=>{
  asrt(!has(x))
  y.isA&&y.s.length||rnkErr()
  let r=[];for(let i=0;i<y.s[0];i++)r.push(i)
  const l=prd(y.s.slice(1))
  return A(r.sort((i,j)=>{
    let p=0,ind=rpt([0],y.s.length)
    for(let p=0;p<l;p++){
      let u=y.a[i*l+p],ku=typeof u
      let v=y.a[j*l+p],kv=typeof v
      if(ku!==kv)return dir*(1-2*(ku<kv))
      if(u!==v)return dir*(1-2*(u<v))
    }
    return(i>j)-(i<j)
  }))
}
voc['↕']=(y,x)=>{
  if(has(x)){
    y.isA||domErr();const w=Array.from(getVec(x)),a=w.length
    a<=y.s.length||rnkErr();if(!a)return y
    for(let i=0;i<w.length;i++)isInt(w[i])||domErr()
    const cs=y.s.slice(a),c=prd(cs),s=w.map((u,i)=>y.s[i]-u+1).concat(w,cs)
    let d=Array(a);for(let b=a,p=c;b--;p*=y.s[b])d[b]=p;d=d.concat(d)
    let i=d.map(_=>0),r=Array(prd(s)),cc=c*s[2*a-1]
    for(let ri=0,yi=0;ri<r.length;ri+=cc){
      for(let j=0;j<cc;j++)r[ri+j]=y.a[yi+j]
      for(let b=2*a-1;b--;){yi+=d[b];if(++i[b]===s[b]){yi-=s[b]*d[b];i[b]=0}else{break}}
    }
    return A(r,s)
  }else{
    let a=getVec(y);for(let i=0;i<a.length;i++)isInt(a[i],0)||domErr()
    let n=prd(a),m=a.length,r=new Float64Array(n*m),p=1,q=n
    for(let i=0;i<m;i++){
      let ai=a[i],u=i-m;q/=a[i];for(let j=0;j<p;j++)for(let k=0;k<ai;k++)for(let l=0;l<q;l++)r[u+=m]=k
      p*=ai
    }
    if(m===1){return A(r,a)}else{let r1=Array(n);for(let i=0;i<n;i++)r1[i]=A(r.slice(m*i,m*i+m));return A(r1,a)}
  }
}
voc['⊐']=(y,x)=>{
  asrt(x);y.isA||domErr();x.isA&&x.s.length===1||rnkErr()
  const m=x.a.length,n=y.a.length,r=new Float64Array(n)
  for(let i=0;i<n;i++){r[i]=x.s[0];for(let j=0;j<m;j++)if(match(y.a[i],x.a[j])){r[i]=j;break}}
  return A(r,y.s)
}
voc['⍟']=conj((g,f)=>(y,x)=>{
  asrt(typeof f==='function')
  const n=toInt(toF(g)(y,x),0)
  for(let i=0;i<n;i++)y=f(y,x);return y
})
voc['get_•']=cps((_,_1,_2,cb)=>{
  if(typeof window!=='undefined'&&typeof window.prompt==='function'){setTimeout(_=>{cb(A(prompt('')||''))},0)}
  else{readline('',x=>cb(A(x)))}
})
voc['set_•']=x=>{
  let s=fmt(x).join('\n')+'\n'
  if(typeof window!=='undefined'&&typeof window.alert==='function'){window.alert(s)}else{process.stdout.write(s)}
  return x
}
voc['get_•IO']=_=>A.zero
voc['set_•IO']=x=>match(x,A.zero)?x:domErr()
voc['•DL']=cps((y,x,_,cb)=>{let t0=+new Date;setTimeout(_=>{cb(A([new Date-t0]))},unw(y))})
voc['•RE']=(y,x)=>{
  x=str(x),y=str(y)
  let re;try{re=RegExp(x)}catch(e){domErr()}
  let m=re.exec(y);if(!m)return A.zld
  let r=[m.index];for(let i=0;i<m.length;i++)r.push(A(m[i]||''))
  return A(r)
}
voc['•UCS']=(y,x)=>{
  x&&nyiErr();let r=Array(y.a.length)
  for(let i=0;i<y.a.length;i++){
    let u=y.a[i];r[i]=isInt(u,0,0x10000)?String.fromCharCode(u):typeof u==='string'?u.charCodeAt(0):domErr()
  }
  return A(r,y.s)
}
voc['get_•OFF']=_=>{typeof process==='undefined'&&nyiErr();process.exit(0)}
voc['?']=(y,x)=>has(x)?deal(y,x):roll(y)
const roll=perv(y=>{isInt(y,1)||domErr();return Math.floor(Math.random()*y)})
,deal=(y,x)=>{
  x=unw(x);y=unw(y)
  isInt(y,0)&&isInt(x,0,y+1)||domErr()
  let r=Array(y);for(let i=0;i<y;i++)r[i]=i
  for(let i=0;i<x;i++){let j=i+Math.floor(Math.random()*(y-i));const h=r[i];r[i]=r[j];r[j]=h}
  return A(r.slice(0,x))
}
voc['↗']=y=>err(str(y))
voc['⥊']=(y,x)=>{
  let a=y.isA?y.a:[y]
  if(has(x)){
    let s=getVec(x);for(let i=0;i<s.length;i++)isInt(s[i],0)||domErr()
    let n=prd(s),r=Array(n),m=a.length;if(!m){m=1;a=[0]};for(let i=0;i<n;i++)r[i]=a[i%m]
    return A(r,s)
  }else{
    return A(a)
  }
}
voc['⌽']=(y,x)=>{
  y.isA&&y.s.length||rnkErr()
  if(has(x)){
    let step=unw(x)
    isInt(step)||domErr()
    if(!step)return y
    let n=y.s[0]
    step=(n+step%n)%n // force % to handle negatives properly
    if(!y.a.length||!step)return y
    let r=[],d=strides(y.s),p=0,i=rpt([0],y.s.length)
    while(1){
      r.push(y.a[p+((i[0]+step)%y.s[0]-i[0])*d[0]])
      let a=y.s.length-1;while(a>=0&&i[a]+1===y.s[a]){p-=i[a]*d[a];i[a--]=0}
      if(a<0)break
      i[a]++;p+=d[a]
    }
    return A(r,y.s)
  }else{
    const nj=y.s[0],nk=prd(y.s.slice(1)),r=Array(nj*nk)
    for(let j=0;j<nj;j++)for(let k=0;k<nk;k++)r[j*nk+k]=y.a[(nj-1-j)*nk+k]
    return A(r,y.s)
  }
}
voc['´']=adv(f=>(y,x)=>{
  y.isA&&y.s.length||rnkErr()
  const n=y.s[0],s=y.s.slice(1),c=prd(s)
  const cell=i=>A(y.a.slice(i*c,(i+1)*c),s)
  let i=n
  if(!has(x)){
    if(!n){let z=f.identity;z!=null||domErr();return A(rpt([z],c),s)}
    x=cell(--i)
  }
  while(i--)x=f(x,cell(i))
  return x
})
voc['⍁']=conj((x,f)=>{
  typeof f==='function'||domErr()
  return withId(x,(y,x)=>f(y,x))
})
/*
voc['`']=adv(f=>(y,x)=>{
  asrt(x==null)
  if(!y.s.length)return y
  h=h?toInt(h,0,y.s.length):y.s.length-1
  const ni=prd(y.s.slice(0,h)), nj=y.s[h], nk=prd(y.s.slice(h+1)), r=Array(ni*nj*nk)
  if(r.length)for(let i=0;i<ni;i++)for(let j=0;j<nj;j++)for(let k=0;k<nk;k++){
    let u=y.a[(i*nj+j)*nk+k];u=u.isA?u:A.scal(u)
    for(let l=j-1;l>=0;l--){let v=y.a[(i*nj+l)*nk+k];u=f(u,v.isA?v:A.scal(v))}
    r[(i*nj+j)*nk+k]=u.s.length?u:unw(u)
  }
  return A(r,y.s)
})
*/
voc['/']=(y,x)=>{
  if(has(x)){
    y=toA(y);const xa=getVec(x),a=x.isA&&x.s.length?1:0,n=y.s.length?y.s[0]:1
    !a||xa.length===n||lenErr()
    let l=0;for(let i=0;i<n;i++){const u=xa[i*a];isInt(u,0)||domErr();l+=u}
    const c=prd(y.s.slice(1))
    let r=Array(l*c);l=0
    for(let i=0;i<n;i++){
      const u=xa[i*a];for(let j=0;j<u;j++)for(let k=0;k<c;k++)r[(l+j)*c+k]=y.a[i*c+k];l+=u
    }
    return A(r,[l].concat(y.s.slice(1)))
  }else{
    const a=getVec(y)
    let r=[]
    for(let i=0;i<a.length;i++){
      const u=a[i];isInt(u,0)||domErr()
      for(let j=0;j<u;j++)r.push(i)
    }
    return A(r)
  }
}
voc['⊑']=(y,x)=>{
  y.isA||domErr()
  let i=0
  if(has(x)){
    let a=getVec(x);a.length===y.s.length||rnkErr()
    for(let s=0;s<a.length;s++){
      const u=a[s];isInt(u,0,y.s[s])||idxErr()
      i=i*y.s[s]+u
    }
  }
  return y.a.length?y.a[i]:0
}
voc['⊏']=(y,x)=>{
  y.isA&&y.s.length||rnkErr()
  const l=y.s[0],cs=y.s.slice(1),c=prd(cs)
  let a=[0],s=cs;if(has(x)){if(x.isA){a=x.a;s=x.s.concat(cs)}else{a=[x]}}
  let r=Array(a.length*c)
  for(let i=0;i<a.length;i++){
    const u=a[i];isInt(u,0,l)||idxErr()
    for(let j=0;j<c;j++)r[i*c+j]=y.a[u*c+j]
  }
  return A(r,s)
}
voc._amend=args=>{
  let[value,x,y,h]=args.a.map(toA)
  x.s.length>1&&rnkErr()
  let a=Array(x.a.length);a.length>y.s.length&&lenErr()
  if(h){h.s.length>1&&rnkErr();h=h.a;a.length===h.length||lenErr()}
  else{h=[];for(let i=0;i<a.length;i++)a.push(i)}
  let subs=voc['⊏'](voc['↕'](A(y.s)),x,A(h))
  if(value.a.length===1)value=A(rpt([value],subs.a.length),subs.s)
  let r=y.a.slice(),stride=strides(y.s)
  subs.s.length!==value.s.length&&rnkErr();''+subs.s!=''+value.s&&lenErr()
  const ni=subs.a.length
  for(let i=0;i<ni;i++){
    let u=subs.a[i],v=value.a[i]
    if(v.isA&&!v.s.length)v=unw(v)
    if(u.isA){let p=0;for(let j=0;j<u.a.length;j++)p+=u.a[j]*stride[j]; r[p]=v}
    else{r[u]=v}
  }
  return A(r,y.s)
}
voc['↑']=(y,x)=>{
  has(x)||nyiErr()
  y=toA(y)
  let t=getVec(x)
  if(!y.s.length)y=A([unw(y)],x.isA&&x.s.length?rpt([1],x.s[0]):[1])
  t.length<=y.s.length||rnkErr()
  for(let i=0;i<t.length;i++)isInt(t[i])||domErr()
  let s=y.s.slice();for(let i=0;i<t.length;i++)s[i]=Math.abs(t[i])
  let d=Array(s.length);d[d.length-1]=1
  for(let i=d.length-1;i>0;i--)d[i-1]=d[i]*s[i]
  let r=rpt([getProt(y)],prd(s))
  let cs=s.slice(),p=0,q=0,xd=strides(y.s) // cs:shape to copy
  for(let i=0;i<t.length;i++){
    let u=t[i];cs[i]=Math.min(y.s[i],Math.abs(u))
    if(u<0){if(u<-y.s[i]){q-=(u+y.s[i])*d[i]}else{p+=(u+y.s[i])*xd[i]}}
  }
  if(prd(cs)){
    let ci=new Int32Array(cs.length) // ci:indices for copying
    while(1){
      r[q]=y.a[p];let h=cs.length-1
      while(h>=0&&ci[h]+1===cs[h]){p-=ci[h]*xd[h];q-=ci[h]*d[h];ci[h--]=0}
      if(h<0)break
      p+=xd[h];q+=d[h];ci[h]++
    }
  }
  return A(r,s)
}
voc['⍉']=(y,x)=>{
  let a,s=[],d=[],d0=strides(y.s),yr=y.s.length
  if(has(x)){a=getVec(x);a.length===yr||rnkErr();for(let i=0;i<yr;i++)isInt(a[i],0,yr)||domErr()}
  else{a=new Int32Array(yr);a[0]=yr-1;for(let i=1;i<yr;i++)a[i]=i-1;}
  for(let i=0;i<yr;i++){
    let x=a[i]
    if(s[x]==null){s[x]=y.s[i];d[x]=d0[i]}
    else{s[x]=Math.min(s[x],y.s[i]);d[x]+=d0[i]}
  }
  for(let i=0;i<s.length;i++)s[i]!=null||rnkErr()
  let n=prd(s),r=Array(n),j=new Int32Array(s.length),p=0,l=s.length-1
  for(let i=0;i<n;i++){
    r[i]=y.a[p]
    let u=l;while(u>=0&&j[u]+1===s[u]){p-=j[u]*d[u];j[u--]=0}
    if(u<0)break
    j[u]++;p+=d[u]
  }
  return A(r,s)
}
voc['⍠']=conj((f,g)=>(y,x)=>(has(x)?f:g)(y,x))

voc['⁼']=adv(f=>f.inverse||domErr())
voc['+'].inverse=voc['⍠'](voc['+'],voc['˜'](voc['-']))
voc['-'].inverse=voc['-']
voc['×'].inverse=withId(1,perv(
  numeric(x=>(x>0)-(x<0),x=>{let d=Math.sqrt(x.re*x.re+x.im*x.im);return smplfy(x.re/d,x.im/d)}),
  numeric((x,y)=>x*y,Z.mul)
))
voc['÷'].inverse=voc['÷']
voc['⋆'].inverse=perv(
  Z.log,
  (x,y)=>typeof x==='number'&&typeof y==='number'&&x>0&&y>0?Math.log(y)/Math.log(x):Z.div(Z.log(y),Z.log(x))
)
voc['√'].inverse=withId(1,perv(
  numeric(x=>x*x,x=>Z.mul(x,x)),
  (w,x)=>Z.pow(w,x)
))
voc['⊢'].inverse=(y,x)=>y
voc['⊣'].inverse=(y,x)=>has(x)?domErr():y

const NOUN=1,VRB=2,ADV=3,CNJ=4
,exec=(s,o={})=>{
  const t=prs(s,o),b=compile(t,o),e=[preludeData.env[0].slice()] // t:ast,b:bytecode,e:env
  for(let k in t.v)e[0][t.v[k].i]=o.ctx[k]
  const r=vm(b,e)
  for(let k in t.v){const v=t.v[k],x=o.ctx[k]=e[0][v.i];if(v.g===ADV)x.adv=1;if(v.g===CNJ)x.conj=1}
  return r
}
,repr=x=>x===null||['string','number','boolean'].indexOf(typeof x)>=0?JSON.stringify(x):
         x instanceof Array?'['+x.map(repr).join(',')+']':
         x.repr?x.repr():'{'+Object.keys(x).map(k=>repr(k)+':'+repr(x[k])).join(',')+'}'
,compile=(ast,o={})=>{
  ast.d=0;ast.n=preludeData?preludeData.n:0;ast.v=preludeData?Object.create(preludeData.v):{} // n:nSlots,d:scopeDepth,v:vars
  o.ctx=o.ctx||Object.create(voc)
  for(let key in o.ctx)if(!ast.v[key]){ // VarInfo{g:grammaticalCategory(1=noun,2=vrb,3=adv,4=cnj),i:slot,d:scopeDepth}
    const u=o.ctx[key],v=ast.v[key]={g:NOUN,i:ast.n++,d:ast.d}
    if(typeof u==='function'||u instanceof Proc){
      v.g=u.adv?ADV:u.conj?CNJ:VRB
      if(/^[gs]et_.*/.test(key))ast.v[key.slice(4)]={g:NOUN}
    }
  }
  const synErrAt=x=>{synErr({file:o.file,offset:x.offset,aplCode:o.aplCode})}
  const gl=x=>{switch(x[0]){default:asrt(0) // categorise lambdas
    case'B':case':':case'←':case'[':case'{':case'.':case'⍬':
      let r=VRB;for(let i=1;i<x.length;i++)if(x[i])r=Math.max(r,gl(x[i]))
      if(x[0]==='{'){x.g=r;return VRB}else{return r}
    case'S':case'N':case'J':return 0
    case'X':{const s=x[1];return s==='⍺⍺'||s==='⍶'||s==='∇∇'?ADV:s==='⍵⍵'||s==='⍹'?CNJ:VRB}
  }}
  gl(ast)
  const q=[ast] // queue for "body" nodes
  while(q.length){
    const scp=q.shift() // scp:scope node
    ,vst=x=>{
      x.scp=scp
      switch(x[0]){default:asrt(0)
        case':':{const r=vst(x[1]);vst(x[2]);return r}
        case'←':return vstLHS(x[1],vst(x[2]))
        case'X':{
          const s=x[1],v=scp.v['get_'+s];if(v&&v.g===VRB)return NOUN
          return(scp.v[s]||{}).g||valErr({file:o.file,offset:x.offset,aplCode:o.aplCode})
        }
        case'{':{
          for(let i=1;i<x.length;i++){
            const d=scp.d+1+(x.g!==VRB) // slot 3 is reserved for a "base pointer"
            ,v=extend(Object.create(scp.v),{'⍵':{i:0,d,g:NOUN},'∇':{i:1,d,g:VRB},'⍺':{i:2,d,g:NOUN},'→':{d,g:VRB}})
            q.push(extend(x[i],{scp,d,n:4,v}))
            if(x.g===CNJ){v['⍵⍵']=v['⍹']={i:0,d:d-1,g:VRB};v['∇∇']={i:1,d:d-1,g:CNJ};v['⍺⍺']=v['⍶']={i:2,d:d-1,g:VRB}}
            else if(x.g===ADV){v['⍺⍺']=v['⍶']={i:0,d:d-1,g:VRB};v['∇∇']={i:1,d:d-1,g:ADV}}
          }
          return x.g||VRB
        }
        case'S':case'N':case'J':case'⍬':return NOUN
        case'[':{for(let i=2;i<x.length;i++)if(x[i]&&vst(x[i])!==NOUN)synErrAt(x);return vst(x[1])}
        case'.':{
          let a=x.slice(1),h=Array(a.length);for(let i=a.length-1;i>=0;i--)h[i]=vst(a[i])
          // strands
          let i=0
          while(i<a.length-1){
            if(h[i]===NOUN&&h[i+1]===NOUN){
              let j=i+2;while(j<a.length&&h[j]===NOUN)j++
              a.splice(i,j-i,['V'].concat(a.slice(i,j)))
              h.splice(i,j-i,NOUN)
            }else{
              i++
            }
          }
          // adverbs and conjunctions
          i=0
          while(i<a.length){
            if(h[i]===VRB&&i+1<a.length&&h[i+1]===ADV){
              a.splice(i,2,['A'].concat(a.slice(i,i+2)));h.splice(i,2,VRB)
            }else if((h[i]===NOUN||h[i]===VRB||h[i]===CNJ)&&i+2<a.length&&h[i+1]===CNJ&&(h[i+2]===NOUN||h[i+2]===VRB)){
              a.splice(i,3,['C'].concat(a.slice(i,i+3)));h.splice(i,3,VRB) // allow CNJ,CNJ,... for ∘.f
            }else{
              i++
            }
          }
          if(h.length>1&&h[h.length-1]===VRB){a=[['T'].concat(a)];h=[VRB]} // trains
          if(h[h.length-1]!==NOUN){
            if(h.length>1)synErrAt(a[h.length-1])
          }else{
            while(h.length>1){ // monadic and dyadic verbs
              if(h.length===2||h[h.length-3]!==NOUN){a.splice(-2,9e9,['M'].concat(a.slice(-2)));h.splice(-2,9e9,NOUN)}
              else                                  {a.splice(-3,9e9,['D'].concat(a.slice(-3)));h.splice(-3,9e9,NOUN)}
            }
          }
          x.splice(0,9e9,a[0]);extend(x,a[0]);return h[0]
        }
      }
    }
    ,vstLHS=(x,rg)=>{ // rg:right-hand side grammatical category
      x.scp=scp
      switch(x[0]){default:asrt(0)
        case'X':const s=x[1];if(s==='∇'||s==='→')synErrAt(x)
                if(scp.v[s]){scp.v[s].g!==rg&&synErrAt(x)}else{scp.v[s]={d:scp.d,i:scp.n++,g:rg}};break
        case'.':rg===NOUN||synErrAt(x);for(let i=1;i<x.length;i++)vstLHS(x[i],rg);break
        case'[':rg===NOUN||synErrAt(x);vstLHS(x[1],rg);for(let i=2;i<x.length;i++)x[i]&&vst(x[i]);break
      }
      return rg
    }
    for(let i=1;i<scp.length;i++)vst(scp[i])
  }
  const rndr=x=>{switch(x[0]){default:asrt(0)
    case'B':{if(x.length===1)return[LDC,A.zld,RET]
             const a=[];for(let i=1;i<x.length;i++){a.push.apply(a,rndr(x[i]));a.push(POP)}
             a[a.length-1]=RET;return a}
    case':':{const r=rndr(x[1]),y=rndr(x[2]);return r.concat(JEQ,y.length+2,POP,y,RET)}
    case'←':return rndr(x[2]).concat(rndrLHS(x[1]))
    case'X':{const s=x[1],vars=x.scp.v,v=vars['get_'+s]
             return s==='→'?[CON]:v&&v.g===VRB?[LDC,A.zero,GET,v.d,v.i,MON]:[GET,vars[s].d,vars[s].i]}
    case'{':{const r=rndr(x[1]),lx=[LAM,r.length].concat(r);let f
             if(x.length===2){f=lx}
             else if(x.length===3){let y=rndr(x[2]),ly=[LAM,y.length].concat(y),v=x.scp.v['⍠']
                                   f=ly.concat(GET,v.d,v.i,lx,DYA)}
             else{synErrAt(x)}
             return x.g===VRB?f:[LAM,f.length+1].concat(f,RET)}
    case'S':{const s=x[1].slice(1,-1).replace(/''/g,"'");return[LDC,A(s.split(''),s.length===1?[]:[s.length])]}
    case'N':{const a=x[1].replace(/[¯∞]/g,'-').split(/j/i).map(x=>x==='-'?Infinity:x==='--'?-Infinity:parseFloat(x))
             return[LDC,a[1]?new Z(a[0],a[1]):a[0]]}
    case'J':{const f=Function('return(_w,_a)=>('+x[1].replace(/^«|»$/g,'')+')')();return[EMB,(_w,_a)=>aplify(f(_w,_a))]}
    case'V':{const frags=[];let allConst=1
             for(let i=1;i<x.length;i++){const f=rndr(x[i]);frags.push(f);if(f.length!==2||f[0]!==LDC)allConst=0}
             return allConst?[LDC,A(frags.map(f=>f[1]))]
                            :[].concat.apply([],frags).concat([VEC,x.length-1])}
    case'⍬':return[LDC,A.zld]
    case'M':return rndr(x[2]).concat(rndr(x[1]),MON)
    case'A':return rndr(x[1]).concat(rndr(x[2]),MON)
    case'D':case'C':return rndr(x[3]).concat(rndr(x[2]),rndr(x[1]),DYA)
    case'T':{const u=x.scp.v._atop,v=x.scp.v._fork1,w=x.scp.v._fork2;let i=x.length-1,r=rndr(x[i--])
             while(i>=2)r=r.concat(GET,v.d,v.i,rndr(x[i--]),DYA,GET,w.d,w.i,rndr(x[i--]),DYA)
             return i?r.concat(GET,u.d,u.i,rndr(x[1]),DYA):r}
  }}
  const rndrLHS=x=>{switch(x[0]){default:asrt(0)
    case'X':{const s=x[1],vars=x.scp.v,v=vars['set_'+s];return v&&v.g===VRB?[GET,v.d,v.i,MON]:[SET,vars[s].d,vars[s].i]}
    case'.':{const n=x.length-1,a=[SPL,n];for(let i=1;i<x.length;i++){a.push.apply(a,rndrLHS(x[i]));a.push(POP)};return a}
    case'[':{const h=[],a=[],v=x.scp.v._amend // index assignment
             for(let i=2;i<x.length;i++)if(x[i]){h.push(i-2);a.push.apply(a,rndr(x[i]))}
             a.push(VEC,h.length);a.push.apply(a,rndr(x[1]));a.push(LDC,A(h),VEC,4,GET,v.d,v.i,MON)
             a.push.apply(a,rndrLHS(x[1]));return a}
  }}
  return rndr(ast)
}
,aplify=x=>{
  if(typeof x==='string')return x.length===1?x:A(x)
  if(typeof x==='number')return x
  if(x instanceof Array)return A(x.map(y=>aplify(y)))
  if(x.isA)return x
  domErr()
}

let preludeData
;(_=>{
  const ast=prs(prelude),code=compile(ast),v={},env=[[]];for(let k in ast.v)v[k]=ast.v[k]
  preludeData={n:ast.n,v,env}
  for(let k in v)env[0][v[k].i]=voc[k]
  vm(code,env)
  for(let k in v)voc[k]=env[0][v[k].i]
})()
let apl=this.apl=(s,o)=>apl.ws(o)(s) // s:apl code; o:options
extend(apl,{fmt,aprx,prs,compile,repr})
apl.ws=(o={})=>{
  const ctx=Object.create(voc)
  if(o.in )ctx['get_•']=_=>{let s=o.in();asrt(typeof s==='string');return new A(s)}
  if(o.out)ctx['set_•']=x=>{o.out(fmt(x).join('\n')+'\n')}
  return s=>exec(s,{ctx})
}
const readline=(p,f)=>{ // p:prompt
  ;(readline.requesters=readline.requesters||[]).push(f)
  let rl=readline.rl
  if(!rl){
    rl=readline.rl=require('readline').createInterface(process.stdin,process.stdout)
    rl.on('line',x=>{let h=readline.requesters.pop();h&&h(x)})
    rl.on('close',_=>{process.stdout.write('\n');process.exit(0)})
  }
  rl.setPrompt(p);rl.prompt()
}
if(typeof module!=='undefined'){
  module.exports=apl
  if(module===require.main){
    let usage='Usage: apl.js [options] [filename.apl]\n'+
              'Options:\n'+
              '  -l --linewise   Process stdin line by line and disable prompt\n'
    let file,linewise
    process.argv.slice(2).forEach(arg=>{
      if(arg==='-h'||arg==='--help'){process.stderr.write(usage);process.exit(0)}
      else if(arg==='-l'||arg=='--linewise')linewise=1
      else if(arg[0]==='-'){process.stderr.write('unrecognized option:'+arg+'\n'+usage);process.exit(1)}
      else if(file){process.stderr.write(usage);process.exit(1)}
      else file=arg
    })
    if(file){
      exec(require('fs').readFileSync(file,'utf8'))
    }else if(linewise){
      let fs=require('fs'),ws=apl.ws(),a=Buffer(256),i=0,n=0,b=Buffer(a.length),k
      while(k=fs.readSync(0,b,0,b.length)){
        if(n+k>a.length)a=Buffer.concat([a,a])
        b.copy(a,n,0,k);n+=k
        while(i<n){
          if(a[i]===10){ // '\n'
            let r;try{r=fmt(ws(''+a.slice(0,i))).join('\n')+'\n'}catch(e){r=e+'\n'}
            process.stdout.write(r);a.copy(a,0,i+1);n-=i+1;i=0
          }else{
            i++
          }
        }
      }
    }else if(!require('tty').isatty()){
      let fs=require('fs'),b=Buffer(1024),n=0,k
      while(k=fs.readSync(0,b,n,b.length-n)){n+=k;n===b.length&&b.copy(b=Buffer(2*n))} // read all of stdin
      exec(b.toString('utf8',0,n))
    }else{
      const ws=apl.ws(),out=process.stdout
      const f=s=>{
        try{s.match(/^\s*$/)||out.write(fmt(ws(s)).join('\n')+'\n')}catch(e){out.write(e+'\n')}
        readline('      ',f)
      }
      f('')
    }
  }
}
