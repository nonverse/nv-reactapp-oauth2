import UserSvg from "../../../assets/User.jsx";
import UserPopup from "@/components/User/UserSelector.jsx";
import {useState} from "react";

const UserIcon = () => {

    const [show, setShow] = useState(false)

    return (
        <>
            <div id="user-icon" onClick={() => {
                setShow(true)
            }}>
                <UserSvg/>
            </div>
            {show ? <UserPopup setShow={setShow}/> : ''}
        </>
    )
}

export default UserIcon
