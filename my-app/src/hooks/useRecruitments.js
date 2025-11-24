import {useState, useEffect} from "react";
import axios from 'axios'

// TODO 신청자 정보 받아오기, return값은? id, name같은건 []배열 하나에 넣어놓고, error반환,


function useApplicants(type) {
    const baseURL = process.env.REACT_APP_API_URL;
    const savetoken = localStorage.getItem('authToken')
    const [data, setData] = useState();
    const [status, setStatus] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const endpoints = {
            getRecruits: '/admin/recruits'  // 쿼리: page, limit, status, sortBy, order
        }

        // todo 나중에 type입력받아서 url바꿔쓰게 변경
        // promise all로 모든 status받아오기?
        axios.get(`${baseURL}${endpoints.getRecruits}`,
            {
                headers: {
                    Authorization: `Bearer ${savetoken}`
                }
            }
            )
            .then(response => {
                setData(response.data)
                setStatus(response.data.docs)
                setLoading(true)


            })
            .catch(err =>{
                setError(err)
                setLoading(true)
            })



    }, []);

    return {
        data,
        status,
        error,
        loading
    }
}

export default useApplicants;
