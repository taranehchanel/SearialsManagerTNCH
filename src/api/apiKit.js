import axios from 'axios'
import * as  url from './apiUrl'

let ApiKit = axios.create({
    baseURL: url.BASE_URL,
    timeout: 30000000,
})

// ApiKit.interceptors.request.use(function (config) {
//     var userInfo = JSON.parse(localStorage.getItem('user_info'));
//     if (userInfo && userInfo.accessToken) {
//         config.headers.Authorization = `Bearer ${userInfo?.accessToken}`;
//     }
//     return config
// })

// ApiKit.interceptors.response.use(
//     (r) => r,
//     (e) => errorHandler(e)
// )

// // async function refreshToken() {
// //     var userInfo = JSON.parse(localStorage.getItem('user_info'));
// //     try {
// //         const r = await ApiKit.post(`${url.AUTH}/refresh-token`, {
// //             refreshToken: userInfo.refreshToken,
// //             userId: `${userInfo.userId}`
// //         })
// //         localStorage.setItem("user_info", JSON.stringify(r.data))
// //         ApiKit._refreshingToken = false;
// //         return await Promise.resolve(true)
// //     } catch (error) {
// //         ApiKit._refreshingToken = false;
// //         localStorage.clear()
// //         window.location.reload();
// //         return await Promise.reject(error)
// //     }
// // }

// const errorHandler = async (error) => {
//     console.log("error", {...error});
//     const statusCode = error.response ? error.response.status : null;
//     const throwError = true;

//     if (error.code && error.code === "ECONNABORTED") {
//         error.response = { data: "خطا در برقراری ارتباط با سرور" };
//     }

//     if (statusCode === 401) {
//         if (ApiKit._refreshingToken !== true) {
//             ApiKit._refreshingToken = true;
//             var resp = await refreshTokenIfNeeded();

//             if (resp) {
//                 ApiKit._refreshingToken = false;
//                 return ApiKit.request(error.config);
//             }
//             else {
//                 ApiKit._refreshingToken = false;
//                 localStorage.clear()
//                 window.location.reload();
//             }
//         }
//     }

//     if (statusCode == 403) {
//         return Promise.reject({ message: 'امکان دسترسی به این بخش وجود ندارد.', ...error });
//     }

//     if (statusCode >= 500) {
//     }

//     if (statusCode === 400) {
//     }

//     if (throwError && error && error.response && error.response.data)
//         return Promise.reject({ message: error.response.data, ...error });
// }

export default ApiKit




// export const refreshTokenIfNeeded = async () => {
//     try {
//         const r = await refreshToken()
//         localStorage.setItem("user_info", JSON.stringify(r.data))
//         ApiKit._refreshingToken = false;
//         return await Promise.resolve(true)
//     } catch (error) {
//         ApiKit._refreshingToken = false;
//         localStorage.clear()
//         window.location.reload();
//         return await Promise.reject(error)
//     }
// }
