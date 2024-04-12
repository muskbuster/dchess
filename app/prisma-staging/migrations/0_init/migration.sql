-- CreateTable
CREATE TABLE "base_approval_for_all_approval_for_all" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "account" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_approval_for_all_approval_for_all_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_ownership_transferred_ownership_transferred" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "previous_owner" BYTEA NOT NULL,
    "new_owner" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_ownership_transferred_ownership_transferred_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_puzzle_added_puzzle_added" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "fen" TEXT NOT NULL,
    "solution_hash" BYTEA NOT NULL,
    "board" DECIMAL NOT NULL,
    "creator" BYTEA NOT NULL,
    "description" TEXT NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_puzzle_added_puzzle_added_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_puzzle_attempted_puzzle_attempted" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "user" BYTEA NOT NULL,
    "solution_submission" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_puzzle_attempted_puzzle_attempted_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_puzzle_rating_changed_puzzle_rating_changed" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "new_puzzle_rating" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_puzzle_rating_changed_puzzle_rating_changed_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_puzzle_solved_puzzle_solved" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "user" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_puzzle_solved_puzzle_solved_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_approval_for_all_approval_for_all" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "account" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_approval_for_all_approval_for_all_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_ownership_transferred_ownership_transferred" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "previous_owner" BYTEA NOT NULL,
    "new_owner" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_ownership_transferred_ownership_transferred_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_puzzle_added_puzzle_added" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "fen" TEXT NOT NULL,
    "solution_hash" BYTEA NOT NULL,
    "board" DECIMAL NOT NULL,
    "creator" BYTEA NOT NULL,
    "description" TEXT NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_puzzle_added_puzzle_added_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_puzzle_attempted_puzzle_attempted" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "user" BYTEA NOT NULL,
    "solution_submission" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_puzzle_attempted_puzzle_attempted_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_puzzle_rating_changed_puzzle_rating_changed" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "new_puzzle_rating" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_puzzle_rating_changed_puzzle_rating_changed_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_puzzle_solved_puzzle_solved" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "user" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_puzzle_solved_puzzle_solved_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_token_minted_token_minted" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "solver" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_token_minted_token_minted_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_transfer_batch_transfer_batch" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "from" BYTEA NOT NULL,
    "to" BYTEA NOT NULL,
    "ids" DECIMAL[],
    "values" DECIMAL[],
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_transfer_batch_transfer_batch_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_transfer_single_transfer_single" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "from" BYTEA NOT NULL,
    "to" BYTEA NOT NULL,
    "d_chess_id" DECIMAL NOT NULL,
    "value" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_transfer_single_transfer_single_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_uri_uri" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "value" TEXT NOT NULL,
    "d_chess_id" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_uri_uri_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_user_rating_changed_user_rating_changed" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "user" BYTEA NOT NULL,
    "new_user_rating" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_user_rating_changed_user_rating_changed_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_sepolia_withdraw_all_withdraw_all" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "amount" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_sepolia_withdraw_all_withdraw_all_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_token_minted_token_minted" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "internal_token_id" DECIMAL NOT NULL,
    "solver" BYTEA NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_token_minted_token_minted_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_transfer_batch_transfer_batch" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "from" BYTEA NOT NULL,
    "to" BYTEA NOT NULL,
    "ids" DECIMAL[],
    "values" DECIMAL[],
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_transfer_batch_transfer_batch_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_transfer_single_transfer_single" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "operator" BYTEA NOT NULL,
    "from" BYTEA NOT NULL,
    "to" BYTEA NOT NULL,
    "d_chess_id" DECIMAL NOT NULL,
    "value" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_transfer_single_transfer_single_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_uri_uri" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "value" TEXT NOT NULL,
    "d_chess_id" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_uri_uri_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_user_rating_changed_user_rating_changed" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "user" BYTEA NOT NULL,
    "new_user_rating" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_user_rating_changed_user_rating_changed_pkey" PRIMARY KEY ("_gs_gid")
);

-- CreateTable
CREATE TABLE "base_withdraw_all_withdraw_all" (
    "vid" BIGINT NOT NULL,
    "block" INTEGER NOT NULL,
    "id" BYTEA NOT NULL,
    "amount" DECIMAL NOT NULL,
    "block_number" DECIMAL NOT NULL,
    "block_timestamp" DECIMAL NOT NULL,
    "transaction_hash" BYTEA NOT NULL,
    "_gs_chain" TEXT,
    "_gs_gid" TEXT NOT NULL,

    CONSTRAINT "base_withdraw_all_withdraw_all_pkey" PRIMARY KEY ("_gs_gid")
);

