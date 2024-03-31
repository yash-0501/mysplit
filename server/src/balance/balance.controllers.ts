import { Request, Response } from "express";
import { UserType } from "../user/user.zodSchema";
import { User } from "../user/user.models";
import { Balance, Debt } from "./balance.models";
import { getDebts } from "./balance.debt.service";

const showBalance = async (req: Request, res: Response) => {
  const reqUser = req.user as UserType;
  try {
    if (reqUser) {
      const user = await User.findOne({ email: reqUser.email });
      if (!user) return res.status(401).json({ error: "No such user" });
      const balance = await Balance.find({ user: user._id }).populate("user","email").populate("group");

      const debts = await Debt.find({
        $or: [{ paidBy: user }, { paidTo: user }],
      })
        .populate("paidBy", "name email") // Populate the 'paidBy' field with 'name' and 'email' fields from the 'User' collection
        .populate("paidTo", "name email") // Populate the 'paidTo' field with 'name' and 'email' fields from the 'User' collection
        .populate("group")
        .exec();
      
      const debtResponse = await getDebts(debts, user);
      const result = { balance: balance, debts: debtResponse };
      return res.json(result);
    }
  } catch (err) {
    return res.json(err);
  }
};

const getbalanceSummary = async(req: Request, res: Response) =>{
  const reqUser = req.user as UserType;
  
  try {
      if (reqUser) {
        const user = await User.findOne({ email: reqUser.email });
        if (!user) return res.status(401).json({ error: "No such user" });
        const balance = await Balance.find({ user: user._id }).populate("user","email");
        let totalBalance = 0;
        let totalShare = 0;
        let totalPaidFor = 0
        for(const bal of balance){
          totalBalance += bal.totalBalance;
          totalShare += bal.totalShare;
          totalPaidFor += bal.totalPaidFor;
        }
        const result = { totalBalance, totalPaidFor, totalShare };
        return res.json(result);
      }
    } catch (err) {
      return res.json(err);
    }
}

export { showBalance, getbalanceSummary };
