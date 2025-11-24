import React, { useState } from "react";
import "./clubrecru.css";
import axios from "axios";

function RecruitApplyPage({ question1, question2, positionId }) {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    major: "",
    age: "",
    school: "",
    answer1: "",
    answer2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!positionId) {
      alert("모집 공고 ID(positionId)가 없습니다.");
      console.log("❗ positionId 없음");
      return;
    }

    if (!form.name || !form.major || !form.studentId) {
      alert("이름 / 이메일 / 연락처는 필수입니다.");
      return;
    }

    const documents = `
[지원자 정보]
학교: ${form.school}
나이: ${form.age}

[연락처] ${form.studentId}
[이메일] ${form.major}

[Q1] ${question1}
${form.answer1}

[Q2] ${question2}
${form.answer2}
    `.trim();

    console.log("👉 제출 positionId:", positionId);

    try {
      const baseURL = process.env.REACT_APP_API_URL;
      const url = `${baseURL}/public/recruits`;

      const formData = new FormData();
      formData.append("positionId", positionId);
      formData.append("name", form.name);
      formData.append("email", form.major);
      formData.append("phone", form.studentId);
      formData.append("documents", documents);

      // 디버그용
      for (let [key, value] of formData.entries()) {
        console.log("formData:", key, "=>", value);
      }

      const res = await axios.post(url, formData);
      console.log("신청 응답:", res.data);
      alert("신청이 성공적으로 접수되었습니다!");

      // 폼 초기화
      setForm({
        name: "",
        studentId: "",
        major: "",
        age: "",
        school: "",
        answer1: "",
        answer2: "",
      });
    } catch (error) {
      console.error("신청 중 오류:", error);
      const msg =
        error.response?.data?.message ||
        "서버 오류로 인해 신청을 처리할 수 없습니다.";
      alert(msg);
    }
  };

  return (
    <div className="apply-wrapper">
      <div className="apply-container">
        <h1 className="apply-title">동아리 신청</h1>

        <form className="apply-form" onSubmit={handleSubmit}>
          {/* 이름 / 연락처 */}
          <div className="apply-row">
            <div className="apply-field">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="apply-field">
              <label htmlFor="studentId">연락처</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={form.studentId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 이메일 / 나이 */}
          <div className="apply-row">
            <div className="apply-field">
              <label htmlFor="major">Email</label>
              <input
                id="major"
                name="major"
                type="text"
                value={form.major}
                onChange={handleChange}
              />
            </div>

            <div className="apply-field">
              <label htmlFor="age">나이</label>
              <input
                id="age"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 학교명 */}
          <div className="apply-row single">
            <div className="apply-field">
              <label htmlFor="school">학교명</label>
              <select
                id="school"
                name="school"
                value={form.school}
                onChange={handleChange}
              >
                <option value="">학교를 선택하세요</option>
                <option value="국립한국교통대">국립한국교통대</option>
                <option value="건국대 글로벌 캠퍼스">
                  글로벌 캠퍼스 건국대학교
                </option>
              </select>
            </div>
          </div>

          {/* Q1 */}
          <div className="apply-question-block">
            <p className="question-label">Q. 1) {question1}</p>
            <textarea
              name="answer1"
              value={form.answer1}
              onChange={handleChange}
            />
          </div>

          {/* Q2 */}
          <div className="apply-question-block">
            <p className="question-label">Q. 2) {question2}</p>
            <textarea
              name="answer2"
              value={form.answer2}
              onChange={handleChange}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="apply-submit-wrapper">
            <button type="submit" className="apply-submit-btn">
              <span className="apply-submit-check">✔</span>
              <span>제출하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecruitApplyPage;
