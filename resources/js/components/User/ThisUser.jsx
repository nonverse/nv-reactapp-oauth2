import {useSelector} from "react-redux";
import Button from "../../elements/Button.jsx";
import {motion} from "framer-motion";

const ThisUser = ({showUsers, setShowUsers}) => {

    const user = useSelector(state => state.user.value)

    return (
        <div id="this-user">
            <div id="this-user-icon">
                <h1>{user.name_first.charAt(0).toUpperCase()}</h1>
            </div>
            <h1>{`${user.name_first} ${user.name_last}`}</h1>
            <span id="this-user-email">{user.email}</span>
            <div id="this-user-actions">
                <Button onClick={() => {
                    window.open(`https://account.nonverse.${(import.meta.env.VITE_APP_ENV === 'local') ? 'test' : 'net'}/`)
                }}>Manage Account</Button>
                {!showUsers && <motion.div
                    exit={{opacity: 0}}
                >
                    <Button id="this-user-switch-btn" onClick={() => setShowUsers(true)}>Switch User</Button>
                </motion.div>}

            </div>
        </div>
    )
}

export default ThisUser
