import axios from "axios";

const logoutUser = () => {
    axios.get("auth/logout").then().catch(err =>{
        console.log(err);
    })
}

export default logoutUser;