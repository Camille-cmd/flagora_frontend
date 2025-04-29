import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Home from "./components/Home.tsx";
import ModeSelection from "./components/ModeSelection.tsx";
import Register from "./components/Register.tsx";
import Game from "./components/Game.tsx"

function App() {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {/*<Route path="/login" element={<Login />} />*/}
                <Route path="/register" element={<Register />} />
                <Route path="/mode-selection" element={<ModeSelection />} />
                <Route path="/game" element={<Game />} />
                {/*<Route path="/stats" elemet={<Stats />} />*/}
            </Routes>
        </Router>

    )
}

export default App
