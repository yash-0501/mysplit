import axios from "axios"

const fetchExpenses =  (setExpenses) => {
    axios.get('/expenses').then(({data})=>{
        setExpenses(data.expenses);
    }).catch (error => {
    console.error('Error fetching expenses:', error);
  })
}

export default fetchExpenses;