import {parser} from "@lezer/rust"
import {continuedIndent, indentNodeProp, foldNodeProp, foldInside, LRLanguage, LanguageSupport} from "@codemirror/language"

/// A syntax provider based on the [Lezer Rust
/// parser](https://github.com/lezer-parser/rust), extended with
/// highlighting and indentation information.
export const rustLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfExpression: continuedIndent({except: /^\s*({|else\b)/}),
        "String BlockComment": () => null,
        "AttributeItem": cx => cx.continue(),
        "Statement MatchArm": continuedIndent()
      }),
      foldNodeProp.add(type => {
        if (/(Block|edTokens|List)$/.test(type.name)) return foldInside
        if (type.name == "BlockComment") return tree => ({from: tree.from + 2, to: tree.to - 2})
        return undefined
      })
    ]
  }),
  languageData: {
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:\{|\})$/,
    closeBrackets: {stringPrefixes: ["b", "r", "br"]}
  }
})

/// Rust language support
export function rust() {
  return new LanguageSupport(rustLanguage)
}
