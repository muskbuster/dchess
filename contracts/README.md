# DChess Contracts

## Features

### Art from fiveoutofnine

The artwork is adapted from [fiveoutofnine's chess NFTs](https://github.com/fiveoutofnine/fiveoutofnine-chess/).

Key differences:

- Instead of playing a game against an AI, we only need to represent a fixed board position for representing puzzles. And so, instead of a `board` and a `move`, we only have `board`.
- Off-chain library is used for converting FEN to binary board representation.
- The code is modified so we can represent 8x8 board.

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

# Sample Hardhat Project

The dev setup forks from goerli network from an alchemy node. Make sure .env file contains necessary variables - `PRIVATE_KEY` and `ALCHEMY_BASE_GOERLI_HTTPS`.
Then start up a forked network with all deploy scripts run by running:
`yarn dev`
