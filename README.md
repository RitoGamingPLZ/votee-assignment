
# Votee Take-Home Assignment

This project implements a Wordle solver that can filter words from a dictionary and dynamically solve Wordle puzzles based on feedback.

## Features
- Filters words by size and required letters.
- Solves Wordle puzzles using dynamic feedback.
- Includes Docker support for easy deployment.

## Prerequisites
- [Node.js](https://nodejs.org/) installed locally (if running outside Docker).
- [Docker](https://www.docker.com/) installed for containerized execution.

## Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:RitoGamingPLZ/votee-assignment.git
   cd votee-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running Locally
Run the Wordle solver with:
```bash
node index.js --size 5
```

### Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t votee-assignment .
   ```

2. Run the container:
   ```bash
   docker run --name votee-container votee-assignment --size 5
   ```

## Development
To update or modify the project:
1. Edit `index.js` for core logic.
2. Use `npm run lint` (if configured) to check code style.

## Project Structure
- **index.js**: Main entry point of the Wordle solver.
- **Dockerfile**: Defines the containerized environment.
- **src/**: Contains supporting modules such as API integrations and utilities.

## License
This project is for evaluation purposes and is not licensed for commercial use.
