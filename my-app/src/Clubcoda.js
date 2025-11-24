import React from "react";
import "./Clubcoda.css";
import logo from "./img/logo.svg"; // 파일 경로 주의! Clubcoda.jsx가 src/에 있다면 이렇게.

export default function Clubcoda() {
  return (
    <section className="ClubCoda">
      <div className="ClubCoda__left">
        <img className="ClubCoda__logo" src={logo} alt="CODA 로고" />
      </div>

      <div className="ClubCoda__right">
        <div className="ClubCoda__desc">
          <div className="ClubCodaDescEng">
            <strong>
              As a coding club, <br />
              the coda is a symbol <br />
              that represents the <br />
              ending of the score.
            </strong>
          </div>
          <br />
          <br />
          코다는 열정, 노력, 끈기를
          <br /> 가진 누구나 문은 열려있습니다. <br />
          처음 배우는 분 혹은 프로젝트 <br />
          경험이 필요하신 분까지 도전해
          <br />
          보세요.
        </div>
      </div>
    </section>
  );
}
