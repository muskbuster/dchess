# Subgraphs

Subgraphs consume events emitted from the contracts and push them to:

- Centralized GraphQL endpoint such as The Graph (or Goldsky).
  - This allows the app to directly query the subgraph and fetch events such as user A minted token ID 0 twice.
- Centralized Database such as Postgres
  - This allows the app to make more sophisticated queries such as fetching latest user ratings.

DChess currently leverages both. At the current moment, no data transformation is being applied when pushing to the centralized database, however, this might change in future as need arises.

## Setup

### Tools

- The Graph (https://thegraph.com/studio/)
- Goldsky Pipelines (https://app.goldsky.com/dashboard/pipelines)
- Vercel Store (https://vercel.com/alpha-labs/~/stores)

### Steps

1. Make sure you have Graph CLI installed globally (currently using 0.65 version)

```
yarn global add @graphprotocol/graph-cli
```

2. Initialize subgraph

```
graph init --studio dchess
```

This will go through the process
