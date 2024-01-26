# DChess Contracts

## Setup

### Hardhat deploy

https://github.com/wighawag/hardhat-deploy

### Environment Variables

The dev setup forks from goerli network from an alchemy node. Make sure .env file contains necessary variables - `PRIVATE_KEY` and `ALCHEMY_BASE_GOERLI_HTTPS`.
Then start up a forked network with all deploy scripts run by running:
`yarn dev`

### Scripts

#### Generic

-   `yarn compile` $\rightarrow$ cleans and compiles
-   `yarn test` $\rightarrow$ deploys fixtures and runs test on hardhat network
-   `yarn hardhat --network <networkName> deploy` $\rightarrow$ will deploy the code to the right network
-   `yarn hardhat verify --network base-sepolia <CONTRACT_ADDRESS> ...PARAMS` to verify contracts

#### Custom

-   `yarn hardhat run scripts/parseProblems.ts` $\rightarrow$ parses problem sets (in frequently needed)
-   `yarn hardhat --network <networkName> run scripts/whitelistCreators.ts` $\rightarrow$ whitelists creators found in `/data/whitelistedCreators.json`. This is used for updating the list (use this for mainnet as well)
-   `yarn hardhat --network <networkName> run scripts/addPuzzles.ts` $\rightarrow$ randomly selects creators (that should be whitelisted seperately) and adds a collection of problems from `/data/puzzleSet.json` (can be used for mainnet but be careful about the puzzle set being used)
-   `yarn hardhat --network <networkName> run scripts/updateMintPrice.ts` $\rightarrow$ updates the mint price to the given number in the script (double check the value in the script)

## Features

### Art from fiveoutofnine

The artwork is adapted from [fiveoutofnine's chess NFTs](https://github.com/fiveoutofnine/fiveoutofnine-chess/).

Key differences:

-   Instead of playing a game against an AI, we only need to represent a fixed board position for representing puzzles. And so, instead of a `board` and a `move`, we only have `board`.
-   Off-chain library is used for converting FEN to binary board representation.
-   The code is modified so we can represent 8x8 board.

### ELO ratings

**Assumption:** performance of each player in each game is a normally distributed random variable.

Given two players with ratings $R_A$ and $R_B$, the expected score of player A can be calculated by the following formula:

$$ E_A = {1 \over 1 + 10^{(R_B - R_A) / 400}} $$

Similarly for player B

$$ E_B = {1 \over 1 + 10^{(R_A - R_B) / 400}} $$

Expected score of 0.75 would represent a 75% chance of winning and 25% chance of losing

Formula for updating players ratings:

$$ R_A' = {R_A + K . (S_A - E_A)} $$

Where $S_A$ is actual score which can be 0 (lose) or 1 (win).

The higher value of K (usually for weaker players) means that the ratings will fluctuate quite a bit. We will assign higher K value for newer players.
