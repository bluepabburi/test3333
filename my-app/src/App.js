import Sub_project from "./sub_project";
import Sub_createby from "./Sub_createby";
import Navbar from "./Navbar";
import Sub_main from "./Sub_main";
import Sub_recruitment from "./Sub_recruitment";
import Clubcoda from "./Clubcoda";
import Sub_contact from "./sub_contact";
import RecruitApplyWrapper from "./RecruitApplyWrapper";

// 관리자 페이지
import Recruit from "./manage_recruit";
import Login from "./manage_login";

// 테스트 페이지

import { Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ClubCoda from "./Clubcoda";

//TODO 특정 경로일때만 navbar보이게 설정
function App() {
  const developer = [
    { name: "유하선", part: "BACK-END" },
    { name: "유도현", part: "BACK-END" },
    { name: "권영은", part: "FRONT-END" },
    { name: "남태현", part: "FRONT-END" },
  ]; /*Create By 명단*/
  function Homepage() {
    return (
      <>
        <Clubcoda />
        <Sub_main />
        <Sub_project />
        <Sub_createby items={developer} specialName={"leader"} />
      </>
    );
  }
  // 사용자의 현재 주소를 파악하고 네비바를 상황에 맞게 출력합니다(사용자, 관리자)
  function NavbarGreeting(props) {
    const location = useLocation();
    const userLocation = location.pathname;
    const [isAdmin, setisAdmin] = useState(false);

    // 주소값 변경시 or isAdmin변경시 작동됨
    useEffect(() => {
      if (userLocation == "/admin*") {
        setisAdmin(true);
      } else {
        setisAdmin(false);
      }
    }, [userLocation]);

    if (userLocation.startsWith("/admin")) {
      // 네비바 출력 x
      return null;
    } else if (isAdmin === false) {
      return <Navbar />;
    } else {
      // 관리자 전용 네비바가 출력됩니다.
      // <NewNavber />
      return null;
    }
  }
  return (
    <div className="App">
      <NavbarGreeting />
      {/* route 경로설정 */}
      {/*새 컴포넌트 만들면 아래에 <route>를 추가해주세요*/}
      {/*  <Route path="{경로}" element={컴포넌트} /> */}

      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="about" element={<ClubCoda />} />
        <Route path="projects" element={<Sub_project />} />
        <Route path="recruitment" element={<Sub_recruitment />} />
        <Route path="contact" element={<Sub_contact/>} />
        <Route path="/clubrecru" element={<RecruitApplyWrapper />} />
        {/* <Route path="/recruit/apply" element={<RecruitApplyWrapper />} /> */}

        {/* 관리자 페이지 route */}
        <Route path="admin/recruit" element={<Recruit />} />
        <Route path="admin/login" element={<Login />} />

        {/* 테스트용 페이지 */}
      </Routes>
    </div>
  );
}

export default App;
