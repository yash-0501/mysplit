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

  for (const participant of participants) {
    splitByParticipants.push({
      participant: participant,
      share: amountForEachParticipant,
    });
  }

  return splitByParticipants;
};
