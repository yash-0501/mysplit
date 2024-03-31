import { Schema } from "mongoose";
import { ParticipantsType } from "../expense.zodSchema";

// handles equal split

export const fetchEqualSplit = (
  participants: Schema.Types.ObjectId[],
  amount: number
): ParticipantsType[] => {
  const count = participants.length;
  let splitByParticipants: ParticipantsType[] = [];

  const amountForEachParticipant = amount / count;
  const amt = parseFloat(amountForEachParticipant.toFixed(2));
  let currTotal = 0;

  for (let i = 0; i < participants.length; i++) {
    if (currTotal + amt != amount && i == participants.length - 1) {
      splitByParticipants.push({
        participant: participants[i],
        share: parseFloat((amount - currTotal).toFixed(2)),
      });
    } else {
      splitByParticipants.push({
        participant: participants[i],
        share: amt,
      });
    }
    currTotal = currTotal + amt;
    currTotal = parseFloat(currTotal.toFixed(2));
  }

  return splitByParticipants;
};
