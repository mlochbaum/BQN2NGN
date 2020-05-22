//usr/bin/env node "$0" $@;exit $?
'use strict'
// \ ⚇
const prelude=`
⍬←⟨⟩ ⋄ •d←"0123456789" ⋄ •a←"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
⌾←{𝔾⁼∘𝔽○𝔾}
¬←(1+-)⍁1
⊏↩⊣´⍠⊏
↓←{s←(≠𝕨)(⊣↑⊢∾˜1⥊˜0⌈-⟜≠)≢𝕩 ⋄ ((s×¯1⋆𝕨>0)+(-s)⌈s⌊𝕨)↑𝕩}
↑↩((↕1+≠)↑¨<)⍠↑
↓↩((↕1+≠)↓¨<)⍠↓
∊←(⊐˜=↕∘≢)⍠(⊐˜≠≠∘⊢)
∧↩⍋⊸⊏⍠∧⍁1
∨↩⍒⊸⊏⍠∨⍁0
∪←0⊸↑(⊣∾¬∘∊˜/≍∘⊢)˜´⌽
⊒←(⊐˜(⊢-⊏)⍋∘⍋)⍠{𝕨⊐○(∾˘⟜⊒𝕨⊸⊐)𝕩}
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
            else if(f.b){let bp=t.length;t.push(b,p,h);b=f.b;p=f.p;h=f.h.concat([[x,f,null,bp]])}
            else t.push(f)
            break}
  case DYA:{let[y,f,x]=t.splice(-3)
            if(typeof f==='function'){if(y instanceof Proc)y=toFn(y)
                                      if(x instanceof Proc)x=toFn(x)
                                      if(f.cps){f(y,x,undefined,r=>{t.push(r);vm(b,h,p,t)});return}
                                      t.push(f(y,x))}
            else if(f.b){let bp=t.length;t.push(b,p,h);b=f.b;p=f.p;h=f.h.concat([[y,f,x,bp]])}
            else t.push(f)
            break}
  case LAM:{let size=b[p++];t.push(new Proc(b,p,size,h));p+=size;break}
  case RET:{if(t.length===1)return t[0];[b,p,h]=t.splice(-4,3);break}
  case POP:{t.pop();break}
  case SPL:{const n=b[p++],v=t[t.length-1];v.isA||domErr();v.a.length===n||lenErr()
            t.push.apply(t,v.a.slice().reverse());break}
  case JEQ:{const n=b[p++];toInt(t[t.length-1],0,2)||(p+=n);break}
  case EMB:{let frm=h[h.length-1];t.push(b[p++](frm[0],frm[2]));break}
  case CON:{let frm=h[h.length-1],cont={b,h:h.map(x=>x.slice()),t:t.slice(0,frm[3]),p:frm[1].p+frm[1].size-1}
            asrt(b[cont.p]===RET);t.push(r=>{b=cont.b;h=cont.h;t=cont.t;p=cont.p;t.push(r)});break}
}}
,td=[['-',/^ +|^[⍝#].*/],                 // whitespace or comment
     ['N',/^¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|∞)(?:j¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|∞))?/i], // number
     ['S',/^(?:'[^']*')+|^(?:"[^"]*")+/], // string
     ['.',/^[\(\){\}⟨⟩‿:;←↩]/],           // punctuation
     ['⋄',/^[⋄\n,]/],                     // separator
     ['J',/^«[^»]*»/],                    // JS literal
     ['X',/^(?:•?[_A-Za-z][_A-Za-z0-9]*|𝕗|𝕘|𝕨|𝕩|𝔽|𝔾|𝕎|𝕏|∇∇|[^¯\'":«»])/]] // identifier
,prs=(s,o)=>{
  // tokens are {t:type,v:value,c:syntactic class,o:offset,s:aplCode}
  let i=0,a=[],l=s.length // i:offset in s, a:tokens
  while(i<l){
    let m,t,v,c=0,o=i,r=s.slice(i)
    for(let j=0;j<td.length;j++)if(m=r.match(td[j][1])){v=m[0];t=td[j][0];t==='.'&&(t=v);break}
    t||synErr({file:o?o.file:null,o:i,s:s})
    i+=v.length
    if('NSJ'.includes(t))c=NOUN
    if(t==='X'){
      if(v[0]==='_'){c=ADV;let e=v.length-1;if(v[e]==='_')c=CNJ;else e++;v=v.slice(1,e).toLowerCase()}
      else if(/[•A-Za-z]/.test(v[0])){c=/[A-Z]/.test(v[v[0]==='•'?1:0])?VRB:NOUN;v=v.toLowerCase()}
      else c=/[˜¨˘⁼⌜´`]/.test(v)?ADV:/[⊸∘○⟜⌾⚇⎉⍟⍠⍁]/.test(v)?CNJ:/𝕗|𝕘|𝕨|𝕩|[⍬π]/.test(v)?NOUN:VRB
    }
    if(t!=='-')a.push({t,v,c,o,s}) // t:type, v:value, c:syntactic class, o:offset
  }
  a.push({t:'$',v:'',c:0,o:i,s})
  // AST node types: 'B' a⋄b  ':' a:b  'N' 1  'S' 'a'  'X' a  'J' «a»  '{' {}  '←' a←b  '↩' a↩b
  //                 'V' 1‿2  'M' +1  'D' 1+2  'A' +´  'C' +⎉2  'T' +÷
  i=0 // offset in a
  let fstk=[] // function stack for argument/operand tracking
  const dmnd=x=>a[i].t===x?i++:prsErr()
  ,prsErr=x=>synErr({file:o.file,offset:has(x)?x.offset:a[i].o,aplCode:s})
  ,body=_=>{
    let r=['B']
    while(1){
      while(a[i].t==='⋄')i++
      if('$};'.includes(a[i].t))return r
      let e=expr()[0];if(a[i].t===':'){i++;e=[':',e,expr()[0]]}
      r.push(e)
    }
  }
  ,expr=_=>{
    const argt=s=>/^(𝕗|𝔽|∇∇)$/.test(s)?1<<ADV:/^(𝕘|𝔾)$/.test(s)?1<<CNJ:/^(𝕨|𝕩|𝕎|𝕏)$/.test(s)?1<<VRB:0
    let r=[],h=[] // components and their syntactic classes
    while(1){
      let x=['V'],c=0;while(1){
        let o,n=a[i++]
        if('NSXJ'.includes(n.t)){o=[n.t,n.v,c=n.c];let k;if(n.t==='X'&&(k=argt(n.v))){fstk.length||prsErr();fstk[fstk.length-1].g|=k}}
        else if(n.t==='('){let e=expr();dmnd(')');o=e[0];c=e[1]}
        else if(n.t==='{'){fstk.push(o=['{']);o.g=0;o.push(body());if(a[i].t===';'){i++;o.push(body())}dmnd('}');fstk.pop();c=o.g&(1<<CNJ)?CNJ:o.g&(1<<ADV)?ADV:VRB}
        else if(n.t==='⟨'){o=['V'];while(1){while(a[i].t==='⋄')i++;if('$⟩'.includes(a[i].t))break;o.push(expr()[0])}dmnd('⟩');c=NOUN}
        else{i--;prsErr()}
        x.push(o)
        if(a[i].t!=='‿')break;i++
      }
      if(x.length===2)x=x[1];else c=NOUN
      let t=a[i].t;if('←↩'.includes(t)){
        i++;let e=expr(),f;if(t==='↩'&&c===VRB&&e[1]===NOUN&&r.length){f=x;x=r.pop();h.pop()};c=e[1]
        const chkX=x=>x[0]==='X'&&x[1]!=='∇'&&x[1]!=='→'&&x[2]===c||prsErr(x),
        chk=c!==NOUN?chkX:(x=>{if(x[0]==='V')for(let i=1;i<x.length;i++)chk(x[i]);else chkX(x)})
        chk(x)
        x=[t,x,e[0],f]
      }
      r.push(x);h.push(c);if(')}⟩:;⋄$'.includes(a[i].t))return parseExpr(r,h)
    }
  }
  ,parseExpr=(a,h)=>{
    for(let i=0;i<a.length;){ // adverbs and conjunctions
      const rand=c=>c===NOUN||c===VRB
      if(rand(h[i])&&i+1<a.length&&h[i+1]===ADV){
        a.splice(i,2,['A'].concat(a.slice(i,i+2)));h.splice(i,2,VRB)
      }else if(rand(h[i])&&i+2<a.length&&h[i+1]===CNJ&&rand(h[i+2])){
        a.splice(i,3,['C'].concat(a.slice(i,i+3)));h.splice(i,3,VRB)
      }else{
        i++
      }
    }
    if(h.length===1){ // single object
      return[a[0],h[0]]
    }else if(h[h.length-1]===VRB){ // trains
      for(let i=h.length-2;i>0;i-=2)h[i]===VRB||prsErr(a[i])
      return[['T'].concat(a),VRB]
    }else if(h[h.length-1]===NOUN){ // monadic and dyadic verbs
      let n=a[a.length-1]
      for(let i=a.length-2;i>=0;i--){
        h[i]===VRB||prsErr(a[i])
        let e=i,d=+(i>0&&h[i-1]===NOUN);i-=d
        n=[d?'D':'M'].concat(a.slice(i,e+1),[n])
      }
      return[n,NOUN]
    }else{
      prsErr(a[h.length-1])
    }
  }
  let b=body();dmnd('$');return b
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
    return y.isA&&x.s==''+y.s&&vec_match(x.a,0,y.a,0,x.a.length)?1:0
  }else{
    if(y.isA)return 0
    if(x instanceof Z&&y instanceof Z)return x.re===y.re&&x.im===y.im?1:0
    return x===y?1:0
  }
}
,vec_match=(u,i,v,j,l)=>{for(let k=0;k<l;k++)if(!match(u[i+k],v[j+k]))return 0;return 1}
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
voc['≡']=(y,x)=>has(x)?  match(y,x):depth(y)
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
voc['\\']=(y,x)=>{
  has(x)||synErr()
  x.isA&&y.isA||domErr();y.s.length||rnkErr()
  let a=getVec(x)
  if(a.length&&a[0].isA){
    for(let i=0;i<a.length;i++){a[i].isA&&a[i].s.length===1||rnkErr();a[i]=a[i].a}
  }else{
    a=[a]
  }
  const f=a.length,c=y.s.length;f<=c||rnkErr()
  let dim=Array(f)
  for(let i=0;i<f;i++){
    const u=a[i];u.length<=y.s[i]+1||lenErr()
    let d=[],m=0;for(let j=0;j<u.length;j++,m++){
      isInt(u[j],0)||domErr()
      if(u[j]){d.push(m);for(let k=0;k<u[j]-1;k++)d.push(0);m=0}
    }
    d.push(y.s[i]-u.length+m);dim[i]=d
  }
  const rs=dim.map(d=>d.length),m=prd(rs),st=y.s.slice(f),l=prd(st)
  let rd=Array(f);for(let a=f,n=l;a--;){rd[a]=n;n*=y.s[a]}
  let r=Array(m),i=rs.map(_=>0)
  for(let ri=0,y0=0;ri<m;ri++){
    let es=dim.map((d,j)=>d[i[j]]).concat(st),e=r[ri]=A(Array(prd(es)),es)
    let j=rs.map(_=>0)
    for(let ei=0,y1=y0;ei<e.a.length;ei+=l){
      for(let ci=0;ci<l;ci++)e.a[ei+ci]=y.a[y1+ci]
      for(let a=f;a--;){y1+=rd[a];if(++j[a]===es[a]){y1-=j[a]*rd[a];j[a]=0}else{break}}
    }
    for(let a=f;a--;){y0+=rd[a]*es[a];if(++i[a]===rs[a]){y0-=y.s[a]*rd[a];i[a]=0}else{break}}
  }
  return A(r,rs)
}
voc['⊢']=(y,x)=>y
voc['⊣']=(y,x)=>has(x)?x:y
voc['˜']=f=>(y,x)=>toF(f)(has(x)?x:y,y)
voc['∘']=(g,f)=>(y,x)=>f(toF(g)(y,x))
voc['○']=(g,f)=>(y,x)=>f(g(y),has(x)?g(x):undefined)
voc['⊸']=(g,f)=>(y,x)=>g(y,toF(f)(has(x)?x:y))
voc['⟜']=(g,f)=>(y,x)=>f(toF(g)(y),has(x)?x:y)
voc['⌜']=f=>{
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
}
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
voc['¨']=each
voc['⎉']=rank
voc['˘']=f=>rank(-1,f)
voc['⊥']=(y,x)=>{
  asrt(x)
  if(!x.isA||!x.s.length)x=A([x.isA?x.a[0]:x])
  if(!y.isA||!y.s.length)y=A([y.isA?y.a[0]:y])
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
voc['⊤']=(y,x)=>{
  x||synErr();x.isA||domErr();y=toA(y)
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
    switch(4*negInt(k)+2*negInt(n)+negInt(n-k)){                        // 𝕨 𝕩 𝕩-𝕨
      case 0:r=Math.exp(lnΓ(n+1)-lnΓ(k+1)-lnΓ(n-k+1))            ;break // 0 0 0   (!𝕩)÷(!𝕨)×!𝕩-𝕨
      case 1:r=0                                                 ;break // 0 0 1   0
      case 2:r=domErr()                                          ;break // 0 1 0   domain error
      case 3:r=Math.pow(-1,k)*Beta(k,k-n-1)                      ;break // 0 1 1   (¯1*𝕨)×𝕨!𝕨-𝕩+1
      case 4:r=0                                                 ;break // 1 0 0   0
      case 5:asrt(0)                                             ;break // 1 0 1   cannot arise
      case 6:r=Math.pow(-1,n-k)*Beta(Math.abs(n+1),Math.abs(k+1));break // 1 1 0   (¯1*𝕩-𝕨)×(|𝕩+1)!(|𝕨+1)
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
      r[p]&=match(x.a[k],y.a[q])
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
voc._atop=voc['∘']
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
  if(!x.a.length)return['[]']
  // {t:type(0=chr,1=num,2=nst),w:width,h:height,rm:rightMargin,bm:bottomMargin,al:align(0=lft,1=rgt)}
  const nr=prd(x.s.slice(0,-1)),nc=x.s.length?x.s[x.s.length-1]:1,rows=Array(nr),cols=Array(nc)
  for(let i=0;i<nr;i++)rows[i]={h:0,bm:0};for(let i=0;i<nc;i++)cols[i]={t:0,w:0,rm:0}
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
  for(let j=0;j<nc;j++){const c=cols[j];if(j<nc-1&&(c.t!==cols[j+1].t||c.t))c.rm++}
  const a=[] // result
  for(let i=0;i<nr;i++){
    const r=rows[i]
    for(let j=0;j<nc;j++){
      const c=cols[j],t=g[i][j],d=c.w-t[0].length,lft=' '.repeat(!!t.al*d),rgt=' '.repeat(c.rm+ !t.al*d)
      for(let k=0;k<t.length;k++)t[k]=lft+t[k]+rgt
      const btm=' '.repeat(t[0].length);for(let h=r.h+r.bm-t.length;h>0;h--)t.push(btm)
    }
    const nk=r.h+r.bm;for(let k=0;k<nk;k++){let s='';for(let j=0;j<nc;j++)s+=g[i][j][k];a.push('  '+s+'  ')}
  }
  if(a.length===1)return ['['+a[0].slice(1,-1)+']']
  const ws=' '.repeat(a[0].length-1);a.unshift('┌'+ws);a.push(ws+'┘')
  return a
}
voc['⍋']=(y,x)=>grd(y,x,1)
voc['⍒']=(y,x)=>grd(y,x,-1)
const grd=(y,x,dir)=>{
  const tao_cmp=(a,b)=>{ // like ×∘-
    if(a.isA||b.isA){
      const em=x=>x.isA&&x.a.length===0?1:0,ae=em(a),be=em(b);if(ae!==be)return be-ae
      if(!a.isA)return tao_cmp(a,b.a[0])||-1;if(!b.isA)return tao_cmp(a.a[0],b)||1
      return tao_getcc(a.s,b.s)(a.a,0,b.a,0)
    }else{
      const ta=typeof a,tb=typeof b
      ta==='function'||tb==='function'&&domErr()
      const ca=ta==='string'?1:0,cb=tb==='string'?1:0
      if(ca!==cb)return ca-cb
      if(ca||(ta==='number'&&tb==='number'))return a!==b?(a<b?-1:1):0
      a=Zify(a);b=Zify(b)
      return a.re!==b.re?(a.re<b.re?-1:1):
             a.im!==b.im?(a.im<b.im?-1:1):0
    }
  }
  const vec_cmp=(u,i,v,j,l)=>{
    for(let k=0;k<l;k++){let c=tao_cmp(u[i+k],v[j+k]);if(c)return c}return 0
  }
  const tao_getcc=(as,bs)=>{
      let r=as.length,s=bs.length,c=0
      if(r!==s){if(r<s){c=-1;bs=bs.slice(s-r)}else{c=1;as=as.slice(r-s);r=s}}
      let l=1;while(r--){const m=as[r],n=bs[r];l*=Math.min(m,n);if(m!==n){c=m<n?-1:1;break}}
      return(u,i,v,j)=>vec_cmp(u,i,v,j,l)||c
  }
  if(!has(x)){
    y.isA&&y.s.length||rnkErr()
    let r=[];for(let i=0;i<y.s[0];i++)r.push(i)
    const l=prd(y.s.slice(1))
    return A(r.sort((i,j)=>dir*vec_cmp(y.a,i*l,y.a,j*l,l)||(i>j)-(i<j)))
  }else{
    y=toA(y);let yr=y.s.length,xr;x.isA&&(xr=x.s.length)>0&&yr>=xr-1||rnkErr()
    const rr=yr-xr+1,xc=x.s.slice(1),c=prd(xc),yc=y.s.slice(rr),d=prd(yc),s=y.s.slice(0,rr),n=prd(s)
    for(let i=0;i<x.s[0]-1;i++)dir*vec_cmp(x.a,i*c,x.a,(i+1)*c,c)<=0||domErr()
    if((c===0)!==(d===0))return A(rpt([(dir<0?d:c)?0:x.s[0]],n),s)
    let r=Array(n),cmp=tao_getcc(xc,yc)
    for(let j=0,k=0;j<y.a.length;j+=d,k++){
      let i=-1;for(let l=x.s[0]+1,h;h=l>>1;l-=h){let m=i+h;if(dir*cmp(x.a,m*c,y.a,j)<=0)i=m}r[k]=i+1
    }
    return A(r,s)
  }
}
voc['↕']=(y,x)=>{
  if(has(x)){
    y.isA||domErr();const w=Array.from(getVec(x)),a=w.length
    a<=y.s.length||rnkErr();if(!a)return y
    for(let i=0;i<w.length;i++)isInt(w[i])||domErr()
    for(let i=0;i<y.s.length;i++)w[i]<=y.s[i]+1||lenErr()
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
  has(x)||synErr()
  y.isA||domErr();let yr=y.s.length,xr;x.isA&&(xr=x.s.length)>0&&yr>=xr-1||rnkErr()
  const rr=yr-xr+1,xc=x.s.slice(1),c=prd(xc),yc=y.s.slice(rr),s=y.s.slice(0,rr),n=prd(s)
  for(let i=0;i<xr-1;i++)if(xc[i]!==yc[i])return A(rpt([x.s[0]],n),s)
  const m=x.s[0],r=new Float64Array(n)
  for(let i=0;i<n;i++){r[i]=m;for(let j=0;j<m;j++)if(vec_match(y.a,i*c,x.a,j*c,c)){r[i]=j;break}}
  return A(r,s)
}
voc['⊔']=(y,x)=>{
  const k=has(x)?x:y
  k.isA&&k.s.length||rnkErr()
  let r=[],n=k.s[0],c=prd(k.s.slice(1))
  for(let i=0,j;i<n;i++){
    for(j=0;j<r.length;j++)if(vec_match(k.a,i*c,k.a,r[j][0]*c,c)){r[j].push(i);break}
    if(j===r.length)r.push([i])
  }
  if(!has(x))return A(r.map(e=>A(e)))
  y.isA&&y.s.length||rnkErr();y.s[0]===n||lenErr()
  let cs=y.s.slice(1);c=prd(cs)
  return A(r.map(a=>{
    let r=Array(a.length*c)
    for(let i=0;i<a.length;i++)for(let j=0;j<c;j++)r[i*c+j]=y.a[a[i]*c+j]
    return A(r,[a.length].concat(cs))
  }))
}
voc['⍟']=(g,f)=>(y,x)=>{
  typeof f==='function'||domErr()
  let n=toInt(toF(g)(y,x))
  if(n<0){f=voc['⁼'](f);n=-n}
  for(let i=0;i<n;i++)y=f(y,x);return y
}
voc['get_•']=cps((_,_1,_2,cb)=>{
  if(typeof window!=='undefined'&&typeof window.prompt==='function'){setTimeout(_=>{cb(A(prompt('')||''))},0)}
  else{readline('',x=>cb(A(x)))}
})
voc['set_•']=x=>{
  let s=fmt(x).join('\n')+'\n'
  if(typeof window!=='undefined'&&typeof window.alert==='function'){window.alert(s)}else{process.stdout.write(s)}
  return x
}
voc['•dl']=cps((y,x,_,cb)=>{let t0=+new Date;setTimeout(_=>{cb(A([new Date-t0]))},unw(y))})
voc['•re']=(y,x)=>{
  x=str(x),y=str(y)
  let re;try{re=RegExp(x)}catch(e){domErr()}
  let m=re.exec(y);if(!m)return A.zld
  let r=[m.index];for(let i=0;i<m.length;i++)r.push(A(m[i]||''))
  return A(r)
}
voc['•ucs']=(y,x)=>{
  x&&nyiErr()
  const f=u=>u.isA?each(f)(u):isInt(u,0,0x10000)?String.fromCharCode(u):typeof u==='string'?u.charCodeAt(0):domErr()
  return f(y)
}
voc['get_•off']=_=>{typeof process==='undefined'&&nyiErr();process.exit(0)}
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
  if(has(x)){
    let v=getVec(x).slice();v.length<=(y.isA?y.s.length:0)||rnkErr()
    const mod=(s,n)=>{let m=s%n;return m<0?m+n:m}
    let l=0;for(let i=0;i<v.length;i++){isInt(v[i])||domErr();if(v[i]=mod(v[i],y.s[i]))l=i+1}
    if(!l||!y.a.length)return y;v=v.slice(0,l)
    let c=prd(y.s.slice(v.length)),d=Array(v.length),n=c,p=0
    for(let a=v.length;a--;){d[a]=n;p+=n*v[a];n*=y.s[a];v[a]=y.s[a]-v[a]-1}
    let r=Array(n),i=rpt([0],d.length)
    for(let j=0;j<n;j+=c){
      for(let k=0;k<c;k++)r[j+k]=y.a[p+k]
      for(let a=i.length;a--;){p+=d[a];if(i[a]===v[a])p-=y.s[a]*d[a];if(++i[a]===y.s[a])i[a]=0;else break}
    }
    return A(r,y.s)
  }else{
    y.isA&&y.s.length||rnkErr()
    const nj=y.s[0],nk=prd(y.s.slice(1)),r=Array(nj*nk)
    for(let j=0;j<nj;j++)for(let k=0;k<nk;k++)r[j*nk+k]=y.a[(nj-1-j)*nk+k]
    return A(r,y.s)
  }
}
voc['´']=f=>(y,x)=>{
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
}
voc['⍁']=(x,f)=>{
  typeof f==='function'||domErr()
  return withId(x,(y,x)=>f(y,x))
}
/*
voc['`']=f=>(y,x)=>{
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
}
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
voc['/'].inverse=(y,x)=>{
  if(has(x)){
    y.isA&&y.s.length||domErr;const xa=getVec(x),n=y.s[0]
    let l=xa.length,m=0;for(let i=0;i<l;i++){const u=xa[i];isInt(u,0)||domErr();m+=u}
    m===n||domErr()
    const c=prd(y.s.slice(1))
    let r=Array(l*c);m=0;const pr=getProt(y)
    for(let i=0;i<l;i++){
      const u=xa[i]
      if(!u){for(let k=0;k<c;k++)r[i*c+k]=pr}
      else{
        const e=m+c*u
        for(let k=0;k<c;k++)r[i*c+k]=y.a[m+k];m+=c
        for(;m<e;m+=c)vec_match(r,i*c,y.a,m,c)||domErr()
      }
    }
    return A(r,[l].concat(y.s.slice(1)))
  }else{
    const a=getVec(y)
    let e=0;for(let i=0;i<a.length;i++){const u=a[i];isInt(u,e)||domErr();e=u}
    let r=new Float64Array(e+1);for(let i=0;i<a.length;i++)r[a[i]]++
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
  for(let i=0;i<t.length;i++)isInt(t[i])||domErr()
  let ys=rpt([1],Math.max(0,t.length-y.s.length)).concat(y.s)
  let s=ys.slice();for(let i=0;i<t.length;i++)s[i]=Math.abs(t[i])
  let d=Array(s.length);d[d.length-1]=1
  for(let i=d.length-1;i>0;i--)d[i-1]=d[i]*s[i]
  let r=rpt([getProt(y)],prd(s))
  let cs=s.slice(),p=0,q=0,xd=strides(ys) // cs:shape to copy
  for(let i=0;i<t.length;i++){
    let u=t[i];cs[i]=Math.min(ys[i],Math.abs(u))
    if(u<0){if(u<-ys[i]){q-=(u+ys[i])*d[i]}else{p+=(u+ys[i])*xd[i]}}
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
const rotAxes=(y,l,m)=>{
  const sh=[y.s.slice(0,l),y.s.slice(l,m),y.s.slice(m)]
  const a=prd(sh[0]),b=prd(sh[1]),c=prd(sh[2])
  let r=Array(y.a.length)
  for(let i=0;i<a*c;i+=c)for(let j=0;j<b*c;j+=c)for(let k=0;k<c;k++)r[i+j*a+k]=y.a[i*b+j+k]
  return A(r,sh[1].concat(sh[0],sh[2]))
}
voc['⍉']=(y,x,inv)=>{
  y=toA(y);const yr=y.s.length;if(yr===0){has(x)&&getVec(x).length&&rnkErr();return y}
  if(!has(x))return rotAxes(y,inv?yr-1:1,yr)
  if(!x.isA){isInt(x,0)||domErr();x<yr||rnkErr();return x?rotAxes(y,1,x+1):y}
  let a=getVec(x),t=[],diag=[];a.length<=yr||rnkErr()
  let k=0;for(;k<a.length;k++){
    let x=a[k];isInt(x,0)||domErr();x<yr||rnkErr()
    if(t[x]==null){t[x]=k}else{inv&&domErr();diag.push(k)}
  }
  let l=0;while(1){while(t[l]!=null)l++;if(k>=yr)break;t[l++]=k++}
  l===t.length||rnkErr()
  if(inv){const t0=t.slice();for(let i=0;i<t.length;i++)t[t0[i]]=i}
  let s=t.map(i=>y.s[i]),d0=strides(y.s),d=t.map(i=>d0[i])
  diag.forEach(k=>{x=a[k];s[x]=Math.min(s[x],y.s[k]);d[x]+=d0[k]})
  let n=prd(s),r=Array(n),j=new Int32Array(s.length),p=0
  for(let i=0;i<n;i++){
    r[i]=y.a[p]
    let u=l-1;while(u>=0&&j[u]+1===s[u]){p-=j[u]*d[u];j[u--]=0}
    if(u<0)break
    j[u]++;p+=d[u]
  }
  return A(r,s)
}
voc['⍠']=(f,g)=>(y,x)=>(has(x)?f:g)(y,x)

voc['⁼']=f=>f.inverse||domErr()
voc['+'].inverse=voc['⍠'](voc['˜'](voc['-']),voc['+'])
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
voc['<'].inverse=(y,x)=>has(x)||!y.isA||y.s.length?domErr():y.a[0]
voc['⌽'].inverse=(y,x)=>voc['⌽'](y,has(x)?voc['-'](x):undefined)
voc['⍉'].inverse=(y,x)=>voc['⍉'](y,x,1)

const NOUN=1,VRB=2,ADV=3,CNJ=4
,exec=(s,o={})=>{
  const t=prs(s,o),b=compile(t,o),e=[preludeData.env[0].slice()] // t:ast,b:bytecode,e:env
  for(let k in t.v)e[0][t.v[k].i]=o.ctx[k]
  const r=vm(b,e)
  for(let k in t.v)o.ctx[k]=e[0][t.v[k].i]
  return r
}
,repr=x=>x===null||['string','number','boolean'].indexOf(typeof x)>=0?JSON.stringify(x):
         x instanceof Array?'['+x.map(repr).join(',')+']':
         x.repr?x.repr():'{'+Object.keys(x).map(k=>repr(k)+':'+repr(x[k])).join(',')+'}'
,compile=(ast,o={})=>{
  ast.d=0;ast.n=preludeData?preludeData.n:0;ast.v=preludeData?Object.create(preludeData.v):{} // n:nSlots,d:scopeDepth,v:vars
  o.ctx=o.ctx||Object.create(voc)
  for(let key in o.ctx)if(!ast.v[key]){ // VarInfo{i:slot,d:scopeDepth}
    const u=o.ctx[key],v=ast.v[key]={i:ast.n++,d:ast.d}
  }
  const synErrAt=x=>{synErr({file:o.file,offset:x.offset,aplCode:o.aplCode})}
  const q=[ast] // queue for "body" nodes
  while(q.length){
    const scp=q.shift() // scp:scope node
    ,vst=x=>{
      x.scp=scp
      switch(x[0]){default:asrt(0)
        case':':vst(x[1]);vst(x[2]);break
        case'←':case'↩':vst(x[2]);if(x[3])vst(x[3]);vstLHS(x[1],x[0]==='←');break
        case'X':if(!(scp.v['get_'+x[1]]||scp.v[x[1]]))valErr({file:o.file,offset:x.offset,aplCode:o.aplCode});break
        case'S':case'N':case'J':break
        case'V':case'M':case'D':case'A':case'C':case'T':for(let i=x.length;i-->1;)vst(x[i]);break
        case'{':{
          const c=x.g&(1<<CNJ)?1:0,o=c||(x.g&(1<<ADV))?1:0
          for(let i=1;i<x.length;i++){
            const d=scp.d+1+o // slot 3 is reserved for a "base pointer"
            ,v=Object.create(scp.v),arg=(l,u,i,d)=>{v[l]=v[u]={i,d}}
            arg('𝕩','𝕏',0,d);v['∇']={i:1,d};arg('𝕨','𝕎',2,d);v['→']={d}

            q.push(extend(x[i],{scp,d,n:4,v}))
            if(o){if(c)arg('𝕘','𝔾',0,d-1);v['∇∇']={i:1,d:d-1};arg('𝕗','𝔽',2*c,d-1)}
          }
          break
        }
      }
    }
    ,vstLHS=(x,d)=>{ // d:declaration
      x.scp=scp
      switch(x[0]){default:asrt(0)
        case'X':const s=x[1];if(d){!scp.v[s]||synErrAt(x);scp.v[s]={d:scp.d,i:scp.n++}}else{scp.v[s]||synErrAt(x)};break
        case'V':for(let i=1;i<x.length;i++)vstLHS(x[i],d);break
      }
    }
    for(let i=1;i<scp.length;i++)vst(scp[i])
  }
  const rndr=x=>{switch(x[0]){default:asrt(0)
    case'B':{if(x.length===1)return[LDC,A.zld,RET]
             const a=[];for(let i=1;i<x.length;i++){a.push.apply(a,rndr(x[i]));a.push(POP)}
             a[a.length-1]=RET;return a}
    case':':{const r=rndr(x[1]),y=rndr(x[2]);return r.concat(JEQ,y.length+2,POP,y,RET)}
    case'↩':if(x[3])return rndr(x[2]).concat(rndr(x[3]),rndr(x[1]),DYA).concat(rndrLHS(x[1])) // modified
    case'←':return rndr(x[2]).concat(rndrLHS(x[1]))
    case'X':{const s=x[1],vars=x.scp.v,v=vars['get_'+s]
             return s==='→'?[CON]:v?[LDC,0,GET,v.d,v.i,MON]:[GET,vars[s].d,vars[s].i]}
    case'{':{const r=rndr(x[1]),lx=[LAM,r.length].concat(r);let f
             if(x.length===2){f=lx}
             else if(x.length===3){let y=rndr(x[2]),ly=[LAM,y.length].concat(y),v=x.scp.v['⍠']
                                   f=ly.concat(GET,v.d,v.i,lx,DYA)}
             else{synErrAt(x)}
             return !((x.g&(1<<ADV|1<<CNJ))&&(x.g&(1<<VRB)))?f:[LAM,f.length+1].concat(f,RET)}
    case'S':{const o=x[1].slice(0,1),s=x[1].slice(1,-1).replace(o+o,o);if(o==="'"){s.length===1||synErrAt(x);return[LDC,s]}else return[LDC,A(s.split(''))]}
    case'N':{const a=x[1].replace(/¯/g,'-').split(/j/i).map(x=>x==='∞'?Infinity:x==='-∞'?-Infinity:parseFloat(x))
             return[LDC,a[1]?new Z(a[0],a[1]):a[0]]}
    case'J':{const f=Function('return(_w,_a)=>('+x[1].replace(/^«|»$/g,'')+')')();return[EMB,(_w,_a)=>aplify(f(_w,_a))]}
    case'V':{const frags=[];let allConst=1
             for(let i=1;i<x.length;i++){const f=rndr(x[i]);frags.push(f);if(f.length!==2||f[0]!==LDC)allConst=0}
             return allConst?[LDC,A(frags.map(f=>f[1]))]
                            :[].concat.apply([],frags).concat([VEC,x.length-1])}
    case'M':return rndr(x[2]).concat(rndr(x[1]),MON)
    case'A':return rndr(x[1]).concat(rndr(x[2]),MON)
    case'D':case'C':return rndr(x[3]).concat(rndr(x[2]),rndr(x[1]),DYA)
    case'T':{const u=x.scp.v._atop,v=x.scp.v._fork1,w=x.scp.v._fork2;let i=x.length-1,r=rndr(x[i--])
             while(i>=2)r=r.concat(GET,v.d,v.i,rndr(x[i--]),DYA,GET,w.d,w.i,rndr(x[i--]),DYA)
             return i?r.concat(GET,u.d,u.i,rndr(x[1]),DYA):r}
  }}
  const rndrLHS=x=>{switch(x[0]){default:asrt(0)
    case'X':{const s=x[1],vars=x.scp.v,v=vars['set_'+s];return v?[GET,v.d,v.i,MON]:[SET,vars[s].d,vars[s].i]}
    case'V':{const n=x.length-1,a=[SPL,n];for(let i=1;i<x.length;i++){a.push.apply(a,rndrLHS(x[i]));a.push(POP)};return a}
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
