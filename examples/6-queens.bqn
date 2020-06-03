#!/usr/bin/env apl

Queens←{                            ⍝ The N-queens problem.

    Search←{                        ⍝ Search for all solutions.
        (<⍬)∊𝕩:0⥊<⍬                 ⍝ stitched: abandon this branch.
        0=≠𝕩:Rmdups 𝕨               ⍝ all done: solution!
        hd‿tl←⟨⊑𝕩⋄1↓𝕩⟩              ⍝ head 'n tail of remaining ranks.
        next←𝕨⊸∾¨hd                 ⍝ possible next steps.
        rems←hd Free¨<tl            ⍝ unchecked squares.
        ∾next ∇¨rems                ⍝ ... in following ranks.
    }

    cvex←(1+↕𝕩)×<¯1‿0‿1             ⍝ Checking vectors.

    Free←{𝕩(¬∘∊/⊣)¨𝕨+𝕩≢⊸↑cvex}      ⍝ Unchecked squares.

    Rmdups←{                        ⍝ Ignore duplicate solution.
        Rots←(↕4){⍒⍟𝕨 𝕩}¨<          ⍝ 4 rotations.
        Refs←(↕2){⍋⍟𝕨 𝕩}¨<          ⍝ 2 reflections.
        Best←(⊑⍋)⊸⊑                 ⍝ best (=lowest) solution.
        all8←⥊>Refs¨Rots 𝕩          ⍝ all 8 orientations.
        (𝕩≡Best all8)⊑⟨⍬⋄⥊<𝕩⟩       ⍝ ignore if not best.
    }

    Fmt←{                           ⍝ Format solution.
        chars←"·⍟"⊏˜(>𝕩)=⌜↕𝕨        ⍝ char array of placed queens.
        expd←1↓∾𝕨⥊<0‿1              ⍝ expansion mask.
        <⎉2 expd /⁼⎉1 chars         ⍝ vector of char matrices.
    }

    squares←(<↕⌈𝕩÷2)∾1↓𝕩⥊<↕𝕩        ⍝ initial squares

    𝕩 Fmt ⍬ Search squares          ⍝ all distinct solutions.
}

•←Queens 5
