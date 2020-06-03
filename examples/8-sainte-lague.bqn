#!/usr/bin/env apl

⍝ Sainte-Laguë method for allocating seats in an election
⍝ http://leahneukirchen.org/blog/archive/2020/03/determining-an-election-in-k.html

SL←{+´𝕨>⍋∘⍒⌾⥊⍉𝕩÷⌜.5+↕𝕨}
•←15 SL 10400‿3400‿6200
