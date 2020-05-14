;(_=>{
let hc={'<':'&lt;','&':'&amp;',"'":'&apos;','"':'&quot;'},he=x=>x.replace(/[<&'"]/g,c=>hc[c]) //html chars and escape fn
,tcs='<-←xx×:-÷*o⍟[-⌹oo○ff⌈FF⌈ll⌊LL⌊tt⊥TT⊤-|⊣|-⊢~~≈=/≠<=≤>=≥==≡=-≢vv∨^^∧^~⍲v~⍱^|↑v|↓<<⊂>>⊃[|⌷A|⍋V|⍒ii⍳ee∊e-⍷'+
'uu∪nn∩/-⌿\\-⍀,-⍪rr⍴pp⍴o|⌽o-⊖o\\⍉..¨~:⍨*:⍣o.∘[\'⍞[]⎕[:⍠[=⌸ot⍎oT⍕<>⋄on⍝aa⍺ww⍵a-⍶w-⍹VV∇--¯88∞0~⍬V~⍫//↗[/⍁'
,lbs=`←assign_+conjugate;add_-negate;subtract_×signum;multiply_÷reciprocal;divide_⋆exp;power_√sqrt;root
∨or_∧and_¬not;span_⌈ceiling;max_⌊floor;min_|magnitude;residue_!factorial;binomial_?roll;deal
=equals_≠count;not equals_≤lesser or equal to_<box;less than_>mix;greater than_≥greater or equal to
≡depth;match_≢shape;not match_⊣left_⊢right_⥊deshape;reshape_∾join_≍itemize;laminate
↑prefixes;take_↓suffixes;drop_↕range;windows_⌽reverse;rotate_⍉transpose;reorder axes
/indices;replicate_\\partition_⊏first cell;select_⊑first;pick_⊐index of_⊒progressive index of
⍋grade up_⍒grade down_∊flatten;member of_⍷find_∪unique_⊥decode_⊤encode_⍎execute_⍕format
¨each_˘cells_⁼inverse_⌜table_´reduce_⚇depth_⎉rank_⍟power operator_˜self;swap_∘atop_○over_⌾under_⊸before_⟜after
•system;stdin/stdout_⍠combine monadic-dyadic fns_⍁identity element operator
¯negative_∞infinity_πpi_⍬empty numeric vector_⟨start list_⟩end list_‿strand_⦃start set_⦄end set
⋄statement separator_⍝comment_𝕨left argument_𝕩right argument_𝔽left operand_𝔾right operand_∇recursion
→"return" reified as a function_↗throw`.split(/[\n_]/)
,bqk=           '`1234567890-=~!@#$%^&*()_+qwertyuiop[]QWERTYUIOP{}asdfghjkl;\'\\ASDFGHJKL:"|zxcvbnm,./ZXCVBNM<>?'
,bqv=Array.from('˜¨˘⁼⌜´•¯∞∨∧÷×¬⚇⎉⍟$%^&*⟨⟩√⋆⌽𝕨∊⊏⊐↑↓↕⊣⊢←→Q𝕎⍷⊑⊒⍋⍒IOπ⦃⦄⍉⌈⌊𝕗𝕘⊸∘○⟜⋄⍝⌾  ASD𝔽𝔾HJKL:"|⥊𝕩⊂⊃⊥⊤≡∾≍‿Z𝕏⊆⊇⍎⍕≢≤≥≠'.replace(/ /g,''))
,tc={},bqc={} //tab completions and ` completions
for(let i=0;i<bqk.length;i++)bqc[bqk[i]]=bqv[i]
for(let i=0;i<tcs.length;i+=3)tc[tcs[i]+tcs[i+1]]=tcs[i+2]
for(let i=0;i<tcs.length;i+=3){let k=tcs[i+1]+tcs[i];tc[k]=tc[k]||tcs[i+2]}
let lbh='';for(let i=0;i<lbs.length;i++){
  const l=lbs[i],c=Array.from(l)[0];let ks=[]
  for(let j=0;j<tcs.length;j+=3)if(c===tcs[j+2])ks.push('\n'+tcs[j]+' '+tcs[j+1]+' <tab>')
  for(let j=0;j<bqk.length;j++)if(c===bqv[j])ks.push('\n` '+bqk[j])
  lbh+='<b title="'+he(l.slice(c.length).replace(';','\n'))+(ks.length?'\n'+ks.join(''):'')+'">'+c+'</b>'
}
let d=document,el=d.createElement('div');el.innerHTML=
`<div class=ngn_lb><span class=ngn_x title="Hide language bar">❎</span>${lbh}</div>
 <style>@font-face{font-family:"DejaVu Mod";url(DejaMod.ttf)format('truetype');}</style>
 <style>
  .ngn_lb{position:fixed;top:0;left:0;right:0;background-color:#eee;color:#000;cursor:default;z-index:2147483647;
    font-family:"DejaVu Mod",monospace;border-bottom:solid #ccc 1px;padding:0 4px;word-wrap:break-word}
  .ngn_lb b{cursor:pointer;padding:0 1px;font-weight:normal;float:left}
  .ngn_lb b:hover{background-color:#008;color:#fff}
  .ngn_bq .ngn_lb{color:#c00}
  .ngn_x{float:right;color:#888;cursor:pointer}
  .ngn_x:hover{color:#f00}
 </style>`
d.body.appendChild(el)
let t,ts=[],lb=el.firstChild,bqm=0 //t:textarea or input, lb:language bar, bqm:backquote mode
let pd=x=>x.preventDefault()
let ev=(x,t,f,c)=>x.addEventListener(t,f,c)
ev(lb,'mousedown',x=>{
  if(x.target.classList.contains('ngn_x')){lb.hidden=1;upd();pd(x);return}
  if(x.target.nodeName==='B'&&t){
    let i=t.selectionStart,j=t.selectionEnd,v=t.value,s=x.target.textContent
    if(i!=null&&j!=null){t.value=v.slice(0,i)+s+v.slice(j);t.selectionStart=t.selectionEnd=i+s.length}
    pd(x);return
  }
})
let fk=x=>{
  let t=x.target
  if(bqm){let i=t.selectionStart,v=t.value,c=bqc[x.key];if(x.which>31){bqm=0;d.body.classList.remove('ngn_bq')}
          if(c){t.value=v.slice(0,i)+c+v.slice(i);t.selectionStart=t.selectionEnd=i+c.length;pd(x);return!1}}
  switch(x.ctrlKey+2*x.shiftKey+4*x.altKey+8*x.metaKey+100*x.which){
    case 19200:bqm=1;d.body.classList.add('ngn_bq');pd(x);break //`
    case   900:{let i=t.selectionStart,v=t.value,c=tc[v.slice(i-2,i)] //tab
                if(c){t.value=v.slice(0,i-2)+c+v.slice(i);t.selectionStart=t.selectionEnd=i-1;pd(x)}
                break}
  }
}
let ff=x=>{
  let t0=x.target,nn=t0.nodeName.toLowerCase()
  if(nn!=='textarea'&&(nn!=='input'||t0.type!=='text'&&t0.type!=='search'))return
  t=t0;if(!t.ngn){t.ngn=1;ts.push(t);ev(t,'keydown',fk)}
}
let upd=_=>{d.body.style.marginTop=lb.clientHeight+'px'}
upd();ev(window,'resize',upd)
ev(d,'focus',ff,!0);let ae=d.activeElement;ae&&ff({type:'focus',target:ae})
})();
