import {splitEmphasis} from '@/lib/format'

/** Renders a heading string where *starred* words are set in the wonky italic display face */
export default function Emphasis({text, emClassName = ''}: {text?: string | null; emClassName?: string}) {
  return (
    <>
      {splitEmphasis(text).map((part, i) =>
        part.em ? (
          <em key={i} className={`font-wonk italic ${emClassName}`}>
            {part.text}
          </em>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  )
}
