import  keycap from './img/keycap.svg'
import './Sub_createby.css'
import yellowkeycap from './img/normal_coda_keycap.svg'
import cubeImg from './img/Cube_Dinamic.svg'
import swordImg from './img/Sword_Dinamic.svg'
import switchImg from './img/Switch_Dinamic.svg'


function CreateBy({items, specialName}) {
    return (
        <div className={'createbyContainer'}>
            <p className={'createbyTitle'}>CREATE BY</p>
            <div className={'imgRapper'}>
                <img src={swordImg} alt={'sword'} className={'sword'}/>
                {/*키캡을 관리하는 컨테이너*/}
                <div className={'gridContainer'}>
                <Keycap name={items[0].name} part={items[0].part} />
                <Keycap name={items[1].name} part={items[1].part} />
                <Keycap name={items[2].name} part={items[2].part} specialName={specialName}/> {/* 예외케이스를 위해 specialname을 사용 */}
                <Keycap name={items[3].name} part={items[3].part} />
            </div>

                <div className={'gameContainer'}>
                    <img src={cubeImg} alt={'cube'} className={'cube'}/>
                    <img src={switchImg} alt={'switch'} className={'switch'}/>
                </div>
                <img src={yellowkeycap} alt={'yellowkeycap'} className={'yellowkeycap'}/>
            </div>
        </div>
    );
}

// todo 팀원 깃허브? 링크추가(선택사항)
function Keycap({name, part}) {
    // part값에 따라 css name생성  FRONT-END -> frontend
    const partClassName = part.toLowerCase().replace('-', '');


    return (
        <div className={'keycap'}>
            {/* 이미지를 배경 스타일을 위한 div로 변경 */}
            <img src={keycap} alt={'keycap'} className={'keycapImg'}/>
            {/**/}
            <div className={'keycapText'}>
                {/*.part , .part.?part로 나누어놓음 ex).part.frontend*/}
                <p className={`part ${partClassName}`}>{part}</p>
                <p className={'name'}>{name}</p>
            </div>
        </div>
    );
}

export default CreateBy;
