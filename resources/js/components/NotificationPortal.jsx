import {useSelector} from "react-redux";
import {AnimatePresence} from "framer-motion";

const NotificationPortal = () => {

    const notification = useSelector(state => state.application.notification.value)

    return (
        <div className="notification-portal">
            <AnimatePresence mode="wait">
                {notification ? (
                    <>
                        {notification.message ? (
                            <>Notification component goes here</>
                        ) : ''}
                    </>
                ): ''}
            </AnimatePresence>
        </div>
    )
}

export default NotificationPortal
