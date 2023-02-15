import React, { useState, useEffect } from 'react';
import { girdModalData, girdModalDataTitles, girdModalDataPrintTitles } from "../res/fakeData";
import SerialsPaginate from "./SerialsPaginate";
import { CSVLink } from 'react-csv';


const SerialModalPrint = ({ allModalData, allData, onClosePress, onCloseModal, productCode, productName, fromInputRef, serialRef, onSubmitSerialRegister, onPrintListSerialClick, onClearPrintListSerialClick, isCrm }) => {
    //const [allModalData, setAllModalData] = useState([]); // کل داده ها
    // const [allModalDataPrintShow] = useState(allModalData ?? []); // کل داده ها
    const [data, setData] = useState([]); // دیتایی که در هر صفحه هست
    const [serial, setSerial] = useState(''); // کل داده ها
    const [serialError, setSerialError] = useState(false);


    console.log("allModalData in SErial Modal Printttttt", allModalData)
    // const onExcelPress = (data: any) => {
    //     return getRequest(URL.get, data)
    // }

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                onCloseModal();
                fromInputRef.current?.focus();  //new yalda
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [])

    useEffect(() => {
        serialRef.current.value = '';
        // toInputRef.current.value = '';
        setSerial('');
    }, [])

    // const onExcelPress = () => {

    // }

    const onChangeSerial = (e) => {
        e.preventDefault();
        setSerial(e.target.value)
    }
    console.log("HHHHHHHHHHHHHHHHHHHH::::Serial:", serial);

    const handleSubmit = () => {
        if (serial) {
            setSerialError(false);
            //allModalData.push(serial);
            //setAllModalData(allModalData);
            onSubmitSerialRegister(serial);
            serialRef.current.value = '';  // باید خالی بشه بعد از ورود و اینتر زدن 09/02
            // toInputRef.current.value = '';  // باید خالی بشه بعد از ورود و اینتر زدن 09/21
        } else {
            if (serial === '') {
                setSerialError(true);
            } else if (serial) {
                setSerialError(false);
            }
        }
    }
    console.log("tttttttttttttttttt : AllModalData: ", allModalData);


    const handleEnterSubmit = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
            serialRef.current.value = '';  //  باید خالی بشه بعد از ورود و اینتر زدن 09/02
            // toInputRef.current.value = '';  //  باید خالی بشه بعد از ورود و اینتر زدن 09/21
            // fromInputRef.current?.focus(); //09/21
            e.preventDefault();
            // setAllModalData(allModalData);   جهت پر کردن و نمایش لیستی از سریالهای ثبت شده
        }
    }

    return (
        <form className='serialItemModalCentered' noValidate autoComplete='off' onSubmit={handleSubmit}>
            {/* <> */}
            {/* <div className='serialItemModalContainer' onClick={onClosePress} /> */}
            <div className='serialItemModalCentered'>
                <div className='serialItemModal'>
                    <p className='serialItemModalTitle'>{`سریال های ثبت شده کد کالا : ${productCode}`}</p>
                    <p className='serialItemModalTitle' style={{ paddingTop: "initial" }}>{`نام کالا : ${productName}`} </p>

                    {/* <p className='serialItemModalTitle'>{`سریال های ثبت شده کد کالا : ${data[0]?.Code}`}</p> */}


                    <button className='serialItemModalClose' onClick={onCloseModal}>
                        بستن
                    </button>

                    {/* <CSVLink {...csvReport}> <button className='serialItemModalExcel' onClick={onExcelPress} style={{ backgroundColor: "green", color: "white" }}>خروجی اکسل</button> </CSVLink> */}
                    <input
                        ref={serialRef}
                        className={'fromToInput'}
                        onKeyDown={handleEnterSubmit}
                        onChange={onChangeSerial}
                        // value={typeValue}
                        type="text"
                        id="typeValue"
                        name="typeValue"
                        placeholder={'سریال'}
                    // autoComplete="off"
                    />
                    <div className='serialItemModalGridContainer'>
                        <div className='serialItemModalGrid'>
                            {girdModalDataTitles.map((item, index) => {
                                return (
                                    <div style={{ fontWeight: "bold" }} key={index} className="serialItemModalGridItem">{item}</div>
                                )
                            })}
                            {allModalData.map((item) => {
                                return (
                                    <React.Fragment >
                                        {<div className='serialItemModalGridItem'>{item.index}</div>}
                                        {<div className='serialItemModalGridItem'>{item.serial}</div>}
                                        {<div className='serialItemModalGridItem'>{item.persianDate}</div>}

                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <br />
                    {/* <button style={{ height: "35px" }} className='cButton serialActionRegister' onClick={(e) => {
                        onPrintListSerialClick();
                        e.preventDefault()
                        e.stopPropagation()
                    }}>
                        پرینت لیست سریال */}
                    {/* onClick={() => onPrintListSerialClick()} */}
                    {/* </button> */}
                    <div className={'serialActionRow'}>
                        <button className='cButton serialActionRegister' onClick={(e) => {
                            onPrintListSerialClick();
                            e.preventDefault()
                            e.stopPropagation()
                        }}>
                            پرینت لیست سریال
                        </button>
                        <button className='cButton serialActionShow' onClick={(e) => {
                            onClearPrintListSerialClick();
                            e.preventDefault()
                            e.stopPropagation()
                        }}>
                            پاک کردن لیست سریال
                        </button>
                    </div>
                    {/* <SerialsPaginate setData={setData} allData={allModalData} /> */}
                </div>
            </div>
            {/* </> */}
        </form>
    )
}

export default SerialModalPrint;
