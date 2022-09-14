import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Serials from "./pages/serials/Serials";
import { ToastContainer, toast } from 'react-toastify';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="serials" element={<Serials />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
