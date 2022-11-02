import { defineConfig } from "vite"

export default defineConfig({
  server: {
    headers: {
      // 这两个头部保证ffmpeg.wasm可以正确加载
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
