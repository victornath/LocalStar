import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/UserActions";

const Header = () => {
    const userLogin = useSelector((state) => state.userLogin);

    const dispatch = useDispatch();

    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
        <div>
            <div className="header">
                <div className="container">
                    <div className="pc-header">
                        <div className="row">
                            <div className="col-md-4 col-4 d-flex align-items-center">
                                <Link className="navbar-brand" to="/">
                                    <img alt="logo" src="/images/logo.png" />
                                </Link>
                            </div>
                            <ul class="list-inline col-md-4 col-8 d-flex align-items-center">
                                <li class="list-inline-item"><Link to="/gameplay">Gameplay</Link></li>
                                <li class="list-inline-item"><Link to="/news">News</Link></li>
                                <li class="list-inline-item"><Link to="/faq">FAQ</Link></li>
                            </ul>
                            <div className="col-md-4 d-flex align-items-center justify-content-end Login-Register">
                                <a href="https://www.youtube.com/">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="https://www.instagram.com/">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                {
                                    userInfo ? (
                                        <div className="btn-group">
                                            <button
                                                type="button"
                                                className="name-button dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Hi, {userInfo.name}
                                            </button>
                                            <div className="dropdown-menu">
                                                <Link className="dropdown-item" to="/profile">
                                                    Profile
                                                </Link>

                                                <Link className="dropdown-item" to="#" onClick={logoutHandler}>
                                                    Logout
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                        :
                                        (
                                            <>
                                                <Link to="/login">Login</Link>
                                                <Link to="/register">Register</Link>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
