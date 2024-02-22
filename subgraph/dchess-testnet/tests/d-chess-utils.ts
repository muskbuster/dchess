import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/DChess/DChess"

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPuzzleAddedEvent(
  internalTokenId: BigInt,
  fen: string,
  solutionHash: Bytes,
  board: BigInt,
  creator: Address,
  description: string
): PuzzleAdded {
  let puzzleAddedEvent = changetype<PuzzleAdded>(newMockEvent())

  puzzleAddedEvent.parameters = new Array()

  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam(
      "internalTokenId",
      ethereum.Value.fromUnsignedBigInt(internalTokenId)
    )
  )
  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam("fen", ethereum.Value.fromString(fen))
  )
  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionHash",
      ethereum.Value.fromFixedBytes(solutionHash)
    )
  )
  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam("board", ethereum.Value.fromUnsignedBigInt(board))
  )
  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  puzzleAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return puzzleAddedEvent
}

export function createPuzzleAttemptedEvent(
  internalTokenId: BigInt,
  user: Address,
  solutionSubmission: Bytes
): PuzzleAttempted {
  let puzzleAttemptedEvent = changetype<PuzzleAttempted>(newMockEvent())

  puzzleAttemptedEvent.parameters = new Array()

  puzzleAttemptedEvent.parameters.push(
    new ethereum.EventParam(
      "internalTokenId",
      ethereum.Value.fromUnsignedBigInt(internalTokenId)
    )
  )
  puzzleAttemptedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  puzzleAttemptedEvent.parameters.push(
    new ethereum.EventParam(
      "solutionSubmission",
      ethereum.Value.fromBytes(solutionSubmission)
    )
  )

  return puzzleAttemptedEvent
}

export function createPuzzleRatingChangedEvent(
  internalTokenId: BigInt,
  newPuzzleRating: BigInt
): PuzzleRatingChanged {
  let puzzleRatingChangedEvent = changetype<PuzzleRatingChanged>(newMockEvent())

  puzzleRatingChangedEvent.parameters = new Array()

  puzzleRatingChangedEvent.parameters.push(
    new ethereum.EventParam(
      "internalTokenId",
      ethereum.Value.fromUnsignedBigInt(internalTokenId)
    )
  )
  puzzleRatingChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newPuzzleRating",
      ethereum.Value.fromUnsignedBigInt(newPuzzleRating)
    )
  )

  return puzzleRatingChangedEvent
}

export function createPuzzleSolvedEvent(
  internalTokenId: BigInt,
  user: Address
): PuzzleSolved {
  let puzzleSolvedEvent = changetype<PuzzleSolved>(newMockEvent())

  puzzleSolvedEvent.parameters = new Array()

  puzzleSolvedEvent.parameters.push(
    new ethereum.EventParam(
      "internalTokenId",
      ethereum.Value.fromUnsignedBigInt(internalTokenId)
    )
  )
  puzzleSolvedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return puzzleSolvedEvent
}

export function createTokenMintedEvent(
  internalTokenId: BigInt,
  solver: Address
): TokenMinted {
  let tokenMintedEvent = changetype<TokenMinted>(newMockEvent())

  tokenMintedEvent.parameters = new Array()

  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "internalTokenId",
      ethereum.Value.fromUnsignedBigInt(internalTokenId)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("solver", ethereum.Value.fromAddress(solver))
  )

  return tokenMintedEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}

export function createUserRatingChangedEvent(
  user: Address,
  newUserRating: BigInt
): UserRatingChanged {
  let userRatingChangedEvent = changetype<UserRatingChanged>(newMockEvent())

  userRatingChangedEvent.parameters = new Array()

  userRatingChangedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userRatingChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newUserRating",
      ethereum.Value.fromUnsignedBigInt(newUserRating)
    )
  )

  return userRatingChangedEvent
}

export function createWithdrawAllEvent(amount: BigInt): WithdrawAll {
  let withdrawAllEvent = changetype<WithdrawAll>(newMockEvent())

  withdrawAllEvent.parameters = new Array()

  withdrawAllEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawAllEvent
}
