import React, { useState, useRef, useEffect } from 'react';
import { NavItem } from 'react-bootstrap';
import { importSerial } from '../api';
import { ImportSerial } from '../api/apiUrl';

const SerialsFromToForm = ({ checkedId, count, onSubmitFromTo, selectedItem, loadingImport, allData, fromInputRef }) => {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [fromError, setFromError] = useState(false);
    const [toError, setToError] = useState(false);
    // const [checkFromTo, setCheckFromTo] = useState(false);


    // const fromInputRef = useRef(null);

    useEffect(() => {
        if (selectedItem) {
            fromInputRef.current?.focus();
        }
    }, [selectedItem, checkedId])

    useEffect(() => {
        fromInputRef.current.value = '';
        // toInputRef.current.value = '';
        setFromValue('');
        setToValue('');
    }, [allData, selectedItem])



    const onChangeFromValue = (e) => {
        e.preventDefault();
        setFromValue(e.target.value)
    }

    const onChangeToValue = (e) => {
        e.preventDefault();
        setToValue(e.target.value)
    }

    const handleSubmit = () => {
        // if (fromValue && toValue) {
        if (fromValue) {
            setFromError(false);
            setToError(false);
            const _toValue = checkedId === selectedItem.Id ? toValue : '';
            onSubmitFromTo(fromValue, _toValue);
            fromInputRef.current.value = '';  // باید خالی بشه بعد از ورود و اینتر زدن 09/02
            // toInputRef.current.value = '';  // باید خالی بشه بعد از ورود و اینتر زدن 09/21

        } else {
            if (fromValue === '') {
                setFromError(true);
            } else if (fromError) {
                setFromError(false);
            }
            if (toValue === '') {
                setToError(true);
            } else if (toError) {
                setToError(false);
            }
        }
    }

    const handleEnterSubmit = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
            fromInputRef.current.value = '';  //  باید خالی بشه بعد از ورود و اینتر زدن 09/02
            // toInputRef.current.value = '';  //  باید خالی بشه بعد از ورود و اینتر زدن 09/21
            // fromInputRef.current?.focus(); //09/21
            e.preventDefault();
        }
    }

    // if (checkedId !== null) {
    //     checkFromTo = true;
    //     selectedItem?.checkFromTo = checkFromTo;
    // }
    return (
        <form className='serialsFromToContainer' noValidate autoComplete='off' onSubmit={handleSubmit}>
            <label htmlFor="userName">
                {/* {count > 1 ? 'دریافت شماره سریال :' : 'دریافت کد کالا :'} */}
                {'دریافت شماره سریال :'}
                {' (' + selectedItem?.Code + ")-" + selectedItem?.Name}
            </label><br />

            <input
                ref={fromInputRef}
                className={'fromToInput'}
                onKeyDown={handleEnterSubmit}
                onChange={onChangeFromValue}
                style={{ marginLeft: checkedId === selectedItem.Id ? 10 : 0 }}
                // value={typeValue}
                type="text"
                id="typeValue"
                name="typeValue"
                placeholder={'از'}
            />

            {checkedId === selectedItem.Id && <input
                // ref={toInputRef}
                className={'fromToInput'}
                onKeyDown={handleEnterSubmit}
                onChange={onChangeToValue}
                // value={typeValue}
                type="text"
                id="typeValue"
                name="typeValue"
                placeholder={'تا'}
            />}
            {loadingImport ? <div className='loader' /> : <div className={'serialsFromToContainer'} />}

        </form>
    )
}

export default SerialsFromToForm;
