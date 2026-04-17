
      import { defineConfig } from 'vite';

      export default defineConfig({
        server: {
          fs: {
            allow: [
              // Allow the template project path which contains node_modules
              'c:\\Users\\adrie\\.vscode\\extensions\\robothy.slidev-copilot-0.1.4\\resources\\slidev-template',
              // Allow the session project path
              'c:\\Users\\adrie\\Cours\\MBDS\\react\\Gwen\\.slidev\\slidev-2026-04-16-14-16-01-c4203524',
              // Add the root directory containing the node_modules
              'c:\\Users\\adrie\\.vscode\\extensions\\robothy.slidev-copilot-0.1.4\\resources'
            ]
          }
        }
      });
    