import { useEffect, useState } from "react";
import axios from "axios";

function useRecruitPositions() {
  const baseURL = process.env.REACT_APP_API_URL;

  const [positions, setPositions] = useState([]);
  const [firstPositionId, setFirstPositionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = "/public/recruitments";
    // ⚠️ 실제 백엔드에서 "모집 공고 리스트" 가져오는 엔드포인트로 바꿔야 함
    // 만약 admin용 /admin/recruits 에 positionId가 다 있다면 그걸 써도 됨.

    setLoading(true);
    axios
      .get(`${baseURL}${endpoint}`)
      .then((res) => {
        const list = res.data?.docs || res.data || [];
        setPositions(list);

        // 첫 번째 공고의 id/positionId 사용 (필드명은 백엔드에 맞게 수정)
        if (list.length > 0) {
          // 예: 서버가 { _id, title, ... } 형식이면
          const id = list[0].positionId || list[0]._id;
          setFirstPositionId(id || null);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [baseURL]);

  return {
    positions, // 전체 모집 공고 배열
    firstPositionId, // 기본으로 쓸 positionId
    loading,
    error,
  };
}

export default useRecruitPositions;
