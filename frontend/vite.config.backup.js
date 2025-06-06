import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '')
  
  // Determine if this is production mode
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Server configuration
    server: {
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 5173,
      host: env.VITE_DEV_SERVER_HOST === 'true' || true,
      open: env.VITE_DEV_SERVER_OPEN === 'true' || false,
      https: env.VITE_DEV_SERVER_HTTPS === 'true' || false,
      strictPort: env.VITE_DEV_SERVER_STRICT_PORT === 'true' || false,
    },
    
    // Preview server configuration (for production preview)
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT) || 4173,
      host: env.VITE_PREVIEW_HOST === 'true' || true,
      https: env.VITE_PREVIEW_HTTPS === 'true' || false,
    },
    
    // Build configuration
    build: {
      outDir: env.VITE_BUILD_OUTPUT_DIR || 'dist',
      assetsDir: env.VITE_BUILD_ASSETS_DIR || 'assets',
      sourcemap: isProduction ? (env.VITE_BUILD_SOURCEMAP === 'true') : true,
      minify: isProduction ? (env.VITE_BUILD_MINIFY || 'esbuild') : false,
      target: isProduction ? (env.VITE_BUILD_TARGET?.split(',') || ['es2020']) : ['esnext'],
      chunkSizeWarningLimit: parseInt(env.VITE_BUILD_CHUNK_SIZE_WARNING) || 500,      
      // Rollup options for advanced bundling
      rollupOptions: {
        output: {
          // Manual chunks for better caching (only in production)
          ...(isProduction && {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
              router: ['react-router-dom'],
              query: ['@tanstack/react-query'],
              charts: ['recharts'],
              utils: ['axios', 'date-fns', 'jwt-decode']
            },
          }),
          // Asset file naming
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.name || ''
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(fileName)) {
              return `images/[name]-[hash][extname]`
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
              return `fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
        }
      }
    },
      // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@tanstack/react-query',
        'axios'
      ],
      exclude: env.VITE_OPTIMIZE_DEPS_EXCLUDE?.split(',') || []
    },
      // CSS configuration
    css: {
      modules: {
        localsConvention: 'camelCase'
      },
      preprocessorOptions: {
        scss: {
          additionalData: env.VITE_SCSS_ADDITIONAL_DATA || ''
        }
      }
    },
    
    // Development settings
    clearScreen: env.VITE_CLEAR_SCREEN === 'true' || false,
    logLevel: env.VITE_LOG_LEVEL || (isProduction ? 'warn' : 'info'),
    
    // Base path for deployment
    base: env.VITE_BASE_PATH || '/',
    
    // Define global constants
    define: {
      __DEV__: !isProduction,
    },
  }
})
