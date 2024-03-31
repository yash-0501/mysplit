import axios from "axios";

const logoutUser = () => {
    console.log("called!")
    axios.get("auth/logout").then().catch(err =>{
        console.log(err);
    })
}

export default logoutUser;