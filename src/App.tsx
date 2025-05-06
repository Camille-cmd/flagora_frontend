import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Home from "./components/pages/Home.tsx";
import ModeSelection from "./components/pages/ModeSelection.tsx";
import Register from "./components/pages/Register.tsx";
import Game from "./components/pages/Game.tsx"
import {Header} from "./components/layout/Header.tsx";
import Login from "./components/pages/Login.tsx";

function App() {
    return (

        <Router>
            <Header/>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/mode-selection" element={<ModeSelection/>}/>
                <Route path="/game" element={<Game/>}/>
                {/*<Route path="/stats" elemet={<Stats />} />*/}
            </Routes>
        </Router>

    )
}

export default App
