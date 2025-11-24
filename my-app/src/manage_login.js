import axios from "axios";
import { useState, } from "react";
import './manage_login.css'
import {Link, useNavigate } from "react-router-dom";
import ManageRecruit from "./manage_recruit";

// TODO withRouter사용법?     this.props.history.push("/user");사용법?

export default function Login() {
    // id, pw상태를 관리함
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    // 테스트용 id, pw출력
    console.log(id, pw)

    const baseURL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();


    // 로그인 요청 보내기, axios사용
    const handleSubmit = async (e) => {
        // 폼 제출시 페이지가 새로고침되는 동작을 막음
        e.preventDefault();
        // 서버 주소교체 필요
        axios.post(
            `${baseURL}/admin/login`,
            { email: id, password: pw },
            {withCredentials: true}
        ).then(response => {
            // 성공응답 (2xx) 처리
            // 서버 응답을 response로 반환
            console.log('로그인 성공', response.data)
            // manage_recruit으로 이동함

            // TODO 다른 컴포넌트에 데이터 넘겨주기
            const authToken = response.data.token;
            localStorage.setItem('authToken', authToken);

            navigate('/admin/recruit');

        })
            .catch(error => {
                // 에러응답 (4xx) 처리
                if (error.response?.status === 401) {
                    console.log("AUTH_INVALID_CREDENTIALS")
                    alert("이메일 또는 비밀번호가 올바르지 않습니다.")
                }
                else if (error.response?.status === 404) {
                    console.log("404 error, 주소를 찾을 수 없습니다.")
                }
                else if (error.response?.status === 429) {
                    console.log("레이트 리밋 초과")
                }

                else {
                    console.log("UNKNOWN_ERROR")

                }
            })}
    // 입력창 값이 변경될 때 id, pw갱신
    const handleUserId = (e) => {
        setId(e.target.value)
    }
    const handleUserPw = (e) => {
        setPw(e.target.value)
    }


    return (
        <div className={'loginContainer'}>
            <form className={'loginForm'} onSubmit={handleSubmit}>
                <input type="text" className={'userId'} id={'userId'} placeholder={'아이디'} onChange={handleUserId} autoFocus/><br/>
                <input type="password" className={'userPw'} id={'userPw'} placeholder={'비밀번호'} onChange={handleUserPw} />
                <button type={'submit'} className={'loginBtn'}>Login</button>
            </form>
        </div>
    );
}
