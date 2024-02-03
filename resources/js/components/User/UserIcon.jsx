import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import UserSelector from "./UserSelector.jsx";
import {motion} from "framer-motion";

const UserIcon = ({apiStatus}) => {

    const user = useSelector(state => state.user.value)
    const [show, setShow] = useState(false)
    const [showIcon, setShowIcon] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowIcon(true)
        }, 4000)
    }, [])

    return (
        <>
            {(apiStatus.code !== 0 && apiStatus.code.toString().charAt(0) !== '2') ? <>
                <motion.div
                    id="user-icon"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    onClick={() => {
                        setShow(true)
                    }}>
                    <div id="user-icon-inner">
                        {user ? <h1>{user.name_first.charAt(0).toUpperCase()}</h1> : ''}
                    </div>
                </motion.div>
                {show ? <UserSelector setShow={setShow}/> : ''}
            </> : <>
                {showIcon ? <>
                    <motion.div
                        id="user-icon"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        onClick={() => {
                            setShow(true)
                        }}>
                        <div id="user-icon-inner">
                            {user ? <h1>{user.name_first.charAt(0).toUpperCase()}</h1> : ''}
                        </div>
                    </motion.div>
                    {show ? <UserSelector setShow={setShow}/> : ''}
                </> : <></>}
            </>
            }
        </>
    )
}

export default UserIcon
