import React, { useState, useEffect, useRef } from 'react';
import SerialsGridView from "../../components/SerialsGridView";
import SerialItemModal from "../../components/SerialItemModal";
import { useLocation } from "react-router-dom";
import SerialsCrmForm from "../../components/SerialsCrmForm";
import SerialsPaginate from "../../components/SerialsPaginate";
import Navbar from "../../components/Navbar";
import AboutModal from '../../components/AboutModal';
import Enums from "../../res/Enums";
import SerialsActions from "../../components/SerialsActions";
import { gridData } from "../../res/fakeData";
import SerialsFromToForm from "../../components/SerialsFromToForm";
import { getInvocher, getSerialsList, importSerial } from "../../api";
import { ToastContainer, toast } from 'react-toastify';


const Serials = () => {
    const { state: { desc, userName, title } = {} } = useLocation();
    const [modalData, setModalData] = useState({ isVisible: false, data: [] })
    const [isVisibleAboutModal, setIsVisibleAboutModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedId, setCheckedId] = useState(null);
    const [checkFromTo, setCheckFromTo] = useState(false);
    const [register, setRegister] = useState(0);  //new
    const [loadingImport, setLoadingImport] = useState(false);
    const [forcePage, setForcePage] = useState(0);
    const [productCode, setProductCode] = useState("");


    const isCrm = useRef(desc === Enums.Desc.crm).current;
    const pageInfo = useRef({ pageNumber: 0, pageCount: 0 });
    const serialInputRef = useRef();
    const isFirstTime = useRef(true);
    const isFirstApiTime = useRef(true);
    const lastImportIndex = useRef(null);


    useEffect(() => {
        handleAutoSelectItem();
    }, [data])


    const handleAutoSelectItem = () => {
        // if (isCrm) {
        //     setSelectedItem(data?.[0]);
        // } else {
        let hasFound = false;
        for (let d of data) {
            if (lastImportIndex.current && lastImportIndex.current > d.index) {
                continue;
            }
            if (d.cnt > d.Register) {
                hasFound = true;
                setSelectedItem(d);
                isFirstTime.current = false;
                isFirstApiTime.current = false;
                setRegister(d.Register); //new
                break;
            }
        }

        if (!hasFound) {
            const isLastPage = pageInfo.current.pageCount === pageInfo.current.pageNumber + 1;
            setSelectedItem(null);
            if (isLastPage && lastImportIndex.current !== null) {
                lastImportIndex.current = null;
                if (pageInfo.current.pageNumber !== 0) {
                    setForcePage(0);
                } else {
                    handleAutoSelectItem();
                    return;
                }
            }
            lastImportIndex.current = null;

            if (data.length > 0) {
                if (isLastPage) {
                    let hasFoundInAll = false;
                    for (let a of allData) {
                        if (a.cnt > a.Register) {
                            hasFoundInAll = true;
                            break;
                        }
                    }
                    if (!hasFoundInAll && !isFirstApiTime.current) {
                        console.log('noooooooo selectable item \ndata deleted');
                        setAllData([]);
                        serialInputRef.current?.focus();
                        serialInputRef.current.value = '';
                    }
                } else if (isFirstTime.current) {
                    setForcePage(pageInfo.current.pageNumber + 1);
                }
            }
        }
    }

    const setPageInfo = (pInfo) => {
        pageInfo.current = { ...pageInfo.current, ...pInfo };
    }
    // }
    //}, [data])

    // console.log("userName"  , userName);

    // برای مدال
    const onDetailPress = (_item) => {
        getSerialsList(_item.invid, desc).then((result) => {
            setModalData({
                isVisible: true,
                data: result || [],
            })
            setProductCode(_item.Code);
            console.log("Code", _item.Code);
            console.log("Modal result :", result)
        }).catch((error) => {
            console.log(error);
        })
    }

    const onCloseModalPress = () => {
        setModalData({ isVisible: false });
    }

    const onAboutPress = () => {
        setIsVisibleAboutModal(true)
    }
    const onLogOut = () => {
        window.location.href = 'http://localhost:3000/';
    }

    const onSubmitCrmForm = (type, typeValue) => {
        setLoading(true);
        setSelectedItem(null);
        // setAllData(gridData);
        getInvocher(typeValue, userName, desc, type.id).then(result => {
            // console.log("result",result);
            setLoading(false);
            console.log("Result", result?.data?.Data?.model);
            setAllData(result?.data?.Data?.model ?? []);
            isFirstApiTime.current = true;
        }).catch((e) => {
            //alert(e);
            toast.error('خطا در بارگذاری اطلاعات .')
            setLoading(false);
        });
    }

    const onSelectRow = (selectedItem) => {
        setSelectedItem(selectedItem);
        // setProductCode(selectedItem?.Code);
        // console.log("selectedItem Code", selectedItem?.Code);
    }

    //چک باکس
    const onToggleCheck = (_checkedId, value) => {
        if (_checkedId === checkedId) {
            setCheckedId(null);
            setCheckFromTo(false);

        } else {
            setCheckedId(_checkedId);
            setCheckFromTo(true);

        }
    }

    const onSubmitFromTo = (fromValue, toValue, checkFromTo) => {
        // console.log("sdvnhc kjscncj ns;kjdnfv;kj nk;j;kjhn ;");
        let newSelectedItem = {
            ...selectedItem,
            serial: fromValue,
            serialTo: toValue,
            checkFromTo: (typeof (toValue) === 'undefined' || toValue == null || toValue == '') ? false : true,
        }

        setLoadingImport(true);
        importSerial(newSelectedItem).then(result => {
            lastImportIndex.current = newSelectedItem.index;
         console.log("result.data.reg",result?.data.reg);
            setLoadingImport(false);
            const newAllData = [...allData];
            const selectedItemIndex = allData.findIndex(i => i.Id == newSelectedItem.Id);
            newAllData.splice(selectedItemIndex, 1, {
                ...newSelectedItem,
                Register: newSelectedItem.Register + result?.data.reg,
            });
            setAllData(newAllData);

            setRegister(newSelectedItem?.Register + result?.data.reg);

            setSelectedItem(current => {
                return {
                    ...current,
                    serial: fromValue,
                    serialTo: toValue,
                    checkFromTo: (typeof (toValue) === 'undefined' || toValue == null || toValue == '') ? false : true,
                }
            })
            toast.success('عملیات موفق بود ');
        })
            .catch(error => {
                setLoadingImport(false);
                toast.error(error.response.data.Message);
            })
    }

    return (
        <React.Fragment>
            <ToastContainer rtl={true} position="top-right" theme="colored" />
            <Navbar onAboutPress={onAboutPress} title={title} onLogOut={onLogOut} />
            <div className='serialsContainer'>
                <SerialsCrmForm
                    onSubmitCrmForm={onSubmitCrmForm}
                    isCrm={isCrm}
                    serialInputRef={serialInputRef} />
                {selectedItem && (
                    <SerialsActions item={selectedItem} updateItem={value => setSelectedItem(current => {
                        return {
                            ...current,
                            packnumber: value
                        }
                    })} />
                )}

                {loading ?
                    <div className='loader' />
                    : allData?.length > 0 &&
                    <div className={'serialsTableContainer'}>

                        {selectedItem && (
                            <SerialsFromToForm
                                onSubmitFromTo={onSubmitFromTo}
                                checkedId={checkedId}
                                checkFromTo={checkFromTo}
                                selectedItem={selectedItem}
                                loadingImport={loadingImport}
                                allData={allData}
                            />
                        )}

                        <div className={'serialsTableContainer2'}>
                            <SerialsGridView
                                isCrm={isCrm}
                                data={data}
                                onDetailPress={onDetailPress}
                                onSelectRow={onSelectRow}
                                selectedRowId={selectedItem?.Id}
                                setCheckedId={setCheckedId}
                                checkedId={checkedId}
                                setCheckFromTo={setCheckFromTo}
                                checkFromTo={checkFromTo}
                                onToggleCheck={onToggleCheck}

                            />
                            <SerialsPaginate
                                setData={setData}
                                allData={allData}
                                forcePage={forcePage}
                                setPageInfo={setPageInfo} />

                        </div>

                    </div>

                }

                {modalData.isVisible && <SerialItemModal allData={modalData.data} onCloseModal={onCloseModalPress} productCode={productCode} />}

                {isVisibleAboutModal && <AboutModal setIsVisibleAboutModal={setIsVisibleAboutModal} />}

            </div>

        </React.Fragment>
    )
}

export default Serials;
