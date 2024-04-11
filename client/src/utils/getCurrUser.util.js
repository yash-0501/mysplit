import axios from "axios";

const getCurrUser = (setUser) => {   
    axios
    .get("users/profile")
    .then(({ data }) => {
    if (data.error) {
        console.log("Something missing here");
        setUser(null);
    } else {
        setUser(data);
    }
    })
    .catch((err) => {
    console.log("Something missing", err);
    setUser(null);
    });
}

export default getCurrUser;