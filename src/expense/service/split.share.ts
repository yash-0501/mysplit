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

  for (let i = 0; i < participants.length; i++) {
    const amt = amount / totalShares;
    splitByParticipants.push({
      participant: participants[i],
      share: amt * shares[i],
    });
  }

  return splitByParticipants;
};
