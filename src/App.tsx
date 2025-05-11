import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./components/pages/Home.tsx";
import ModeSelection from "./components/pages/ModeSelection.tsx";
import Register from "./components/pages/Register.tsx";
import Game from "./components/pages/Game.tsx"
import {Header} from "./components/layout/Header.tsx";
import Login from "./components/pages/Login.tsx";
import UserAccount from "./components/pages/UserAccount.tsx";
import ResetPassword from "./components/pages/ResetPassword.tsx";
import {AuthProvider} from "./services/auth/AuthContext.tsx";

function App() {
    return (
        <AuthProvider>

            <BrowserRouter>
                <Header/>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/forgot-password" element={<ResetPassword/>}/>
                    <Route path="/mode-selection" element={<ModeSelection/>}/>
                    <Route path="/game" element={<Game/>}/>
                    <Route path="account" element={<UserAccount/>}/>
                </Routes>

            </BrowserRouter>
        </AuthProvider>

    )
}

export default App
