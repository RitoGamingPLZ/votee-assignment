import { parentPort } from "worker_threads";

parentPort.on('message', ({ feedback, chunk }) => {
  const remainingWords = chunk.filter((word) => {
    for (const { slot, guess, result } of feedback) {
      if (result === 'absent' && word.includes(guess)) {
        return false;
      }
      if (result === 'present' && (!word.includes(guess) || word[slot] === guess)) {
        return false;
      }
      if (result === 'correct' && word[slot] !== guess) {
        return false;
      }
    }
    return true;
  });
  parentPort.postMessage(remainingWords);
});
