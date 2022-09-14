import apiService from "./APIService";
import Config from "../res/Config";

export async function callLoginApi(userName, password, desc) {
    return await apiService.call(
        Config.api.login.url,
        Config.api.login.method,
        null,
        null,
        {
            userName: userName,
            password: password,
            loginKind: desc,
        }
    )
}

export async function callGetInvocherApi(type, typeValue, userName, desc) {
    return await apiService.call(
        Config.api.getInvocher.url,
        Config.api.getInvocher.method,
        null,
        null,
        {
            Number: typeValue,
            FiscalYearCode: userName,
            desc: desc,
            inputtype: type,
        }
    );
}
