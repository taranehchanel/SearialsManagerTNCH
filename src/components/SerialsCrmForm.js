import React, { useState, useRef } from 'react';

const SerialsCrmForm = ({ onSubmitCrmForm, isCrm, serialInputRef }) => {
    const types = useRef([
        { id: 1, name: 'کد سند' },
        { id: 2, name: 'کد انبار' },
        { id: 3, name: 'شماره پرونده' },
        { id: 4, name: 'شماره موبایل' },
        { id: 5, name: 'ثبت سند انبار' },
        { id: 6, name: 'انبارگردانی' },
    ]).current;

    const [type, setType] = useState(types[0]);
    const [typeValue, setTypeValue] = useState('');
    const [typeValueError, setTypeValueError] = useState(false);
    // const [crm, setCrm] = useState(2);



    const handleSubmit = (e) => {
        e?.preventDefault();
        if (typeValue) {
            setTypeValueError(false);
            onSubmitCrmForm(type, typeValue);
        } else {
            setTypeValueError(true);
        }
    }

    const onChangeValue = (e) => {
        e.preventDefault();
        setTypeValue(e.target.value)
    }

    const handleEnterSubmit = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }

    return (
        <form className='serialForm' noValidate autoComplete='off' onSubmit={handleSubmit}>
            {isCrm && (
                <select
                    onChange={(e) => setType(types.filter(i => i.id == e.target.value)[0])}
                    id="system"
                    name="system">
                    {types.map(t => {
                        return (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        )
                    })}
                </select>
            )}
            <br />
            <div className='serialInputRow'>
                <input
                    className={`formInput ${typeValueError ? 'formInputError' : ''} serialInput`}
                    ref={serialInputRef}
                    onKeyDown={handleEnterSubmit}
                    onChange={onChangeValue}
                    // value={typeValue}
                    type="text"
                    id="typeValue"
                    name="typeValue"
                    placeholder={"لطفا " + type.name + " را وارد نمایید"}
                    autoFocus={true}
                />
            </div>
        </form>
    )
}

export default SerialsCrmForm;
