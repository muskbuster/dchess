# DChess

Decentralized chess platform. We assign on-chain ratings to chess players by asking users to solve puzzles.

### FAQ

**Q. Why ratings?**
Ratings on-chain unlock a lot of opportunities. It can serve as a verifiable proof that the user is indeed good at chess and can be used as a filter for participating in tournaments with cash prize.

**Q. Why puzzles?**
Puzzles serves a twofold purpose: assigns players ratings and helps players improve their chess. Our puzzles are not like the puzzles you find on traditional chess platforms. They are hand-picked by the best players. And are personalized by them.

**Q. What is the incentive for puzzle creators?**
After solving each puzzle, a player has the option to mint an NFT. 80% of the proceeds go to the creator of the puzzle. This way the creator is compensated for their effort and want to make the best puzzle possible.

**Q. Why would a player mint NFTs from puzzles?**
There are two reasons for it. The first one being that you are supporting the puzzle creator and you are getting a beautiful generative art NFT in return. The second reason is that the NFT is useful for unlocking access to Discord where you can find other fellow members in the same ratings as yours and play chess games with them!

## Getting started

To start the dev environment:

1. Start a local base-goerli fork by navigating to the `contracts/` directory and running `yarn dev`. This will write a temporary `Board.json` file to the `contracts/deployments/localhost` directory.
2. Start a local subgraph that queries the local fork by navigating to the `graph/` directory and running `yarn dev`. Make sure that the address in the `Board.json` file from the previous step is the same as that in the `graph/ponder.config.ts` file (update it if not). Note: if you need to resync the blockchain, you can delete the `graph/.ponder` directory and restart the subgraph.
3. Once the subgraph is finished syncing, you can start the frontend by navigating to the `dchess/` directory and running `yarn dev`. The frontend is already configured to use the localhost chain so it will default to send transactions to the localhost network, which should in turn update the subgraph.
