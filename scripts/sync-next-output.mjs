import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = process.cwd()
const sourceDir = resolve(repoRoot, "llm-partnerships", ".next")
const targetDir = resolve(repoRoot, ".next")

if (!existsSync(sourceDir)) {
  console.error(`Source Next output not found: ${sourceDir}`)
  process.exit(1)
}

if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true })
}

mkdirSync(targetDir, { recursive: true })
cpSync(sourceDir, targetDir, { recursive: true })

console.log(`Synced Next output from ${sourceDir} to ${targetDir}`)
