import axios from "axios";

const fetchBalanceSummary = (setBalanceDetails) => {
    axios.get("/balance/summary").then(({data})=>{
        if(data.error)
            setBalanceDetails(null)
        else
            setBalanceDetails(data)
    }).catch(err =>{
        setBalanceDetails(null);
        console.log(err);
    })
}

export default fetchBalanceSummary;