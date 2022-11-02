import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import component from "unplugin-vue-components/vite"
import {
  PrimeVueResolver
} from "unplugin-vue-components/resolvers"
import unocss from "unocss/vite"

export default defineConfig({
  plugins: [
    vue(),
    component({
      resolvers: [
        PrimeVueResolver()
      ],
      dts: true,
    }),
    unocss()
  ],
  server: {
    headers: {
      // 这两个头部保证ffmpeg.wasm可以正确加载
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
