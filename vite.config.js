import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            manifest: {
                name: 'My Healthy Food',
                short_name: 'Healthy Food',
                description: 'Platform for generating AI recipes.',
                theme_color: '#68b984',
                icons: [
                    {
                        src: 'android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
        // sentryVitePlugin({
        //     org: 'maxsoft',
        //     project: 'auto-research'
        // })
    ]

    // build: {
    //     sourcemap: true
    // }
});
