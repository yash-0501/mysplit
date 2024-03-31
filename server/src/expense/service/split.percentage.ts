// handles split % wise
import { Schema } from "mongoose";
import { ParticipantsType } from "../expense.zodSchema";

// handles equal split
const checkSplit = (participants: Schema.Types.ObjectId[], split: number[]) => {
  if (participants.length === split.length) {
    let total = 0;
    for (const percent of split) total += percent;

    if (total === 100) return true;
  }
  return false;
};

export const fetchPercentageSplit = (
  participants: Schema.Types.ObjectId[],
  amount: number,
  percentage_split: number[]
): ParticipantsType[] | null => {
  if (checkSplit(participants, percentage_split) === false) {
    return null;
  }
  let splitByParticipants: ParticipantsType[] = [];

  for (let i = 0; i < participants.length; i++) {
    const amt = parseFloat((amount * (percentage_split[i] * 0.01)).toFixed(2));
    splitByParticipants.push({
      participant: participants[i],
      share: amt,
    });
  }

  return splitByParticipants;
};
