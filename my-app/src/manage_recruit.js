import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useApplicants from "./hooks/useRecruitments";
import axios from "axios";
import "./manage_recruit.css";
import Manage_applicantTable from "./manage_applicantTable";
import Manage_pagenation from "./manage_pagenation";

function ManageRecruit(token) {
  const { data, status, error, loading } = useApplicants();
  const allStatus = {
    total: status?.length,
    pending: status?.filter((item) => item.status === "pending"),
    approved: status?.filter((item) => item.status === "approved"),
     rejected: status?.filter((item) => item.status === "rejected")

  };
  // 페이지 위치 관리
  const [currentPage, setCurrentPage] = useState(1);
  // 쿠키인증시간 끝나면??
  return (
    <div className={"recruitContainer"}>
      {/*상태확인*/}
      <div className={"summarySection"}>
        <ul className={"summaryStats"}>
          <li className={"totalCount"}>전체: {allStatus.total || "null"}</li>
          <li className={"waitingCount"}>
            대기중: {allStatus.pending?.length || "null"}
          </li>
          <li className={"approvedCount"}>
            승인됨: {allStatus.approved?.length || "null"}
          </li>
          <li className={"rejectedCount"}>
            거절됨: {allStatus.rejected?.length || "null"}
          </li>
        </ul>
      </div>
      {/* todo 검색창 구현하기, css랑 className차이 있음 */}
      <div className={"managementHeader"}>
        <span className={"searchSection"}>
            <input type={'search'}/>
        </span>
      </div>

      <div className={"applicantTable"}>
        {/*코드가 너무 길어져서 따로 뺐어요*/}
        <Manage_applicantTable currentPage={currentPage} items={status} />
      </div>

      {/*페이지 번호 확인 */}
      <div className={"pagination"}>
        <span className={"pageNumber"}>
          <Manage_pagenation
            totalPage={data?.totalPages || 7}
            onPageChange={setCurrentPage}
          />
        </span>
      </div>    </div>
  );
}

export default ManageRecruit;
