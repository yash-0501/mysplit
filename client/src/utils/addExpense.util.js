import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formatExpenseData = (data) => {
    let expenseObj = {};
    expenseObj.paidBy = data.paidBy._id;
    expenseObj.amount = data.amount;
    expenseObj.description = data.description;
    expenseObj.participants = data.participants.map((participant)=> participant._id);
    expenseObj.splitType = data.splitType;
    expenseObj.splitShares = data.splitShares,
    expenseObj.group = data.group === null ? undefined : data.group;
    expenseObj.expenseDate = data.expenseDate;

    return expenseObj;
}

const createExpense = async (expense) => {
    const expenseData = formatExpenseData({...expense});
    await axios.post("/expenses/add", expenseData).then(({data})=>{
        console.log(data)
        if(data.error){
            toast.error(data.error);
        }else{
            toast.success(data.message);
        }
        
    }).catch(err => console.log(err));
}

export default createExpense;