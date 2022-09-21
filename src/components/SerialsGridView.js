import React, { useRef, createRef } from 'react';
import { girdDataTitles } from "../res/fakeData";
import list from "../assets/images/list.png";

const SerialsGridView = ({
    isCrm,
    data,
    onDetailPress,
    onSelectRow,
    selectedRowId,
    checkedId,
    onToggleCheck,
    checkFromTo,
}) => {

    const scrollRefs = useRef([]);
    if (scrollRefs.current.length === 0) {
        for (let i = 0; i < data.length; i++) {
            scrollRefs.current.push(createRef());
        }
    }

    const onRowSelect = (item, index) => {
        if (item.Id === selectedRowId) {
            onSelectRow(null)
        } else {
            onSelectRow(item)
            scrollRefs?.current[index]?.current?.scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'start',
                }
            );
        }
    }



    const getStateImg = (item) => {
        let img = null;

        if (item.Inventory <= 0 && item.cnt > item.Register) {
            img = require('../assets/images/NOA.png');
        }

        if (item.cnt <= item.Register) {
            img = require('../assets/images/ok.png');
        }

        if ((item.cnt > item.Register && item.Cost <= 0 && item.Inventory > 0 && isCrm) || (item.cnt > item.Register && !isCrm)) {
            img = require('../assets/images/nok.png');
        }

        if (item.cnt > item.Register && item.Cost > 0 && item.Inventory > 0) {
            img = require('../assets/images/NOI.png')
        }

        if (img) {
            return <img src={img} className={'serialGridImg'} alt={''} />
        }
    }

    return (
        <div className='serialsGridContainer'>
            <div className='serialsGrid'>
                {girdDataTitles.map((item, index) => {
                    return (
                        <div key={index} className="serialsGirdItem">{item}</div>
                    )
                })}
                {data.map((item) => {
                    const cName = (item.Id === selectedRowId) ?
                        "serialsGirdItem serialsGridItemSelected" :
                        "serialsGirdItem";

                    return (
                        <React.Fragment key={item.Id} >
                            {/* <div ref={scrollRefs.current[index]} className={cName}> */}
                            <div className={cName}>
                                {
                                    // (item.cnt > item.Register) &&
                                    // <div ref={scrollRefs.current[index]} className='serialButton'
                                    (item.cnt > item.Register) &&
                                    <div className='serialButton'
                                        onClick={() => onRowSelect(item)}>
                                        <img src={require("../assets/images/arrow.png")} className={'serialGridImg'}
                                            alt={''} />
                                    </div>
                                }
                            </div>
                            <div className={cName}>
                                {getStateImg(item)}
                            </div>
                            <div className={cName}>{item.Store}</div>
                            <div className={cName}>{item.Code}</div>
                            <div className={cName}>{item.Name}</div>
                            <div className={cName}>{item.cnt}</div>
                            <div className={cName}>{item.Register}</div>
                            <div className={cName}>
                                <div className='serialButton' onClick={() => onDetailPress(item)}>
                                    <img src={list} style={{ height: 40, width: 40 }} alt={''} />
                                </div>
                            </div>
                            <div key={checkedId} className={cName}>
                                {(item.cnt > 1 && item.Id === selectedRowId) && (
                                    <input
                                        className={'serialCheckBox'}
                                        type="checkbox"
                                        // defaultChecked={item.Id === checkedId}
                                        value={item.Id === checkedId}
                                        onChange={(e) => onToggleCheck(item.Id)}
                                    />)
                                }
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default SerialsGridView;
