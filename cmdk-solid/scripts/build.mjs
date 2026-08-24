import { execFile, execFileSync } from 'node:child_process'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as esbuild from 'esbuild'
import { build as viteBuild } from 'vite'

import { externalNames } from './external.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const tscBin = resolve(root, 'node_modules/.bin/tsc')
const watch = process.argv.includes('--watch')

const jsxPassthrough = {
  entryPoints: [resolve(root, 'src/index.tsx')],
  outfile: resolve(dist, 'index.jsx'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
  jsx: 'preserve',
  external: externalNames.flatMap((name) => [name, `${name}/*`]),
  sourcemap: true,
}

async function copyCtsDeclarations() {
  await Promise.all(
    ['index', 'command-score'].map((name) =>
      copyFile(resolve(dist, `${name}.d.ts`), resolve(dist, `${name}.d.cts`)),
    ),
  )
}

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

if (watch) {
  const ctx = await esbuild.context(jsxPassthrough)
  await ctx.watch()
  execFile(tscBin, ['-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'], { cwd: root })
  await viteBuild({ build: { watch: {} } })
} else {
  await viteBuild()
  await esbuild.build(jsxPassthrough)
  execFileSync(tscBin, ['-p', 'tsconfig.build.json'], { cwd: root, stdio: 'inherit' })
  await copyCtsDeclarations()
  console.log('\nbuilt index.js (esm) · index.cjs (cjs) · index.jsx (solid) · declarations')
}
