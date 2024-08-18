import client from 'prom-client';
import express from 'express';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const scrapeCounter = new client.Counter({
  name: 'scrapes_total',
  help: 'Total number of scrapes',
});

const scrapeLatency = new client.Histogram({
  name: 'scrape_latency_seconds',
  help: 'Latency of scraping operations',
  buckets: [0.1, 0.5, 1, 2, 5],
});

export function incrementScrapeCounter() {
  scrapeCounter.inc();
}

export function observeScrapeLatency(latency: number) {
  scrapeLatency.observe(latency);
}

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(9100, () => {
  console.log('Metrics server listening on port 9100');
});
