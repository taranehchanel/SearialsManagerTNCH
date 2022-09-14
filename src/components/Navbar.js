import React from "react";

const Navbar = ({ onAboutPress, title, onLogOut }) => {
    return (
        <div style={{ alignItems: "flex-start", backgroundColor: "white", paddingRight: "initial" }} >
            <ul className="nav" style={{ direction: "rtl", paddingTop: "30px", display: "inline-flex" }}>
                {/* <li className="nav-item" >
                    <button className="nav-link active serialButton" style={{ backgroundColor: "#2959d1", color: "white", cursor: "pointer" }} aria-current="page" onClick={() => onAboutPress()}>درباره ما</button>
                </li>&nbsp;&nbsp; */}
                <li className="nav-item">
                    <button className="nav-link serialButton" style={{ backgroundColor: "#ed2f57", color: "white", cursor: "pointer" }}
                        onClick={() => onLogOut()}
                    //  onclick={window.location.href='http://localhost:3000'}
                    //  onclick={window.location.href='http://10.10.85.21'}

                    >{title}</button>
                </li>
            </ul>
        </div>
    )
}
export default Navbar;
