import React from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import "./sub_project.css";
import gift from './img/gift.svg';
import cursor from './img/cursor.svg';
import crown from './img/crown.svg';
import gamepad from './img/gamepad.svg';

//TODO LINk로 이미지, 텍스트 감싸기, CSS작업+
// todo link에 텍스트 적용안됨, award제작

export default function SubProject() {
  return (
    <div className="quickmenu">
      {/* study 영역 */}
      <div className="qm-item qm-pos-study qm-glow-study">
          <Link to={'/study'} className={'qm-icon'}>
        <div className="qm-icon-wrap">

          <img src={gift} alt="Gift" className="qm-icon" />

          <img src={cursor} alt="Cursor" className="qm-cursor" />
        </div></Link>
        <span className="qm-label">Study</span>

      </div>

      {/* award 영역 (아이콘 오른쪽) */}
      <div className="qm-item qm-pos-award qm-glow-award qm-right">
        <div className="qm-icon-wrap">
          <img
            src={crown}
            alt="Crown"
            className="qm-icon qm-icon--award"
          />
          <img
            src={cursor}
            alt="Cursor"
            className="qm-cursor qm--award"
          />
        </div>
        <span className="qm-label">Award</span>
      </div>

      {/* activity 영역 */}
      <div className="qm-item qm-pos-activity qm-glow-activity">
        <div className="qm-icon-wrap">
          <img src={gamepad} alt="Gamepad" className="qm-icon" />
          <img src={cursor} alt="Cursor" className="qm-cursor" />
        </div>
        <span className="qm-label">Activity</span>
      </div>
    </div>
  );
}
