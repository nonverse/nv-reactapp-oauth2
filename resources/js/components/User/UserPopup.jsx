import {useSelector} from "react-redux";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";

const UserPopup = () => {

    const user = useSelector(state => state.user.value)
    const [animation, setAnimation] = useState({
        width: '50px',
        marginTop: 0,
        opacity: 1
    })

    useEffect(() => {
        setTimeout(() => {
            setAnimation({
                ...animation,
                width: 'auto'
            })
        }, 300)
        setTimeout(() => {
            setAnimation({
                ...animation,
                width: '50px',
                opacity: 0
                // TODO Need to have popup actaully dismount instead of going invisible
            })
        }, 3000)
    }, [])

    return (
        <motion.div
            className="user-popup"
            key={`user-popup-${user.uuid}`}
            initial={{width: '50px', opacity: 0, marginTop: '-100px'}}
            animate={animation}
        >
            <div id="user-popup-icon">
                <h1 id="no-user-icon-inner">{user.name_first.charAt(0).toUpperCase()}</h1>
            </div>
            <div id="user-popup-text">
                <span id="user-popup-name">{`${user.name_first} ${user.name_last}`}</span>
            </div>
        </motion.div>
    )
}

export default UserPopup
