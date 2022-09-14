import React from 'react';

const AboutModal = ({ setIsVisibleAboutModal }) => {
    return (
        <>
            <div className='serialItemModalContainer' onClick={() => setIsVisibleAboutModal(false)} />
            <div className='serialItemModalCentered'>
                <div className='serialItemModal' style={{ height: 350, width: 400 }} >
                    <p className='serialItemModalTitle'>{'درباره ما'}</p>
                    <hr />
                    <button className='serialItemModalClose' onClick={() => setIsVisibleAboutModal(false)}>
                        بستن
                    </button>
                    {/* <div className="form-group text-center"> */}
                    <div style={{ textAlign: "center" }}>

                        <div>
                            گروه مشاوره و توسعه نرم افزار راینیک
                            <br />
                            <a href="http://www.raynik.ir" target="_blank" rel="noreferrer">http://www.raynik.ir</a>
                            <br />
                            09127280116
                            <br />
                            سال ساخت: 1398
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </>
    )
}

export default AboutModal;
