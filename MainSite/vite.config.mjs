import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src', // Root directory of the project
  build: {
    outDir: '../dist', // Output the build files to the `dist` folder
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'), // Adjust the path to include 'src'
        game: resolve(__dirname, 'src/game/game.html'), // Include 'src' in the path
        info: resolve(__dirname, 'src/info/info.html'), // Include 'src' in the path
      },
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // Ensure all assets are in a single assets folder
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      },
    },
  },
});
