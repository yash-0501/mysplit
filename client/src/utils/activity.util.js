import axios from "axios"

const fetchExpenses =  (setExpenses) => {
    axios.get('/expenses').then(({data})=>{
      console.log(data);
      if(data.error) setExpenses([]);
      else
        setExpenses(data.expenses);
    }).catch (error => {
      setExpenses([])
    console.error('Error fetching expenses:', error);
  })
}

export default fetchExpenses;