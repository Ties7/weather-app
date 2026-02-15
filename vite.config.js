import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [sveltekit()],
    define: {
      'import.meta.env.PUBLIC_WEATHER_API_KEY': JSON.stringify(env.PUBLIC_WEATHER_API_KEY)
    }
  };
});