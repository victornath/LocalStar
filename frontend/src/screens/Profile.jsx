import React, { useEffect } from 'react'
import Header from "../components/Header";
import ProfileTabs from "../components/ProfileTabs";
import { getUserDetails } from "../redux/actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const Profile = () => {
    window.scrollTo(0, 0);
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch(getUserDetails("profile"));
    }, [dispatch]);
    return (
        <>
            <Header />
            <div className="container mt-lg-5 mt-3">
                <div className="row align-items-start">
                    <div className="col-lg-4 p-0 shadow ">
                        <div className="author-card pb-0 pb-md-3">
                            <div className="author-card-cover"></div>
                            <div className="author-card-profile row">
                                <div className="author-card-details col-md-7">
                                    <h5 className="author-card-name mb-2">
                                        <strong>{userInfo.name}</strong>
                                    </h5>
                                    <br></br>
                                    <br></br>
                                    <h5>
                                        <>Joined {moment(userInfo.createdAt).format("LL")}</>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="wizard pt-3 ">
                            <div class="d-flex align-items-start">
                            </div>
                        </div>
                    </div>

                    <div
                        class="tab-content col-lg-8 pb-5 pt-lg-0 pt-3"
                        id="v-pills-tabContent"
                    >
                        <div
                            class="tab-pane fade show active"
                            id="v-pills-home"
                            role="tabpanel"
                            aria-labelledby="v-pills-home-tab"
                        >
                            <ProfileTabs />
                        </div>
                        <div
                            class="tab-pane fade"
                            id="v-pills-profile"
                            role="tabpanel"
                            aria-labelledby="v-pills-profile-tab"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile