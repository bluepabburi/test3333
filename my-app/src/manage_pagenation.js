import { useEffect, useState, useRef} from "react";


function Manage_pagenation({totalPage, onPageChange}) {
    const limit = 6
    const [page, setPage] = useState([])

   useEffect(()=>{
       // setpage에서 배열로 저장하게 변경하기
       const pages = [];
       let cnt = 1
       for (let i = 0; i < Math.ceil(totalPage.length / limit); i++){
           pages.push(cnt);
           cnt +=1
       }
       setPage(pages);
   }, [])

    return (
        <nav>
            {
                page.map((i) =>(
                    <button onClick={() => onPageChange(i)} >{i}</button>
                ))
            }
        </nav>


    )
}
export default Manage_pagenation