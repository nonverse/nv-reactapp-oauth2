import {useSelector} from "react-redux";

const UserPopup = () => {

    const user = useSelector(state => state.user.value)

    return (
        <div className="user-popup">
            <div id="user-popup-icon">
                <h1>{user.name_first.charAt(0).toUpperCase()}</h1>
            </div>
            <div id="user-popup-text">
                <span id="user-popup-name">{`${user.name_first} ${user.name_last}`}</span>
            </div>
        </div>
    )
}

export default UserPopup
