import React, { useState, useEffect } from 'react';
import { girdModalData, girdModalDataTitles } from "../res/fakeData";
import SerialsPaginate from "./SerialsPaginate";
import { CSVLink } from 'react-csv';


const SerialItemModal = ({ allData, onClosePress, onCloseModal, productCode, productName,fromInputRef }) => {
    const [allModalData] = useState(allData?.data?.Data?.Result ?? []); // کل داده ها
    const [data, setData] = useState([]); // دیتایی که در هر صفحه هست


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


    const onExcelPress = () => {

    }

    const headers = [
        { label: "ردیف", key: "index" },
        { label: "سریال", key: "serial" },
        { label: "تاریخ", key: "persianDate" },
    ];

    var result = [];
    for (let d of allModalData) {
        if (allModalData !== null) {
            result.push({ index: d.index, serial: d.serial, persianDate: d.persianDate });
        }
    }

    const csvReport = {
        data: result,
        headers: headers,
        filename: 'ExcelSerialExport.csv'
    };

    return (
        <>
            {/* <div className='serialItemModalContainer' onClick={onClosePress} /> */}
            <div className='serialItemModalCentered'>
                <div className='serialItemModal'>
                    <p className='serialItemModalTitle'>{`سریال های ثبت شده کد کالا : ${productCode}`}</p>
                    <p className='serialItemModalTitle' style={{ paddingTop: "initial" }}>{`نام کالا : ${productName}`} </p>

                    {/* <p className='serialItemModalTitle'>{`سریال های ثبت شده کد کالا : ${data[0]?.Code}`}</p> */}


                    <button className='serialItemModalClose' onClick={onCloseModal}>
                        بستن
                    </button>

                    <CSVLink {...csvReport}> <button className='serialItemModalExcel' onClick={onExcelPress} style={{ backgroundColor: "green", color: "white" }}>خروجی اکسل</button> </CSVLink>

                    <div className='serialItemModalGridContainer'>
                        <div className='serialItemModalGrid'>
                            {girdModalDataTitles.map((item, index) => {
                                return (
                                    <div style={{ fontWeight: "bold" }} key={index} className="serialItemModalGridItem">{item}</div>
                                )
                            })}
                            {data.map((item) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <div style={item.IsReg ? { backgroundColor: '#82b182' } : { backgroundColor: 'white' }} className='serialItemModalGridItem'>{item.index}</div>
                                        <div style={item.IsReg ? { backgroundColor: '#82b182' } : { backgroundColor: 'white' }} className='serialItemModalGridItem'>{item.serial}</div>
                                        <div style={item.IsReg ? { backgroundColor: '#82b182' } : { backgroundColor: 'white' }} className='serialItemModalGridItem'>{item.persianDate}</div>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <SerialsPaginate setData={setData} allData={allModalData} />
                </div>
            </div>
        </>
    )
}

export default SerialItemModal;
