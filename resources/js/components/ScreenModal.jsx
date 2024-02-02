import {useDispatch} from "react-redux";
import {closeModal} from "../state/app/modal";
import {motion} from "framer-motion";
import Loader from "./Loader";

const ScreenModal = ({id, heading, subHeading, loading, children}) => {

    const dispatch = useDispatch()

    return (
        <motion.div layout className="modal-wrapper screen-modal content-container"
                    key={heading}
                    initial={{width: 0, x: "100%"}}
                    animate={{width: "100%", x: 0}}
                    exit={{width: "100%", x: 0}} // TODO Fix exit animation
                    transition={{duration: .1}}
        >
            {loading ? (
                <div className="screen-modal-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <div className="screen-modal-heading">
                        <div className="screen-modal-back" onClick={() => {
                            dispatch(closeModal())
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="24" viewBox="0 0 40 24"
                                 fill="none"
                                 stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="feather feather-arrow-left">
                                <line x1="30" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </div>
                        <div className="content-heading">
                            <h1>{heading}</h1>
                            <h2>{subHeading}</h2>
                        </div>
                    </div>
                    <div className="content" id={id}>
                        {children}
                    </div>
                </>
            )}
        </motion.div>
    )
}

export default ScreenModal