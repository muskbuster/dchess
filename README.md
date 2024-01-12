# ChessTempo

To start the dev environment: 
1. Start a local base-goerli fork by navigating to the `contracts/` directory and running `yarn dev`. This will write a temporary `Board.json` file to the `contracts/deployments/localhost` directory.  
2. Start a local subgraph that queries the local fork by navigating to the `graph/` directory and running `yarn dev`. Make sure that the address in the `Board.json` file from the previous step is the same as that in the `graph/ponder.config.ts` file (update it if not). Note: if you need to resync the blockchain, you can delete the `graph/.ponder` directory and restart the subgraph.
3. Once the subgraph is finished syncing, you can start the frontend by navigating to the `base-chess/` directory and running `yarn dev`. The frontend is already configured to use the localhost chain so it will default to send transactions to the localhost network, which should in turn update the subgraph.  