import "./Sub_main.css";
import bulb from './img/bulb.svg'
import bulb2 from './img/bulb2.svg'
// todo key 사용하는건가요?
import key from './img/keycap.svg'
import key1 from './img/keycap1.svg'
import key2 from './img/keycap2.svg'
import key3 from './img/keycap3.svg'
import mainkey from './img/mainkey.svg'
import headset from './img/headset.svg'
import chess from './img/Chess.svg'


export default function Sub_main() {
  return (
    <div className="submain">
      {/* CODA 섹션 */}
      <section className="codaSection">
        {/* 중앙 CODA 문구 */}
        <div className="codaStack">
          <div className="codaRow">
            <span className="init initC">C</span>REATE
          </div>
          <div className="codaRow">
            <span className="init initO">O</span>BSERVE
          </div>
          <div className="codaRow">
            <span className="init initD">D</span>EVELOP
          </div>
          <div className="codaRow">
            <span className="init initA">A</span>CHIEVE
          </div>
        </div>

        {/* 떠다니는 이미지들 */}
        <img className="floatImg bulb" src={bulb} alt="Bulb" />
        <img className="floatImg bulb2" src={bulb2} alt="Bulb 2" />
        <img
          className="floatImg Key1"
          src={key1}
          alt="Keycap 1"
        />
        <img
          className="floatImg Key2"
          src={key2}
          alt="Keycap 2"
        />
        <img
          className="floatImg Key3"
          src={key3}
          alt="Keycap 3"
        />
        <img
          className="floatImg Mainkey"
          src={mainkey}
          alt="Main Keycap"
        />
        <img
          className="floatImg Headset"
          src={headset}
          alt="Headset"
        />
        <img className="floatImg Chess" src={chess} alt="Chess" />
      </section>
    </div>
  );
}
