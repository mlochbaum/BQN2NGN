#!/usr/bin/env apl

⍝ Sierpinski's triangle
F←{(𝕩∾˘𝕩≢⊸⥊0)∾𝕩∾˘𝕩}
S←{" #"⊏˜(F⍟𝕩)1‿1⥊1}
•←S 5
