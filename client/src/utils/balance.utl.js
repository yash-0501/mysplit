import axios from "axios"

const fetchBalance = (setBalance) =>{
    axios.get("/balance/show").then(({data})=>{
        setBalance(data);
    }).catch(err => {
        setBalance([]);
        console.log(err);
    })
}

export default fetchBalance;