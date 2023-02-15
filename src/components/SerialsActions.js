import React, { useState } from 'react';
import { createDeliverPackage, showDeliverPackage } from "../api";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const SerialsActions = ({ item, packnumber, updateItem, serialReadOnlyInputRef }) => {
    const [boxNumberError, setBoxNumberError] = useState(false)
    // const { state: { type } = {} } = useLocation();
    const checkBoxNumber = () => {
        if (item.packnumber.trim().length > 0) {
            setBoxNumberError(false);
            return true;
        } else {
            setBoxNumberError(true);
            return false;
        }
    }

    console.log("BBBBBBBBefore CCCCCreate item.packnumber", packnumber);

    // crmClick
    const onRegisterClick = () => {
        // if (checkBoxNumber()) {
        //     createDeliverPackage(item, item.number, item.inputtype).then((result) => {

        //     }).catch((error) => {

        //     })
        // }
        createDeliverPackage(item, item.packnumber, item.Inputtype).then((result) => {
            // console.log("result", result);
            // console.log("result.data", result.data);
            // console.log("result.data.suc", result.data.suc);
            // console.log("result.data.reg", result.data.reg);

            if (result.data) {
                if (result.data.suc === true) {
                    updateItem(result.data.reg);
                }
                else {
                    item.packnumberEnable = true;
                }
            }
            else {
                item.packnumberEnable = true;
            }

        }).catch((error) => {
            console.log("error", error);

            toast.error(error.response.data.Message);
        })
    };

    console.log("AAAAAfter CCreate item.packnumber", packnumber);

    //ShowcrmClick
    const onShowClick = () => {
        // if (checkBoxNumber()) {
        //     showDeliverPackage(item.packnumber).then((result) => {

        //     }).catch((error) => {

        //     })
        // }
        console.log('item.packnumber', packnumber);
        if (item.packnumber !== null) {
            showDeliverPackage(item.packnumber).then((result) => {
                if (result.data) {
                    try {
                        window.open(result.data.Data.Url);
                    } catch (error) {
                        toast.error(error);
                    }
                    window.open(result.data.Data.Url);
                }
                else {

                    toast.error('خطا در دریافت اطلاعات مجددا تلاش کنید');
                }
            }).catch((error) => {
                toast.error('خطا در دریافت اطلاعات مجددا تلاش کنید');
            })
        }
    };

    return (
        <div className={'serialsActionContainer'}>
            <input
                className={'serialActionInputReadOnly'}
                value={item.invtext}
                type="text"
                readOnly={true}
                ref={serialReadOnlyInputRef}
                style={{ fontSize: "inherit" }}
            />
            {item.isbox && (
                <div className={'serialActionIsBoxContainer'}>
                    <label htmlFor="boxNumber">بسته انبار</label>
                    <input
                        className={`formInput ${boxNumberError ? 'formInputError' : ''} serialActionInput`}
                        onChange={(e) => updateItem(e.target.value)}
                        type="text"
                        id="boxNumber"
                        name="boxNumber"
                        value={packnumber}
                        placeholder='شماره بسته را وارد کنید'
                    />

                    <div className={'serialActionRow'}>
                        <button className='cButton serialActionRegister' onClick={onRegisterClick}>
                            ثبت بسته
                        </button>
                        <button className='cButton serialActionShow' onClick={onShowClick}>
                            نمایش بسته
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer rtl={true} position="top-right" theme="colored" />

        </div>
    )
}

export default SerialsActions;
