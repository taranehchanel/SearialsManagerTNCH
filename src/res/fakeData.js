export const girdModalDataTitles = ['ردیف', 'سریال', 'تاریخ'];
// export const girdModalDataPrintTitles = ['سریال'];


// const makeModalData = (count) => {
//     const data = [];
//     for (let i = 0; i < count; i++) {
//         data.push({
//             id: i,
//             serial: 'sdf293487jsl ' + i,
//             date: '1402/04/01',
//         })
//     }
//     return data;
// }

// export const girdModalData = makeModalData(50);

export const girdDataTitles = [
    '',
    '',
    'انبار',
    'کد کالا',
    'نام کالا',
    'تعداد',
    'ثبت شده',
    '',
    'پرینت', // index=8 اینو برای سی آر ام نمیخوایم
    'از تا',
];
export const crmGirdDataTitles = [
    '',
    '',
    'انبار',
    'کد کالا',
    'نام کالا',
    'تعداد',
    'ثبت شده',
    '',
    'از تا',
];

const name = 'alksdf  lkasdflk ksdfj alksd ssf';
const code = '10000000000213';
const s = 'انبار دبی';
const invText = "حواله بین انبار از داغی - تهران به انبار مستعمل - انبار مرکزی";

const makeSerialsData = (count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            Id: "f35d3cb6-50f4-ec11-b2aa-000c29e47bf3" + i,
            Store: s,
            Code: code,
            Name: name,
            isbox: i < 5,
            invtext: invText + ' ' + i,
            cnt: i % 3 ? 1 : i === 0 ? 2 : 0,
            Register: 0,
            Inventory: i % 3 ? 1 : 0,
            Cost: 0,
        });
    }
    return data;
}

export const gridData = makeSerialsData(61);
