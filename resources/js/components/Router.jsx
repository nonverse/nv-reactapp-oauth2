import {Route, Routes, useLocation} from "react-router";
import {AnimatePresence} from "framer-motion";
import Home from "./Home/Home.jsx";

const Router = () => {

    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                // Views
                <Route path={"/"} element={<Home/>}/>
            </Routes>
        </AnimatePresence>
    )
}

export default Router
