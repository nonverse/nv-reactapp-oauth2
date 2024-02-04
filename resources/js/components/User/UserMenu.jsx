import User from "@/components/User/User.jsx";
import Logout from "@/components/User/Logout.jsx";
import {useEffect, useState} from "react";
import Loader from "@/components/Loader.jsx";
import {motion} from "framer-motion";
import {useSelector} from "react-redux";
import InLineButton from "@/elements/InLineButton.jsx";
import helpers from "../../scripts/helpers/helpers.js";
import api from "../../scripts/api.js";
import ThisUser from "./ThisUser.jsx";
import UserSelector from "./UserSelector.jsx";

const UserMenu = ({setShow}) => {

    const [loading, setLoading] = useState(true)
    const [showUsers, setShowUsers] = useState(false)
    const [users, setUsers] = useState({})
    const user = useSelector(state => state.user.value)

    useEffect(() => {
        async function initialise() {
            await axios.get("https://auth.nonverse.test/user/cookie", {
                withCredentials: true
            })
                .then(response => {
                    setUsers(response.data.data.users)
                    setLoading(false)
                })
        }

        initialise()
    }, [])

    return (
        <motion.div id="user-selector-overlay"
                    key={"user-selector-overlay"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: .1}}
                    exit={{opacity: 0}}
                    onClick={() => {
                        setShow(false)
                    }}>
            <div id="user-selector" onClick={(e) => {
                e.stopPropagation()
            }}>
                {loading ?
                    <Loader/> : (
                        <>
                            {(users.length !== 0) ? (
                                <>
                                    {user ? <ThisUser setLoading={setLoading} showUsers={showUsers} setShowUsers={setShowUsers}/> : <UserSelector users={users} setLoading={setLoading}/>}
                                    {showUsers ? <UserSelector users={users} setLoading={setLoading}/> : ''}
                                    <Logout setLoading={setLoading}/>
                                </>
                            ) :
                                <div id="no-users">
                                    <div id="no-user-icon">
                                        <h1>?</h1>
                                    </div>
                                    <h1>No users found in session</h1>
                                    <h2>Please login to continue</h2>
                                    <InLineButton id="no-user-login-btn" onClick={() => {
                                        window.location = `https://auth.nonverse.test/login?${helpers.getRedirectQuery()}`
                                    }
                                    }>Login</InLineButton>
                                </div>
                            }
                        </>
                    )}
            </div>
        </motion.div>
    )
}

export default UserMenu
