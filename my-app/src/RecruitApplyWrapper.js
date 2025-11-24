// RecruitApplyWrapper.jsx
// todo
import React from "react";
import useApplicants from "./hooks/useRecruitments";
import RecruitApplyPage from "./clubrecru";

function RecruitApplyWrapper() {
  const { data, status, error, loading } = useApplicants();

  if (!status && !error) {
    return (
      <div style={{ color: "white" }}>
        모집 공고 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "white" }}>
        모집 공고 정보를 불러오지 못했습니다.
      </div>
    );
  }

  if (!status || status.length === 0) {
    return (
      <div style={{ color: "white" }}>현재 진행 중인 모집 공고가 없습니다.</div>
    );
  }

  const firstRecruit = status[0];

  // 🔥 여기 수정
  // firstRecruit.positionId 자체가 객체이므로, 그 안의 _id를 꺼내서 사용
  const positionId = firstRecruit.positionId?._id || firstRecruit._id; // 그래도 없으면 _id fallback

  const question1 =
    firstRecruit.question1 ||
    "CODA에 지원하게 된 동기와 관심 있는 분야를 작성해 주세요.";
  const question2 =
    firstRecruit.question2 ||
    "본인이 참여했던 프로젝트나 활동 중 인상 깊었던 경험을 작성해 주세요.";

  return (
    <RecruitApplyPage
      positionId={positionId}
      question1={question1}
      question2={question2}
    />
  );
}

export default RecruitApplyWrapper;
