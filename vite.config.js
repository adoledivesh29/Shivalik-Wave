import { defineConfig } from 'vite'
import glslify from 'rollup-plugin-glslify'
import * as path from 'path'

export default defineConfig({
  root: 'src',
  base: './', // for Github pages, otherwise use './'
  build: {
    outDir: '../dist',
  },
  server: {
    port: 2001,
    host: true, // to test on other devices with IP address
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [glslify()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.exr']
})
