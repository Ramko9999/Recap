import React, {useState, useEffect} from "react";
import UserApi from "../../api/user";
import User from "../../model/user";

const Profile = ()=>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        UserApi.getUser("f78807fd-a3b7-4d8b-8818-3d09e0e6f558").then((dat)=>{
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




