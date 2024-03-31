// handles unequal splits
import { Schema } from "mongoose";
import { ParticipantsType } from "../expense.zodSchema";

// handles equal split
const checkSplit = (
  participants: Schema.Types.ObjectId[],
  split: number[],
  amount: number
) => {
  if (participants.length === split.length) {
    let total = 0;
    for (const percent of split) total += percent;

    if (total === amount) return true;
  }
  return false;
};

export const fetchUnequalSplit = (
  participants: Schema.Types.ObjectId[],
  amount: number,
  shares: number[]
): ParticipantsType[] | null => {
  if (checkSplit(participants, shares, amount) === false) {
    return null;
  }
  let splitByParticipants: ParticipantsType[] = [];

  for (let i = 0; i < participants.length; i++) {
    splitByParticipants.push({
      participant: participants[i],
      share: shares[i],
    });
  }

  return splitByParticipants;
};
