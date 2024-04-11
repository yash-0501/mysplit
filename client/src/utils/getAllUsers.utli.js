import axios from "axios"

const fetchAllUsers = (setAllUsers) => {
    axios.get("/users/").then(({data})=>{
        console.log(data)
        if(data.error)
            setAllUsers([]);
        else
            setAllUsers(data);
    }).catch(err => {
        setAllUsers([]);
        console.log(err);
    })
}

export default fetchAllUsers;