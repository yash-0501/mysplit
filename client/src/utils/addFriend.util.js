import axios from "axios";
import toast from "react-hot-toast";

const addFriend = async(friend) => {
    await axios.post("/users/addFriend", {friend_id: friend._id}).then(({data})=>{
        console.log(data);
        if(data.error){
            toast.error(data.error);
        }else{
            toast.success(data.message);
        }
    }).catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
    });
}

export default addFriend;