import { createRequire } from 'node:module'

const pkg = createRequire(import.meta.url)('../package.json')

const owned = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]

export const external = (id) => owned.some((name) => id === name || id.startsWith(`${name}/`))
export const externalNames = owned
