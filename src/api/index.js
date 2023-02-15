import api from './apiKit'
import * as url from './apiUrl'
import { CreateDeliverPackage } from "./apiUrl";
/////////////////////////////////////////////////////////////////////////////


// http://localhost:60171/api/AvangApi/Login?userName=CRMAdmin&password=9M5A8vagQr%40%25g%2FVL&loginKind=2
export const login = (userName, password, loginKind) =>
    Promise.resolve(api.post(`${url.Login}?userName=${userName}&password=${password}&loginKind=${loginKind}`, {}))


//http://localhost:60171/api/AvangApi/Barcode
export const barcode = () =>
    Promise.resolve(api.get(url.Barcode))


// http://localhost:60171/api/AvangApi/GetInvocher
export const getInvocher = (num, FiscalYearCode, desc, inputtype) => {
    let model = {
        Number: num,
        TemplateCode: {
            Id: "string",
            Name: "string"
        },
        FiscalYearCode: FiscalYearCode,
        StoreCode: {
            Code: "string",
            Name: "string"
        },
        Desc: desc,
        InputType: inputtype
    }
    return Promise.resolve(api.post(`${url.GetInvocher}`, model))
}


// http://localhost:60171/api/AvangApi/GetSerialsList?invid=85fd11c1-5ffb-ec11-b2af-000c29e47bf3&desc=2
export const getSerialsList = (StocktakingItemID, invid, Inputtype, desc) =>
    Promise.resolve(api.post(`${url.GetSerialsList}?StocktakingItemID=${StocktakingItemID}&invid=${invid}&Inputtype=${Inputtype}&desc=${desc}`, {}))


// http://localhost:60171/api/AvangApi/Create_DeliverPackage?PackNumber=71398&InputType=1
export const createDeliverPackage = (item, packNumber, inputType) =>
    Promise.resolve(api.post(`${url.CreateDeliverPackage}?PackNumber=${packNumber}&InputType=${inputType}`,
        item,
        // PackNumber: packNumber,
        // InputType: inputType
    ))


// http://localhost:60171/api/AvangApi/Show_DeliverPackage?PackNumber=71398
export const showDeliverPackage = (packnumber) =>
    Promise.resolve(api.post(`${url.ShowDeliverPackage}?PackNumber=${packnumber}`, {}
    ))


// http://localhost:60171/api/AvangApi/GetExcel?desc=2
export const getExcel = (desc) =>
    Promise.resolve(api.get(`${url.GetExcel}?desc=${desc}`, {}))


// http://localhost:60171/api/AvangApi/ImportSerial
export const importSerial = (item) =>
    Promise.resolve(api.post(`${url.ImportSerial}`, item,
    ))

//http://localhost:60171/api/AvangApi/PrintList
export const printList = () =>
    Promise.resolve(api.post(`${url.PrintList}`))


//http://localhost:60171/api/AvangApi/GetPrintList
export const getPrintList = () =>
    Promise.resolve(api.get(`${url.GetPrintList}`))

//http://localhost:60171/api/AvangApi/ClearPrintList
export const clearPrintList = () =>
    Promise.resolve(api.post(`${url.ClearPrintList}`))


