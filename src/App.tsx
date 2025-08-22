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
import EmailConfirm from "./components/pages/EmailConfirm.tsx";
import UserStats from "./components/pages/UserStats.tsx";

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
                        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm/>}/>
                        <Route path="/email-confirmation/:uid/:token" element={<EmailConfirm/>}/>
                        <Route path="/mode-selection" element={<ModeSelection/>}/>
                        <Route path="/game/countries" element={<Game gameMode={"GUESS_COUNTRY_FROM_FLAG"}/>}/>
                        <Route path="/game/cities" element={<Game gameMode={"GUESS_CAPITAL_FROM_COUNTRY"}/>}/>

                        <Route
                            path="account"
                            element={
                                <ProtectedRoute>
                                    <UserAccount/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="stats"
                            element={
                                <ProtectedRoute>
                                    <UserStats/>
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
