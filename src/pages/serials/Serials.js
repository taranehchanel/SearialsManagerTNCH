import React, { useState, useEffect, useRef } from 'react';
import SerialsGridView from "../../components/SerialsGridView";
import SerialItemModal from "../../components/SerialItemModal";
import SerialModalPrint from "../../components/SerialModalPrint";
import { useLocation } from "react-router-dom";
import SerialsCrmForm from "../../components/SerialsCrmForm";
import SerialsPaginate from "../../components/SerialsPaginate";
import Navbar from "../../components/Navbar";
import AboutModal from '../../components/AboutModal';
import Enums from "../../res/Enums";
import SerialsActions from "../../components/SerialsActions";
import { gridData } from "../../res/fakeData";
import SerialsFromToForm from "../../components/SerialsFromToForm";
import { getInvocher, getSerialsList, importSerial, printList, getPrintList, clearPrintList } from "../../api";
import { ToastContainer, toast } from 'react-toastify';


const Serials = () => {
    const { state: { desc, userName, title } = {} } = useLocation(); // پراپز هایی که پاس دادیم به صفحه را دریافت میکند
    const [modalData, setModalData] = useState({ isVisible: false, data: [] }); // مدال
    const [modalDataPrint, setModalDataPrint] = useState({ isVisibleModalPrint: false, dataPrint: [] }); // مدال برای سریال
    const [isVisibleAboutModal, setIsVisibleAboutModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]); // مخصوص هر صفحه است  pageData  در اصل
    const [allData, setAllData] = useState([]); // کل دیتای همه صفحات
    const [selectedItem, setSelectedItem] = useState(null); // ردیفی که انتخاب میشود و آبی میشود
    const [checkedId, setCheckedId] = useState(null); // برای چک باکس
    const [checkFromTo, setCheckFromTo] = useState(false);  // استفاده نشده
    const [register, setRegister] = useState(0);  //new    //  استفاده نشده
    const [loadingImport, setLoadingImport] = useState(false);
    const [forcePage, setForcePage] = useState(0); // برای صفحه بندی که میگرده دنبال رکورد با فلش
    const [productCode, setProductCode] = useState("");
    const [productName, setProductName] = useState("");
    const [itemIsbox, setItemIsbox] = useState(null);
    // const [allModalData, setAllModalData] = useState([]); // کل داده ها
    const [packnumber, setPacknumber] = useState(""); // کل داده ها




    const isCrm = useRef(desc === Enums.Desc.crm).current;   // برای نگهداری متغیر و تغییر آن
    const pageInfo = useRef({ pageNumber: 0, pageCount: 0 }); //  اطلاعات صفحه بندی
    const serialInputRef = useRef(); // خود اینپوت را ذخیره میکنیم که به توابع آن مثل فوکس دسترسی داشته باشیم
    const isFirstTime = useRef(true); // اولین باری است که کامپوننت اومده بالا
    const isFirstApiTime = useRef(true);
    const lastImportIndex = useRef(null); // وقتی یک ردیف انتخاب میکردیم و بعد باید میرفت ردیف های رو به جلو
    const serialReadOnlyInputRef = useRef();
    const fromInputRef = useRef(null);
    const serialRef = useRef(null);

    // const toInputRef = useRef(null);
    const isReverse = useRef(false);


    useEffect(() => {   // بعد از رندر کامپوننت یکبار اجرا میشود تابع داخل آن
        if (isReverse.current) {
            isReverse.current = false;
            handleAutoSelectItemReverse();
        } else {
            handleAutoSelectItem();  //میگردد دنبال اولین آیتم قابل سلکت و بعد از آن اگر
            // هیچ ردیفی قابل سلکت نبود اطلاعات جدول پاک میشه و همینطور وقتی کار یه ردیف تموم شد بره ردیف بعدی انتخاب شود
        }

    }, [data]) //data دیپندنسی این یوزافکت است
    //آرایه ای از دیپندنسی ها میگیره
    //و هر موقع دیتا عوض شد تابع داخل این یوزافکت اجرا میشود
    console.log(pageInfo.current.pageNumber);

    // for(let d in data){
    //     if(data !== null && selectedItem === null) {
    //         setItemIsbox(d.isbox === true)
    //     }
    // }

    const checkSelectable = (item) => {
        // return (isCrm || item.cnt > item.Register);
        return (item.cnt > item.Register);
    }

    const handleSetForcePage = (newForcePage) => {
        if (newForcePage === forcePage) {
            setForcePage(undefined);
            setTimeout(() => {
                setForcePage(newForcePage);
            }, 0)
            return;
        }
        setForcePage(newForcePage);
    }

    const handleAutoSelectItemReverse = () => {
        let hasFound = false;
        for (let i = data.length - 1; i >= 0; i--) {
            let d = data[i];
            if (lastImportIndex.current !== null && lastImportIndex.current < d.index) {
                continue;
            }
            if (checkSelectable(d)) {
                hasFound = true;
                setSelectedItem(d);
                setRegister(d.Register);
                break;
            }
        }

        if (!hasFound) {
            const isFirstPage = pageInfo.current.pageNumber === 0;

            let hasFoundInAll = false;
            for (let a of allData) {
                if (lastImportIndex.current !== null && lastImportIndex.current < a.index) {
                    continue;
                }
                if (checkSelectable(a)) {
                    hasFoundInAll = true;
                    break;
                }
            }
            if (hasFoundInAll) {
                setSelectedItem(null);

                if (!isFirstPage) {
                    isReverse.current = true;
                    handleSetForcePage(pageInfo.current.pageNumber - 1)
                } else {
                    /////// no pre selectable item found
                }
            } else {
                /////// no pre selectable item found
            }
        }
    }

    const handleAutoSelectItem = () => {  // میگردد دنبال اولین رکوردی که قابل سلکت هست و
        // اگر هیچ ردیفی نبود برای انتخاب، جدول حذف میشود
        //  هر ردیف که انتخاب شد و کارش تموم شد میره ردیف بعدی که قابل انتخاب باشه
        // if (isCrm) {
        //     setSelectedItem(data?.[0]);
        // } else {
        let hasFound = false; // آیا پیدا شد یا نه
        for (let d of data) { // دیتای همون صفحه data
            if (lastImportIndex.current !== null && lastImportIndex.current > d.index) {
                continue;
            }
            if (checkSelectable(d)) {   // اگر تعداد بیشتر از ثبت شده باشد،
                hasFound = true;
                setSelectedItem(d);
                console.log('FFOUNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNND : ', d.index);
                // console.log('d.Register:', d.Register);
                isFirstTime.current = false;
                isFirstApiTime.current = false;
                setRegister(d.Register); //new
                break;
            }
        }

        if (!hasFound) {
            const isLastPage = pageInfo.current.pageCount === pageInfo.current.pageNumber + 1;
            setSelectedItem(null);
            if (isLastPage && lastImportIndex.current !== null) {  // اگر آخرین صفحه باشه یعنی یک ردیف ایمپورت شده و حالا باید تصمیم بگیره بره ردیف بعدی یا بمونه توی همون ردیف
                lastImportIndex.current = null; //برای اینکه دوباره لوپ تکرار نشود
                if (pageInfo.current.pageNumber !== 0) { // اگر اولین صفحه نبود ، آخرین پیج است
                    handleSetForcePage(0);  // میره صفحه اول
                } else { // دیتا عوض میشود و دوباره همین تابع اجرا میشود با تفاوت اینکه شماره صفحه عوض شده
                    handleAutoSelectItem(); // تابع بازگشتی میشود اگر 0 نبود یعنی دیتای ما فقط یک پیج دارد
                    return;
                }
            }
            lastImportIndex.current = null;

            if (data.length > 0) {  // اگر دیتایی وجود دارد
                if (isLastPage) {  // آخرین صفحه هست
                    isFirstTime.current = false;
                    let hasFoundInAll = false; // باید تصمیم بگیریم جدول رو حذف کنیم یا توی کل دیتا ردیفی قابل سلکت هست یا نه
                    for (let a of allData) {
                        if (checkSelectable(a)) {
                            hasFoundInAll = true;
                            break;
                        }
                    }
                    if (!hasFoundInAll && !isFirstApiTime.current && !isCrm) { //اگر هیچ ردیفی پیدا نشد و اولین بار هم نبود، جدول را حذف میکنیم
                        console.log('noooooooo selectable item \ndata deleted');
                        setAllData([]); // دیتا را پاک میکنیم ، دراصل جدول کلا پاک میشود و
                        serialInputRef.current?.focus(); // فوکس را میبریم در اینپوتی که شماره سند وارد
                        serialInputRef.current.value = '';
                    }
                } else if (isFirstTime.current) {
                    handleSetForcePage(pageInfo.current.pageNumber + 1); // برای اولین بار اینکار انجام میشود که برود صفحه بعدی
                }
            }
        }
    }

    const setPageInfo = (pInfo) => { //این تابع برای آپدیت نگهداشتن اطلاعات پیج و اینکه چندتا صفحه داریم، در حال حاضر کدوم پیج هستیم  ووو
        pageInfo.current = { ...pageInfo.current, ...pInfo };
    }
    // }
    //}, [data])

    // console.log("userName"  , userName);
    const onClearPrintListSerialClick = () => {
        clearPrintList().then(result => {
            toast.success("لیست سریال با موفقیت پاک شد .");
            console.log(" Clearrrrrrr :::resulttttttttt,", result);
            getPrintList().then(result => {
                console.log("getPrintList + result", result);
                console.log("getPrintList + result.data", result.data);
                console.log("getPrintList + result.data", result.data.serial);
                setModalDataPrint({
                    isVisibleModalPrint: true,
                    dataPrint: result.data || [],
                })
            }).catch(error => {
                console.log("error :: :: ", error);
                toast.error("دوباره تلاش کنید ... ");
            })

        }).catch(error => {
            console.log(error);
            toast.error("دوباره تلاش کنید ... ");
        })
    }


    const onPrintListSerialClick = () => {
        printList().then(result => {
            toast.success("پرینت با موفقیت انجام شد");
            console.log("printList:::resulttttttttt,", result);

        }).catch(error => {
            console.log(error);
            toast.error("دوباره تلاش کنید ... ");
        })
    }

    // برای مدال
    const onDetailPress = (_item) => {
        getSerialsList(_item.StocktakingItemID, _item.invid, _item.Inputtype, desc).then((result) => { //new 11/25
            setModalData({
                isVisible: true,
                data: result || [],
            })
            setProductCode(_item.Code);
            setProductName(_item.Name);
            // console.log("ProductName, نام کالا:", _item.Name);
            // console.log("Code", _item.Code);
            // console.log("Modal result :", result)
        }).catch((error) => {
            console.log(error);
        })
    }

    // برای مدال دوم

    const onSerialPrintPress = (_item) => {
        getPrintList().then((result) => {
            // getSerialsList(_item.invid, desc).then((result) => {
            setModalDataPrint({
                isVisibleModalPrint: true,
                dataPrint: result.data || [],
                // data: result || [],
            })
            setProductCode(_item.Code);
            setProductName(_item.Name);

        }).catch((error) => {
            console.log(error);
        })
    }

    const onCloseModalPress = () => { // مدال را میبندد
        setModalData({ isVisible: false });
    }

    const onCloseModalPrintPress = () => { // مدال دوم را میبندد
        setModalDataPrint({ isVisibleModalPrint: false });
    }

    const onAboutPress = () => {
        setIsVisibleAboutModal(true)
    }
    const onLogOut = () => {
        // window.location.href = 'http://localhost:3000/';
        window.location.href = 'http://10.10.172.2:801';
    }

    const onSubmitCrmForm = (type, typeValue) => {
        setLoading(true);
        setAllData([]);
        setSelectedItem(null);
        // setAllData(gridData);
        getInvocher(typeValue, userName, desc, type.id).then(result => {
            // console.log("result",result);
            setLoading(false);
            // console.log("Result", result?.data?.Data?.model);
            // console.log("Result", result);
            // console.log("Error Message", result?.data?.Data?.Message);
            // console.log("isbox", result?.data?.Data?.model[0].isbox);
            console.log("PPPPPPPPPPPPPaaaaaaack ::: packnumber", result?.data?.Data?.model[0].packnumber);
            setAllData(result?.data?.Data?.model ?? []);
            setPacknumber(result?.data?.Data?.model[0]?.packnumber);
            isFirstApiTime.current = true;
        }).catch((e) => {
            //alert(e);
            toast.error(e.response.data.Data.Message); //از سمت بک باید درست شود
            // toast.error('خطا در بارگذاری اطلاعات .');
            setLoading(false);
        });
    }

    const onSelectRow = (selectedItem) => { // اطلاعات ردیفی که انتخاب میشود را در استیت میریزد
        setSelectedItem(selectedItem);
        // setProductCode(selectedItem?.Code);
        // console.log("selectedItem Code", selectedItem?.Code);
        // setPacknumber(packnumber);
        console.log("sssssssssssssssselectedItem :::  packnumber", selectedItem?.packnumber);

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

    //-----------------------------------------------------------------------------------------------
    const onSubmitSerialRegister = (serial) => {
        let updateSerialSelectedItem = {
            ...selectedItem,
            serial: serial,
        }
        // setLoadingImport(true);      // بعدا
        importSerial(updateSerialSelectedItem).then(result => {
            console.log('RESULTTTTTTTTTTT  ::::: ', result);
            console.log('RESULTTTTTTTTTTT.dataaaaaa  ::::: ', result.data);
            // setLoadingImport(false);   // بعدا
            toast.success('عملیات موفق بود ');
            getPrintList().then(result => {
                console.log("getPrintList + result", result);
                console.log("getPrintList + result.data", result.data);
                console.log("getPrintList + result.data", result.data.serial);
                setModalDataPrint({
                    isVisibleModalPrint: true,
                    dataPrint: result.data || [],
                })
            }).catch(error => {
                console.log("error :: :: ", error);
                toast.error("دوباره تلاش کنید ... ");
            })
        })
            .catch(error => {
                // setLoadingImport(false);
                toast.error(error.response.data.Message);
            })
    }
    //-----------------------------------------------------------------------------------------------


    const onSubmitFromTo = (fromValue, toValue, checkFromTo) => {
        console.log('heyyyyyyyyyyyyyyyyyyyyyy');
        // console.log("sdvnhc kjscncj ns;kjdnfv;kj nk;j;kjhn ;");
        let newSelectedItem = {
            ...selectedItem,
            serial: fromValue,
            serialTo: toValue,
            checkFromTo: (typeof (toValue) === 'undefined' || toValue == null || toValue == '') ? false : true,
            packnumber: packnumber
        }
        //  console.log("IIIIIIIIIIIImportserial +++++ ::: ImportPackageeee :::", packnumber);
        console.log("IIIIIIIIIIIImportserial +++++ ::: newSelectedItem.packnumber :::", newSelectedItem.packnumber);
        console.log("newSelectedItem.serial", newSelectedItem.serial);

        if (newSelectedItem.serial === 'Clear') {
            setLoadingImport(false);
            setAllData([]);
            setSelectedItem(null);
            serialInputRef.current?.focus();
            serialInputRef.current.value = '';
            // serialReadOnlyInputRef.current. ;
            // return;  new taraneh 07/11
        }
        else if (newSelectedItem.serial === "Next Record") {
            lastImportIndex.current = newSelectedItem.index + 1;
            console.log('laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaast :', lastImportIndex.current);
            isFirstTime.current = true; //new 07/11
            handleAutoSelectItem();
        }
        else if (newSelectedItem.serial === "Previous Record") {
            lastImportIndex.current = newSelectedItem.index - 1;
            handleAutoSelectItemReverse();

        }
        else if (newSelectedItem.serial === 'Check' && newSelectedItem.cnt > 1) {
            // newSelectedItem.checkFromTo = true; // زمانی که تکست باکس تا پر شود خودش اوکی میشه نیازی به این کد نیست
            setCheckedId(selectedItem?.Id);
            fromInputRef.current.value = '';
            //toInputRef.current.value = '';

            return;
        }
        else if (newSelectedItem.serial === "UnCheck") {
            setCheckedId(null);
            fromInputRef.current.value = '';
            // toInputRef.current.value = '';

            // newSelectedItem.checkFromTo = false;
            return;
        } else {
            setLoadingImport(true);
            importSerial(newSelectedItem).then(result => {
                // console.log('inja : ', result);
                // return;
                lastImportIndex.current = newSelectedItem.index; //بعد از اینکه ای پی آی کال شد، ما ایندکسش را برای اتوماتیک رفتن به ردیف بعدی در لست ایمپورت ایندکس ذخیره میکنیم
                console.log("result.data.reg", result?.data.reg);
                console.log("newSelectedItem.Register + result.data.reg", newSelectedItem.Register + result?.data.reg);

                setLoadingImport(false);
                const newAllData = [...allData];  //آیتم مختص دیتا عوض شده
                const selectedItemIndex = allData.findIndex(i => i.Id == newSelectedItem.Id);
                newAllData.splice(selectedItemIndex, 1, {
                    ...newSelectedItem,
                    Register: newSelectedItem.Register + result?.data.reg,
                });
                setAllData(newAllData); // این باعث میشود پیجینیت ری رندر شود و دیتا رندر شود و یوزافکت اولی لاجیکش ران میشود

                setRegister(newSelectedItem?.Register + result?.data.reg);
                console.log("newSelectedItem?.Register + result?.data.reg", newSelectedItem?.Register + result?.data.reg);
                setPacknumber(packnumber);  // 1401/10/26 
                setSelectedItem(current => {
                    return {
                        ...current,
                        serial: fromValue,
                        serialTo: toValue,
                        checkFromTo: (typeof toValue === 'undefined' || toValue == null || toValue == '') ? false : true,
                    }
                })
                // console.log("newSelectedItem?.Register + result?.data.reg", newSelectedItem?.Register + result?.data.reg);
                toast.success('عملیات موفق بود ');
            })
                .catch(error => {
                    setLoadingImport(false);
                    toast.error(error.response.data.Message);
                })
        }
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
                    <SerialsActions
                        packnumber={packnumber}
                        item={selectedItem}  // وقتی سلکتد آیتمی داشته باشیم این نمایش داده میشود و  دوم اینکه یکی از پراپ هایی که بهش پاس دادیم یک تابع یا کال بک است
                        serialReadOnlyInputRef={serialReadOnlyInputRef}// معمولا بهتر است توابع داخل این پیاده سازی نشود بلکه اون بالا تعریف شود و اینجا فقط صدا زده شود
                        updateItem={value => {
                            setPacknumber(value);
                            setSelectedItem(current => {
                                return {
                                    ...current,
                                    packnumber: value
                                }
                            })
                        }}
                    />
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
                                fromInputRef={fromInputRef}
                            // toInputRef={toInputRef}

                            />
                        )}

                        <div className={'serialsTableContainer2'}>
                            <SerialsGridView
                                isCrm={isCrm}
                                data={data}
                                onDetailPress={onDetailPress}
                                onSerialPrintPress={onSerialPrintPress}
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

                {modalData.isVisible &&
                    <SerialItemModal
                        allData={modalData.data}
                        onCloseModal={onCloseModalPress}
                        productCode={productCode}
                        productName={productName}
                        fromInputRef={fromInputRef}
                    />}

                {modalDataPrint.isVisibleModalPrint &&
                    !isCrm &&  // موقت
                    <SerialModalPrint
                        onCloseModal={onCloseModalPrintPress}
                        onSubmitSerialRegister={onSubmitSerialRegister}
                        onPrintListSerialClick={onPrintListSerialClick}
                        onClearPrintListSerialClick={onClearPrintListSerialClick}
                        productCode={productCode}
                        productName={productName}
                        fromInputRef={fromInputRef}
                        serialRef={serialRef}
                        allModalData={modalDataPrint.dataPrint}
                        isCrm={isCrm}

                    />}
                {isVisibleAboutModal && <AboutModal setIsVisibleAboutModal={setIsVisibleAboutModal} />}

            </div>

        </React.Fragment>
    )
}

export default Serials;
