import {apiMethods} from "./TypeKeys";

const Config = {
    data: {
        appName: 'سیستم انبار',
        baseUrl: 'http://localhost:60171',
        apiTimeout: 12000,
    },

    api: {
        login: {
            url: '/api/AvangApi/Login',
            method: apiMethods.post,
        },
        barcode: {
            url: '/api/AvangApi/Barcode',
            method: apiMethods.post,
        },
        getInvocher: {
            url: '/api/AvangApi/GetInvocher',
            method: apiMethods.get,
        },
        getSerialsList: {
            url: '/api/AvangApi/GetSerialsList',
            method: apiMethods.get,
        }
    }
}

export default Config;
