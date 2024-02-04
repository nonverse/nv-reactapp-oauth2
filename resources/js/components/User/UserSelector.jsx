import helpers from "../../scripts/helpers/helpers.js";
import User from "./User.jsx";
import {useSelector} from "react-redux";
import InLineButton from "../../elements/InLineButton.jsx";

const UserSelector = ({users, setLoading}) => {

    const currentUser = useSelector(state => state.user.value)

    return (
        <>
            <div id="user-selector-title">
                <h1>Users</h1>
            </div>
            {Object.keys(users).map((uuid) => {
                const user = users[uuid]
                return (
                    <User name={`${user.data.name_first} ${user.data.name_last}`}
                          email={user.data.email} uuid={uuid}
                          key={`user-${user.email}`}
                          isCurrent={currentUser ? currentUser.uuid === uuid : false}/>
                )
            })}
            <InLineButton id="user-add" onClick={() => {
                window.location = `https://auth.nonverse.test?${helpers.getRedirectQuery('ignore_session')}`
            }}>Add user</InLineButton>
        </>
    )
}

export default UserSelector
