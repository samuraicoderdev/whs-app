import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SGA Picking API → http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
});
