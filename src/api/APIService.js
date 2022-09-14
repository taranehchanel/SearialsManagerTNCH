import axios from 'axios';
import Config from '../res/Config';
import {apiMethods} from '../res/TypeKeys';

const instance = axios.create({
    baseURL: Config.data.baseUrl,
    timeout: Config.data.apiTimeout,
});

const defaultHeaders = {
    Accept: '*/*',
    'Content-Type': 'application/json',
};

class APIService {
    call = (url, method, apiHeaders, params, data, onSuccess, onError) => {
        return new Promise(async resolve => {
            let headers = defaultHeaders;
            if (apiHeaders) {
                headers = {...defaultHeaders, ...apiHeaders};
            }

            let options;
            if (method === apiMethods.get) {
                options = {
                    url: url,
                    method: method,
                    params: params,
                    headers: headers,
                };
            } else {
                options = {
                    url: url,
                    method: method,
                    data: data,
                    headers: headers,
                };
            }
            const handleSuccess = res => {
                onSuccess?.(res.data);
                resolve({success: true, data: res.data});
            };

            const handleError = error => {
                const err = error.response?.data?.message || 'default error message';
                onError?.(err);
                resolve({success: false, error: err});
            };

            instance(options).then(handleSuccess).catch(handleError);
        });
    };
}

const apiService = new APIService();
export default apiService;

export const getAuthHeader = (token) => {
    if (token) {
        return {Authorization: `${'Bearer ' + token}`};
    } else {
        return null;
    }
};
