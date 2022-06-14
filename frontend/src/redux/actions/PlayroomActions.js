import { GET_PLAYROOM_DATA_FAILED, GET_PLAYROOM_DATA_SUCCESS } from "../constants/PlayroomConstants.js";
import Axios from "axios";

export const lobby = () => (dispatch) => {

    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await Axios.get(`/api/playrooms/lobby`, {}, config);


        dispatch({
            type: GET_PLAYROOM_DATA_SUCCESS,
            payload: data,
        });

        localStorage.setItem("playroomInfo", JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: GET_PLAYROOM_DATA_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    };
}