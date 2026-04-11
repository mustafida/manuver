import adapter from '@sveltejs/adapter-vercel'; // Pastikan mengimpor adapter yang benar
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // Adapter ini akan menangani build untuk Vercel
        adapter: adapter()
    }
};

export default config;
