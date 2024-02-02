import {useSelector} from "react-redux";
import {useState} from "react";

const Home = () => {

    const user = useSelector(state => state.user.value)
    const [show, setShow] = useState({
        security: true
    })

    return (
        <></>
    )
}

export default Home
