import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const projectDir = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: join(projectDir, "..")
}

export default nextConfig
