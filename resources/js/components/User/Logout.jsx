import {useState} from "react";
import InLineButton from "@/elements/InLineButton.jsx";

const Logout = ({setLoading}) => {

    const [logout, setLogout] = useState(false)

    return (
        <>
            {logout ? <div id="confirm-logout">
                <p id="logout-confirm">
                    <span>Are you sure?</span>
                    <br/>
                    <span className="op-05">You will be logged out and your browser data will be cleared</span>
                    <br/>
                    <div id="logout-confirm-actions">
                        <InLineButton onClick={() => {
                            setLogout(false)
                        }}>No</InLineButton>
                        <InLineButton onClick={async () => {
                            setLoading(true)
                            await axios.post('https://auth.nonverse.test/logout', {}, {
                                withCredentials: true
                            })
                                .then(async response => {
                                    if (response.data.data.success) {
                                        await axios.post('/logout')
                                            .then(response => {
                                                if (response.data.success) {
                                                    window.location.reload()
                                                }
                                            })
                                    }
                                })
                        }}>Yes</InLineButton>
                    </div>
                </p>
            </div> : <InLineButton id="user-logout" onClick={() => {
                setLogout(true)
            }}>Logout</InLineButton>}
        </>
    )
}

export default Logout
