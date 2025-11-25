import React from "react";
import useRecruitPositions from "./hooks/useRecruitPositions";
import RecruitApplyPage from "./clubrecru";

function RecruitApplyWrapper() {
  const { positions, firstPositionId, loading, error } = useRecruitPositions();

  if (loading) {
    return (
      <div style={{ color: "#fff", background: "#000", minHeight: "100vh" }}>
        모집 공고 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "#fff", background: "#000", minHeight: "100vh" }}>
        모집 공고 정보를 불러오지 못했습니다.
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div style={{ color: "#fff", background: "#000", minHeight: "100vh" }}>
        현재 진행 중인 모집 공고가 없습니다.
      </div>
    );
  }

  const first = positions[0];

  const positionId =
    (typeof first.positionId === "object" ? first.positionId?._id : first.positionId) ||
    first._id ||
    firstPositionId;

  const question1 =
    first.question1 ||
    "CODA에 지원하게 된 동기와 관심 있는 분야를 작성해 주세요.";
  const question2 =
    first.question2 ||
    "본인이 참여했던 프로젝트나 활동 중 인상 깊었던 경험을 작성해 주세요.";

  return (
    <RecruitApplyPage positionId={positionId} question1={question1} question2={question2} />
  );
}

export default RecruitApplyWrapper;