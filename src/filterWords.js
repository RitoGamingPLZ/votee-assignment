import { Worker } from 'worker_threads';
import os from 'os'

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function filterWords(feedback, possibleWords) {
  return new Promise((resolve, reject) => {
    const numThreads = os.cpus().length; // Number of available CPU cores
    const chunkSize = Math.ceil(possibleWords.length / numThreads);
    const chunks = Array.from({ length: numThreads }, (_, i) =>
      possibleWords.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    let remainingWords = [];
    let completed = 0;

    chunks.forEach((chunk) => {
      const worker = new Worker(path.resolve(__dirname, './filterWorker.js'), { type: 'module' });
      worker.postMessage({ feedback, chunk });

      worker.on('message', (filteredChunk) => {
        remainingWords = remainingWords.concat(filteredChunk); // Collect results
        completed++;

        if (completed === chunks.length) {
          resolve(remainingWords); // Resolve when all workers finish
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  });
}
