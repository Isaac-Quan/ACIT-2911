// allows exporting functions (Without it, export{} breaks entire damn website (
                // script.js:9 Uncaught SyntaxError: Unexpected token 'export'))

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom'
  },  
});  

