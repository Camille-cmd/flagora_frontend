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
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import {AlertProvider} from "./contexts/AlertContext.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import AlertPopup from "./components/common/Alert/AlertPopup.tsx";
import ResetPasswordConfirm from "./components/pages/ResetPasswordConfirm.tsx";

function App() {

    return (
        <AuthProvider>
        <AlertProvider>

            <BrowserRouter>
                <Header/>

                <AlertPopup></AlertPopup>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/forgot-password" element={<ResetPassword/>}/>
                    <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/mode-selection" element={<ModeSelection/>}/>
                    <Route path="/game" element={<Game/>}/>

                    <Route
                        path="account"
                        element={
                            <ProtectedRoute>
                                <UserAccount/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>

            </BrowserRouter>

        </AlertProvider>
        </AuthProvider>
    )
}

export default App
