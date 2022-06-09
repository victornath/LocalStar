import React from 'react'
import Header from '../components/Header'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const HomeScreen = () => {
    const userLogin = useSelector((state) => state.userLogin);

    const { userInfo } = userLogin;
    return (
        <div>
            <Header />

            <div className="banner">
                <div class="content">
                    <h1>LOCAL STAR</h1>
                    <h3>Web-Based Multiplayer Online Game That Features Indonesian Traditional Games</h3>

                    {
                        userInfo ? (
                            <div>
                                <Link to='/lobby'><button type="button"><span></span>GO TO LOBBY</button></Link>
                            </div>
                        )
                            :
                            (
                                <div>
                                    <Link to='/login'><button type="button"><span></span>PLAY NOW</button></Link>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeScreen