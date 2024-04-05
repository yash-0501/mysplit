import axios from "axios";
import toast from "react-hot-toast";

const formatData = (groupData) => {
    const formattedData = groupData.groupMembers.map(data=>data._id);
    return {...groupData, groupMembers:formattedData};
}

const createGroup = async (groupData) => {
    const formattedData = formatData(groupData);
    console.log(formattedData);
    await axios.post("/groups/new", formattedData).then(({data})=>{
        if(data.error){
            toast.error(data.error);
        }else{
            toast.success(data.message);
        }
    }).catch(err => console.log(err));
}

export default createGroup;