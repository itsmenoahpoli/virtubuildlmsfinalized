import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [angular()],
    appType: 'spa',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['@/app/shared/utils/types'],
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env['VITE_API_BASE_URL'] || 'https://api-virtubuild.up.railway.app/api'),
    },
  };
});
