import copy from 'copy-to-clipboard'
import styles from './code.module.scss'
import { CopyIcon } from '../icons'

const theme = {
  plain: {
    color: 'var(--gray12)',
    fontSize: 12,
    fontFamily: 'Menlo, monospace',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: 'var(--gray9)',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: 'var(--gray10)',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: 'var(--gray9)',
      },
    },
    {
      types: ['class-name', 'function', 'tag'],
      style: {
        color: 'var(--gray12)',
      },
    },
  ],
}

export function Code(props: { children: string }) {
  return (
    <pre class={styles.root}>
      <button
        aria-label="Copy Code"
        onClick={() => {
          copy(props.children)
        }}
      >
        <CopyIcon />
      </button>
      <div class={styles.shine} />
      <div>{props.children}</div>
      {/*tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={i} {...getTokenProps({ token, key })} />
              ))}
            </div>
              ))*/}
    </pre>
  )
}
