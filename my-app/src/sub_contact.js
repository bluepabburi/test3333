import React from "react";
import {useState, } from "react";
import contatcdot from './img/contact-dot.svg'
import axios from "axios";
//import { GoogleGenAI } from "@google/genai";
import './sub_contact.css'

export default function SubContact() {
    const [text, setText] = useState('')
    const [inquiry, setInquiry] = useState('')
    const [email, setEmail] = useState('')
    const baseURL = process.env.REACT_APP_API_URL;
    const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
    // const ai = new GoogleGenAI({apiKey: geminiKey});


    function changeMessage(e){
        setText(e.target.value)
        console.log(text)
    }
    function changeEmail(e){
        setEmail(e.target.value)
        console.log(email+'<<변경됨')
    }


    async function sendText (e) {
        e.preventDefault();
        //todo gemini api문제 해결이 필요하다..

        // const getGeminiSubject = await getSubject(text)

        // todo email 수정필요
        const data = {
            email: 'n346776625@gmail.com',
            tag: inquiry,
            subject: '123응답입니다.',
            message: text
        }
        if (data.email === '' || data.tag === '' || data.subject === '' || data.message === '') return alert('잘못된 입력입니다.')
        else {
        axios.post(baseURL+'/inquiries', data)
        .then(response => {

            console.log(response.data, data)
        })
        .catch(error => {
            console.log(error)
        })
        }
    }

    // todo gemini api연결하기
    // const getSubject = async (t) => {
    //     const geminiText = t;
    //     try {
    //         const response = async () => {
    //                 const model = await ai.models.generateContent(
    //                     {model:"gemini-2.5-flash",
    //                         contents: geminiText,
    //                         config:{ systemInstruction:'글을 읽고 적절한 제목을 10자 이내로 제목만 출력해주세요'}
    //                     });

    //         }
    //         console.log(response.text)
    //         return response.text;
    //     }
    //     catch (error) {
    //         console.log(error)

    //     }
    // }
  return (
    <div className="subContactContainer">
        {/* DIV1 - 문의 섹션 */}
        <div className="inquirySection">
            {/* 문의 타이틀 - 이미지도 같이 포함 */}


            {/* 문의 폼 - 흰색 박스 */}
            <div className="inquiryForm">
                <div className="inquiryTitle">
                    <img src={contatcdot} alt="contatcdot"/><br/>
                    <h1 className="inconsolata-title">CONTACT US</h1>
                </div>
                {/* 문의 타입 */}
                <div className="inquiryType">
                    <button className="noto-sans-button" onClick={() => setInquiry('일반 문의')} autoFocus>일반 문의</button>
                    <button className="noto-sans-button" onClick={() => setInquiry('시스템 문의')}>시스템 문의</button>
                    <button className="noto-sans-button" onClick={() => setInquiry('지원 문의')}>지원 문의</button>
                    <button className="noto-sans-button" onClick={() => setInquiry('기타 문의')}>기타 문의</button>
                </div>

                {/* 문의 텍스트 창 */}
                <div className="inquiryText">
                    {/*todo 문의 내용을 gemini에게 보내고 따로 작성해서 보내기 (axios)*/}
                    <input type={"email"} className="inquiryEmail" onChange={changeEmail} placeholder={'email을 작성해주세요'}
                           autoFocus/><br/>

                    <textarea onChange={changeMessage} placeholder={'문의에 궁금한점을 입력해주세요'}>

              </textarea>
                </div>

                {/* 문의 버튼 */}
                <div className="inquiryButton">
                    <button className="noto-sans-button" onClick={sendText}>제출</button>
                </div>
            </div>
        </div>

        {/* DIV2 - 연락처 정보 섹션 */}
        <div className="contactInfoSection">
            {/* 이메일, 인스타그램 따로 */}
            <div className="contactItem email">

                <h1>Email</h1>
                <h3>123qwe@gmail.com</h3>
            </div>
            <div className="contactItem instagram">
                <h1>Instagram</h1>
                <h3>@coda_123</h3>
            </div>
        </div>
    </div>

)
    ;
}


// DIV1
// 문의 타이틀 - 이미지도 같이 포함
// 문의 타입
// 문의 텍스트 창
// 문의 버튼

// DIV2
// 이메일, 인스타그램 따로