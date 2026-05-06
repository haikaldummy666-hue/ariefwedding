import crypto from 'node:crypto'

// Polyfill for crypto.hash which is missing in Node.js < 21.7.0
if (!crypto.hash) {
  // @ts-ignore
  crypto.hash = (algorithm, data, outputEncoding = 'hex') => {
    return crypto.createHash(algorithm).update(data).digest(outputEncoding);
  };
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
})
