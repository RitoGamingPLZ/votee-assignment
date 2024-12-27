import dict from 'dictionary-en';
import { fetchDaily } from './src/api/votee-wordle.js';
import { filterWords } from './src/filterWords.js';

/**
 * Parse command-line arguments.
 * @returns {Object} - Parsed arguments.
 */
function parseArguments() {
  const args = process.argv.slice(2); // Ignore "node" and script name
  const parsedArgs = {};

  args.forEach((arg, index) => {
    if (arg.startsWith('--')) {
      const key = arg.slice(2); // Remove "--" prefix
      const value = args[index + 1]; // Get the value after the key
      parsedArgs[key] = isNaN(value) ? value : parseInt(value, 10); // Convert to number if possible
    }
  });

  return parsedArgs;
}

/**
 * Function to get all words of a specific size from the dictionary.
 * @param {number} size - Length of the words to filter.
 * @returns {string[]} - Array of words with the specified size.
 */
function getAllWordsOfSize(size) {
  return dict.dic
    .toString() // Convert Uint8Array to a string
    .split('\n') // Split into lines
    .filter((line) => line && !line.startsWith('#')) // Remove comments and empty lines
    .map((line) => line.split('/')[0]) // Remove affix rules
    .filter((line) => /^[a-z]+$/i.test(line)) // Ensure the line contains only English alphabet letters
    .filter((word) => word.length === size); // Filter words of the specified size
}

/**
 * Main function to solve the Wordle puzzle.
 * @param {number} size - Length of the Wordle word (default is 5).
 */
async function startWordle(size = 5) {
  let foundAns = false; // Flag to determine if the answer is found
  let possibleWords = getAllWordsOfSize(size); // Get initial list of possible words
  let currentGuess;
  let feedback;
  let guessCount = 0;

  console.log(`Starting Wordle solver for word size ${size}...\n`);
  
  while (!foundAns) {
    if (possibleWords.length == 0) {
      console.log(`Running out of words, wordle beat the dataset`);
      process.exit(0);
    }

    // Take the next guess from the list of possible words
    currentGuess = possibleWords.pop();
    guessCount++;

    console.log(`Guess ${guessCount}: ${currentGuess}`);
    
    // Fetch feedback for the current guess
    feedback = await fetchDaily(currentGuess, size);
    console.log('Feedback:', feedback);

    // Check if the feedback indicates the correct answer
    foundAns = feedback.every((item) => item.result === 'correct');

    // If not found, filter the possible words based on feedback
    if (!foundAns) {
      possibleWords = await filterWords(feedback, possibleWords);
      console.log(`Remaining Possible Words: ${possibleWords.length}\n`);
    } else {
      console.log(`The Answer is: "${currentGuess}" (found in ${guessCount} guesses) 🎉`);
      process.exit(0);
    }
  }
}

// Start the Wordle solver
const args = parseArguments();
const size = args.size ?? 5; // Default size is 5
startWordle(size);
