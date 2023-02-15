import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Enums from "../res/Enums";
import { storageKeys } from "../res/TypeKeys";
import { login, barcode } from "../api";
import { ToastContainer, toast } from "react-toastify";



const LoginForm = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userPasswordError, setUserPasswordError] = useState(false);
    const [desc, setDesc] = useState(localStorage.getItem(storageKeys.desc) || Enums.Desc.hamkaran);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userName && userPassword) {
            setUserNameError(false);
            setUserPasswordError(false);
            handleLogin();
        } else {
            if (userName === '') {
                setUserNameError(true);
            } else if (userNameError) {
                setUserNameError(false);
            }
            if (userPassword === '') {
                setUserPasswordError(true);
            } else if (userPasswordError) {
                setUserPasswordError(false);
            }
        }
    }

    const handleLogin = () => {
        // navigate("../serials", {replace: true, state: {desc: desc, userName: userName}});
        login(userName, userPassword, desc).then(result => {
            // toast.success("لاگین با موفقیت انجام شد ");
            setUserNameError(false);
            setUserPasswordError(false);
            barcode().then(result => {
                console.log("username :", userName);
                // toast.success("لاگین با موفقیت انجام شد ");
                navigate("../serials", { replace: true, state: { desc: desc, userName: userName, title: desc == Enums.Desc.hamkaran ? userName : result.data.userName } });
                // console.log("desc,", desc);
                localStorage.setItem(storageKeys.desc, desc);

            }).catch(error => {
                // console.log(error);
                toast.error("دوباره تلاش کنید ... ");
            })

        }).catch(error => {
            toast.error("نام کاربری  یا رمز عبور اشتباه است");
        })
    }

    return (
        <div className='formCardViewContainer'>
            <div className='formCardView'>
                <p className='formTitle'>سیستم مدیریت سریال آونگ</p>
                <span className='formTitle'>
                    <i className="bi bi-bootstrap-fill" />
                </span>
                <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                    <label htmlFor="userName">نام کاربری</label><br />
                    <input
                        className={`formInput ${userNameError ? 'formInputError' : ''}`}
                        onChange={(e) => setUserName(e.target.value)}
                        type="text"
                        id="userName"
                        name="userName"
                        placeholder='نام کاربری را وارد نمایید'
                    />
                    <br /><br />
                    <label htmlFor="pass">رمز عبور</label><br />
                    <input
                        className={`formInput ${userNameError ? 'formInputError' : ''}`}
                        onChange={(e) => setUserPassword(e.target.value)}
                        type="password"
                        id="pass"
                        name="pass"
                        placeholder='رمز عبور را وارد نمایید'
                    /><br /><br />
                    <select
                        onChange={(e) => setDesc(e.target.value)}
                        id="system"
                        name="system"
                        value={desc}>
                        <option value={Enums.Desc.hamkaran}>راهکاران</option>
                        <option value={Enums.Desc.crm}>CRM</option>
                    </select>
                    <br /><br />
                    <input
                        className='formInputButton'
                        type="submit"
                        value='ورود'
                    />
                </form>
            </div>
        </div>
    )
}

export default LoginForm;
