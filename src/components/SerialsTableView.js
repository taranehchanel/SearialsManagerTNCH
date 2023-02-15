import React from 'react';

const serialsTitles = [
    '',
    '',
    'کد انبار',
    'کد کالا',
    'نام کالا',
    'تعداد',
    'ثبت شده',
    '',
    'از\nتا',
]

const SerialsTableView = ({ data }) => {
    return (
        <table>
            <tr>
                {serialsTitles.map((item, index) => {
                    return (
                        <th key={index} >{item}</th>
                    )
                })}
            </tr>
            {data.map((item, index) => {
                return (
                    <tr key={item.id}>
                        <td>{index}</td>
                        <td>{'icon modal'}</td>
                        <td>{item.storeName}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.count}</td>
                        <td>{item.register}</td>
                        <td>{'icon unknown'}</td>
                        <td>{item.date}</td>
                    </tr>
                )
            })}
        </table>
    )
}

export default SerialsTableView;
