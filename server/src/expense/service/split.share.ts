// handles split % wise
import { Schema } from "mongoose";
import { ParticipantsType } from "../expense.zodSchema";

// handles equal split
const checkSplit = (participants: Schema.Types.ObjectId[], split: number[]) => {
  return participants.length === split.length;
};

export const fetchShareSplit = (
  participants: Schema.Types.ObjectId[],
  amount: number,
  shares: number[]
): ParticipantsType[] | null => {
  if (checkSplit(participants, shares) === false) {
    return null;
  }
  let splitByParticipants: ParticipantsType[] = [];
  let totalShares = 0;

  for (let i = 0; i < shares.length; i++) totalShares += shares[i];
  let totalAmount = 0;
  const amt = amount / totalShares;

  for (let i = 0; i < participants.length; i++) {
    if (
      totalAmount + amt * shares[i] != amount &&
      i == participants.length - 1
    ) {
      splitByParticipants.push({
        participant: participants[i],
        share: parseFloat((amount - totalAmount).toFixed(2)),
      });
    } else {
      splitByParticipants.push({
        participant: participants[i],
        share: parseFloat((amt * shares[i]).toFixed(2)),
      });
    }
    totalAmount += parseFloat((amt * shares[i]).toFixed(2));
    totalAmount = parseFloat(totalAmount.toFixed(2));
  }

  return splitByParticipants;
};
