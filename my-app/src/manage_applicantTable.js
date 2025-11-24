import { useEffect, useState, useRef} from "react";
import {Link, useLocation} from "react-router-dom";


// CSS 구조:
// .Manage_applicantTable (table)
//   ├─ thead
//   │   └─ tr
//   │       ├─ th (체크박스)
//   │       ├─ th (번호)
//   │       ├─ th (이름)
//   │       ├─ th (연락처)
//   │       ├─ th (신청일시)
//   │       └─ th (상태)
//   │
//   └─ tbody
//       └─ tr
//           ├─ td.checkbox (input[type="checkbox"])
//           ├─ td.id
//           ├─ td.name
//           ├─ td.contact
//           ├─ td.date
//           └─ td.status

// className은 아직 작성 안해놨어요
function Manage_applicantTable({currentPage, items = []}) {

    // 로컬 테스트용 데이터 (items가 비어있을 때 사용)

    // 선택된 항목들의 ID를 관리하는 상태
    const [selectedItems, setSelectedItems] = useState(new Set());

    // 전체 선택/해제 핸들러
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // 모든 항목 선택
            setSelectedItems(new Set(items.map(item => item._id)));
        } else {
            // 모든 항목 선택 해제
            setSelectedItems(new Set());
        }
    };

    // 개별 항목 선택/해제 핸들러
    const handleSelectItem = (itemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    // 날짜를 년-월-일 형식으로 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getCellContent = (header, item) => {
        if (header.type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    onChange={() => handleSelectItem(item._id)}
                    checked={selectedItems.has(item._id)}
                />
            );

        }
        if (header.key === 'phone') {
            return item[header.key].replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

        }

        if (header.key === 'createdAt') {
            return formatDate(item[header.key]);
        }
        //
        // if (header.key === 'status') return (
        //
        // )

        return item[header.key];
    };

    const tableHeaders = [
        { key: 'checkbox', data: '', type:'checkbox'},
        { key: '_id', data: '번호' },
        { key: 'name', data: '이름' },
        { key: 'phone', data: '연락처' },
        { key: 'createdAt', data: '신청일시' },
        { key: 'status', data: '상태' }
    ]


    return(
        <table>
            {/*테이블 머리*/}
            <thead>
            <tr>
                {/*전체 선택용 체크박스*/}
                <th>
                    <input
                        type={'checkbox'}
                        onChange={handleSelectAll}
                        checked={items.length > 0 && selectedItems.size === items.length}
                    />
                </th>
                <th>번호</th>
                <th>이름</th>
                <th>연락처</th>
                <th>신청일시</th>
                <th>상태</th>
            </tr>
            </thead>

            <tbody>
            {
                items.map((item, id) => (
                    <tr key={id}>
                        {
                            tableHeaders.map((header) => (
                                <td key={header.key + id}>
                                    {getCellContent(header, item)}
                                </td>
                            ))
                        }
                    </tr>

                ))
            }
            </tbody>
        </table>
    )
}

export function getPage(){
    alert('ggg')
}


export default Manage_applicantTable