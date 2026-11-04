import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  use: { browserName: 'chromium' },
  reporter: [['list'], ['html', { open: 'never' }]],
});
