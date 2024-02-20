import {
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PuzzleAdded as PuzzleAddedEvent,
  PuzzleAttempted as PuzzleAttemptedEvent,
  PuzzleRatingChanged as PuzzleRatingChangedEvent,
  PuzzleSolved as PuzzleSolvedEvent,
  TokenMinted as TokenMintedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  UserRatingChanged as UserRatingChangedEvent,
  WithdrawAll as WithdrawAllEvent
} from "../generated/DChess/DChess"
import {
  ApprovalForAll,
  OwnershipTransferred,
  PuzzleAdded,
  PuzzleAttempted,
  PuzzleRatingChanged,
  PuzzleSolved,
  TokenMinted,
  TransferBatch,
  TransferSingle,
  URI,
  UserRatingChanged,
  WithdrawAll
} from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePuzzleAdded(event: PuzzleAddedEvent): void {
  let entity = new PuzzleAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internalTokenId = event.params.internalTokenId
  entity.fen = event.params.fen
  entity.solutionHash = event.params.solutionHash
  entity.board = event.params.board
  entity.creator = event.params.creator
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePuzzleAttempted(event: PuzzleAttemptedEvent): void {
  let entity = new PuzzleAttempted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internalTokenId = event.params.internalTokenId
  entity.user = event.params.user
  entity.solutionSubmission = event.params.solutionSubmission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePuzzleRatingChanged(
  event: PuzzleRatingChangedEvent
): void {
  let entity = new PuzzleRatingChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internalTokenId = event.params.internalTokenId
  entity.newPuzzleRating = event.params.newPuzzleRating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePuzzleSolved(event: PuzzleSolvedEvent): void {
  let entity = new PuzzleSolved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internalTokenId = event.params.internalTokenId
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenMinted(event: TokenMintedEvent): void {
  let entity = new TokenMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internalTokenId = event.params.internalTokenId
  entity.solver = event.params.solver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.DChess_id = event.params.id
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.value = event.params.value
  entity.DChess_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserRatingChanged(event: UserRatingChangedEvent): void {
  let entity = new UserRatingChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.newUserRating = event.params.newUserRating

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawAll(event: WithdrawAllEvent): void {
  let entity = new WithdrawAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
