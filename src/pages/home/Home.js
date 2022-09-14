import React from 'react';
import LoginForm from "../../components/LoginForm";
import { ToastContainer, toast } from 'react-toastify';


const Home = () => {
    return (
        <div className='home'>
            <ToastContainer rtl={true} position="top-right" theme="colored" />
            <LoginForm />
        </div>
    );
}

export default Home;
