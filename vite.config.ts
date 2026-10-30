import { execSync } from 'node:child_process';
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

const hasPhp = (() => {
    if (process.env.VERCEL || process.env.CI) return false;
    try {
        execSync('php -v', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
})();

export default defineConfig(({ command }) => {
    const isBuild = command === 'build';

    return {
        server: {
            host: '0.0.0.0',
            hmr: {
                host: '10.215.148.54',
            },
            cors: true,
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
                fonts: [
                    bunny('Instrument Sans', {
                        weights: [400, 500, 600],
                    }),
                ],
            }),
            inertia(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            tailwindcss(),
            wayfinder({
                formVariants: true,
                command:
                    !isBuild && hasPhp
                        ? 'php artisan wayfinder:generate'
                        : 'node scripts/wayfinder.cjs',
            }),
        ],
    };
});
