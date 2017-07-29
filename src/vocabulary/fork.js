addVoc({
  // Fork: `(fgh)⍵ ← → (f⍵)g(h⍵)` ; `⍺(fgh)⍵ ← → (⍺f⍵)g(⍺h⍵)`
  //
  // (+/÷⍴)4 5 10 7 ←→ ,6.5
  //
  // a←1 ⋄ b←¯22 ⋄ c←85
  // ... √←{⍵*.5}
  // ... ((-b)(+,-)√(b*2)-4×a×c)÷2×a
  // ... ←→ 17 5
  //
  // (+,-,×,÷)2  ←→ 2 ¯2 1 .5
  // 1(+,-,×,÷)2 ←→ 3 ¯1 2 .5
  _fork1:(h,g)=>{
    asrt(typeof h==='function')
    asrt(typeof g==='function')
    return[h,g]
  },
  _fork2:(hg,f)=>{
    var h=hg[0],g=hg[1]
    asrt(typeof h==='function')
    return(b,a)=>g(h(b,a),f(b,a))
  }
})