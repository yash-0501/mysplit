import axios from "axios"

const fetchAllGroups = (setAllGroups) =>{
    axios.get("/groups/").then(({data})=>{
        if(data.error){
            console.log(data.error);
            setAllGroups([]);
        }else
            setAllGroups(data.groups);
    }).catch((err) => console.log(err));
}

export default fetchAllGroups;