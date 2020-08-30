import React, {useState, useEffect} from "react";
import UserApi from "../../api/User";
import User from "../../model/User";
import history from "../../util/History";


const getUserId = (path:string)=>{
    const parts = path.split("/");
    return parts[parts.length - 1];
}

const Profile = ()=>{

    const id = getUserId(history.location.pathname);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        UserApi.getUser(id).then((dat)=>{
            setData(dat)
        })
        .finally(()=>{
            setLoading(false)
        });
    }, []);

    const user = new User(data);

    if(loading){
        return <div>Loading... One min...</div>
    }
    return <div>
        {`${user.getFullName()}`}
        <div>
            {`${user.getLevel()}`}
        </div>
    </div>
}

export default Profile;




