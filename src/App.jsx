import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Binary,
  BookOpen,
  CircuitBoard,
  Clock3,
  Cpu,
  Gauge,
  Play,
  RotateCcw,
  Waves,
  Zap
} from "lucide-react";
import { chapters, quizItems } from "./data/course";
import "./styles/main.css";

const gateFns = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XOR: (a, b) => a !== b
};

function bit(value) {
  return value ? 1 : 0;
}

function Hero() {
  return (
    <section className="hero">
      <div className="scope">
        <div className="hero-copy">
          <p className="eyebrow">Digital Logic Lab</p>
          <h1>数字逻辑互动实验室</h1>
          <p>
            把九章 PPT 改造成可点击、可观察、可验证的课堂实验台。学生拨开关、看波形、拖参数，
            再回到真值表和公式，抽象概念会更容易落地。
          </p>
          <div className="hero-actions">
            <a href="#chapters" className="primary-action">
              <Play size={18} /> 进入章节
            </a>
            <a href="#chapters" className="ghost-action">
              <BookOpen size={18} /> 查看课程目录
            </a>
          </div>
        </div>
        <div className="chip-stage" aria-label="animated digital circuit">
          <div className="chip">
            <span>74LS</span>
            {Array.from({ length: 18 }).map((_, index) => (
              <i key={index} style={{ "--pin": index }} />
            ))}
          </div>
          <div className="trace trace-a" />
          <div className="trace trace-b" />
          <div className="trace trace-c" />
          <div className="pulse-dot dot-a" />
          <div className="pulse-dot dot-b" />
          <div className="logic-readout">1011 → 11</div>
        </div>
      </div>
    </section>
  );
}

function ChapterMap({ selectedId, onSelect }) {
  return (
    <section className="section" id="chapters">
      <div className="section-head">
        <p className="eyebrow">Course Chapters</p>
        <h2>选择章节进入仿真工作台</h2>
      </div>
      <div className="chapter-grid">
        {chapters.map((chapter) => (
          <button
            className={`chapter-card ${selectedId === chapter.id ? "selected" : ""}`}
            key={chapter.id}
            style={{ "--accent": chapter.color }}
            onClick={() => onSelect(chapter.id)}
          >
            <div className="chapter-no">{chapter.no}</div>
            <h3>{chapter.title}</h3>
            <p>{chapter.subtitle}</p>
            <div className="chapter-meta">
              <span>互动仿真</span>
              <span>课堂演示</span>
              <span>PPT 画面重做</span>
            </div>
            <div className="lab-pill">{chapter.lab}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChapterDetail({ chapter }) {
  return (
    <section className="chapter-detail" style={{ "--accent": chapter.color }}>
      <div className="detail-hero">
        <div>
          <p className="eyebrow">Chapter {chapter.no}</p>
          <h2>{chapter.title}</h2>
          <p>按本章 PPT 的关键画面制作可交互仿真，课堂上直接演示，学生课后也可以自己调参数复现。</p>
        </div>
        <div className="detail-badge">互动仿真</div>
      </div>
      <div className="chapter-lab-slot">
        {chapter.id === "basis" && <ChapterOneContent />}
        {chapter.id === "gates" && <GateLab />}
        {chapter.id === "combinational" && <CoincidenceLab />}
        {chapter.id === "counters" && <CounterLab />}
        {chapter.id === "pulse" && <PulseAndConversionLab />}
        {chapter.id === "conversion" && <PulseAndConversionLab />}
        {!["basis", "gates", "combinational", "counters", "pulse", "conversion"].includes(chapter.id) && (
          <div className="lab-panel">
            <div className="panel-title">
              <CircuitBoard size={20} />
              <div>
                <h3>{chapter.lab}</h3>
                <p>这一章的互动仿真入口已预留，下一步会把 PPT 里的例题逐个转成可操作实验。</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ChapterOneContent() {
  return (
    <div className="chapter-one">
      <SimulationIndex
        items={[
          "模拟量数字化",
          "三位计时器",
          "数制转换",
          "编码拨码器",
          "原反补码",
          "基本逻辑门",
          "逻辑定律验证",
          "卡诺图化简"
        ]}
      />
      <SignalSamplingLab />
      <DigitalTimerLab />
      <NumberSystemLab />
      <EncodingLab />
      <SignedNumberLab />
      <BasicLogicOperationLab />
      <LogicLawLab />
      <KmapLab />
    </div>
  );
}

function SimulationIndex({ items }) {
  return (
    <article className="simulation-index">
      <div>
        <p className="eyebrow">Chapter 01 Simulations</p>
        <h3>第一章仿真工作台</h3>
      </div>
      <div className="index-pills">
        {items.map((item, index) => (
          <span key={item}>{String(index + 1).padStart(2, "0")} {item}</span>
        ))}
      </div>
    </article>
  );
}

function SignalSamplingLab() {
  const [samples, setSamples] = useState(24);
  const [levels, setLevels] = useState(16);
  const wave = Array.from({ length: 100 }, (_, i) => 27 + 6 * Math.sin((i / 99) * Math.PI * 2 - 0.8) + 2 * Math.sin((i / 99) * Math.PI * 4));
  const picked = Array.from({ length: samples }, (_, i) => {
    const index = Math.round(i * 99 / Math.max(1, samples - 1));
    return wave[index];
  });
  const min = 18;
  const max = 36;
  const quantize = (v) => Math.round(((v - min) / (max - min)) * (levels - 1));

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Waves size={20} />
        <div>
          <h3>模拟量 → 抽样 → 量化 → 编码</h3>
          <p>把 PPT 中温度曲线的三张静态图合成一个可调演示。拖动抽样点和量化等级，观察数字化过程。</p>
        </div>
      </div>
      <div className="sim-controls">
        <Slider label="抽样点数" unit="点" value={samples} min={4} max={100} setValue={setSamples} />
        <Slider label="量化等级" unit="级" value={levels} min={4} max={100} setValue={setLevels} />
      </div>
      <div className="signal-stage">
        <svg viewBox="0 0 720 260" role="img" aria-label="sampling and quantization graph">
          {Array.from({ length: levels }).map((_, i) => {
            const y = 230 - (i / (levels - 1)) * 190;
            return <line className="grid-line" key={i} x1="40" x2="690" y1={y} y2={y} />;
          })}
          <polyline
            className="analog-wave"
            points={wave.map((v, i) => `${40 + i * (650 / 99)},${230 - ((v - min) / (max - min)) * 190}`).join(" ")}
          />
          {picked.map((v, i) => {
            const x = 40 + i * (650 / Math.max(1, picked.length - 1));
            const q = quantize(v);
            const y = 230 - (q / (levels - 1)) * 190;
            return (
              <g key={i}>
                <line className="sample-line" x1={x} x2={x} y1="230" y2={y} />
                <circle className="sample-dot" cx={x} cy={y} r="6" />
              </g>
            );
          })}
        </svg>
        <div className="code-strip">
          {picked.slice(0, 18).map((v, i) => {
            const q = quantize(v);
            return <span key={i}>{q.toString(2).padStart(Math.ceil(Math.log2(levels)), "0")}</span>;
          })}
          {picked.length > 18 && <span>...</span>}
        </div>
      </div>
    </div>
  );
}

function DigitalTimerLab() {
  const [seconds, setSeconds] = useState(0);
  const [probe, setProbe] = useState("clk");
  const minuteOnes = Math.floor(seconds / 60) % 10;
  const secondTens = Math.floor((seconds % 60) / 10);
  const secondOnes = seconds % 10;
  const digits = [minuteOnes, secondTens, secondOnes];
  const probeLabels = { clk: "1s 秒脉冲", counter: "BCD 计数输出", decoder: "译码段信号", display: "数码管亮灭" };
  const probeBits = probe === "clk"
    ? [seconds % 2]
    : probe === "counter"
      ? secondOnes.toString(2).padStart(4, "0").split("").map(Number)
      : probe === "decoder"
        ? sevenSegmentBits(secondOnes)
        : sevenSegmentBits(secondOnes);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Clock3 size={20} />
        <div>
          <h3>三位计时器信号链</h3>
          <p>PPT 中“秒脉冲 → 二进制计数 → 译码显示”的框图变成可推进的数字系统。</p>
        </div>
      </div>
      <div className="timer-controls">
        <button className="primary-action small" onClick={() => setSeconds((seconds + 1) % 600)}>1s 脉冲</button>
        <button className="ghost-action small" onClick={() => setSeconds(0)}>复位</button>
        <strong>{String(minuteOnes)}:{String(secondTens)}{String(secondOnes)}</strong>
      </div>
      <div className="timer-schematic">
        <button className={`timer-source ${probe === "clk" ? "active" : ""}`} onClick={() => setProbe("clk")}>
          <span>定时激励信号产生电路</span>
          <b>秒脉冲 1s</b>
          <MiniPulse />
        </button>
        <i className="schematic-arrow" />
        <button className={`timer-counter ${probe === "counter" ? "active" : ""}`} onClick={() => setProbe("counter")}>
          <span>脉冲个数记录电路</span>
          <b>{seconds.toString(2).padStart(10, "0")}</b>
        </button>
        <div className="bcd-stack">
          {[
            ["分个位二进制码", minuteOnes],
            ["秒十位二进制码", secondTens],
            ["秒个位二进制码", secondOnes]
          ].map(([label, value]) => (
            <button className={probe === "counter" ? "active" : ""} key={label} onClick={() => setProbe("counter")}>
              <span>{label}</span>
              <b>{value.toString(2).padStart(4, "0")}</b>
            </button>
          ))}
        </div>
        <i className="schematic-arrow" />
        <button className={`decoder-block ${probe === "decoder" ? "active" : ""}`} onClick={() => setProbe("decoder")}>
          <span>码转换电路</span>
          <b>译码器</b>
        </button>
        <div className="display-stack">
          {[
            ["分个位显示码", minuteOnes],
            ["秒十位显示码", secondTens],
            ["秒个位显示码", secondOnes]
          ].map(([label, value]) => (
            <button className={probe === "display" ? "active" : ""} key={label} onClick={() => setProbe("display")}>
              <span>{label}</span>
              <b>{sevenSegmentBits(value).join("")}</b>
            </button>
          ))}
        </div>
        <div className="timer-displays" onClick={() => setProbe("display")}>
          {digits.map((digit, index) => <SevenSegment key={index} digit={digit} />)}
        </div>
      </div>
      <Oscilloscope title={probeLabels[probe]} bits={probeBits} tick={seconds} />
      <DacExample />
    </div>
  );
}

function MiniPulse() {
  return <div className="mini-pulse"><i /><i /><i /><i /></div>;
}

function SevenSegment({ digit }) {
  const map = segmentMap();
  const active = new Set((map[digit] || "").split(""));
  return (
    <div className="seven-seg">
      {["a", "b", "c", "d", "e", "f", "g"].map((seg) => <i key={seg} className={`${seg} ${active.has(seg) ? "on" : ""}`} />)}
    </div>
  );
}

function segmentMap() {
  return {
    0: "abcdef",
    1: "bc",
    2: "abged",
    3: "abgcd",
    4: "fgbc",
    5: "afgcd",
    6: "afgecd",
    7: "abc",
    8: "abcdefg",
    9: "abfgcd"
  };
}

function sevenSegmentBits(digit) {
  const active = new Set((segmentMap()[digit] || "").split(""));
  return ["a", "b", "c", "d", "e", "f", "g"].map((seg) => active.has(seg) ? 1 : 0);
}

function Oscilloscope({ title, bits, tick }) {
  const history = Array.from({ length: 20 }, (_, i) => tick - 19 + i);
  return (
    <div className="oscilloscope">
      <div>
        <span>示波器探头</span>
        <strong>{title}</strong>
      </div>
      <div className="scope-grid">
        {bits.map((_, row) => (
          <div className="scope-row" key={row}>
            <b>CH{row + 1}</b>
            {history.map((t, i) => {
              const value = row === 0 && bits.length === 1 ? Math.abs(t) % 2 : bits[row];
              return <i className={value ? "high" : ""} key={i} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DacExample() {
  const [code, setCode] = useState(9);
  const [probe, setProbe] = useState("digital");
  const voltage = ((code / 15) * 5).toFixed(2);
  const bits = code.toString(2).padStart(4, "0").split("").map(Number);
  return (
    <div className="dac-example">
      <div>
        <h4>数模例子：4 位控制码驱动显示亮度</h4>
        <p>改变控制码，观察 D/A 阶梯电压和“模拟亮度”的中间变化。</p>
      </div>
      <Slider label="数字控制码" unit="" value={code} min={0} max={15} setValue={setCode} />
      <div className="dac-schematic">
        <button className={probe === "digital" ? "active" : ""} onClick={() => setProbe("digital")}>
          <span>数字控制码</span>
          <b>{code.toString(2).padStart(4, "0")}</b>
        </button>
        <i />
        <button className={probe === "dac" ? "active" : ""} onClick={() => setProbe("dac")}>
          <span>D/A 转换器</span>
          <b>{voltage} V</b>
        </button>
        <i />
        <button className={probe === "analog" ? "active" : ""} onClick={() => setProbe("analog")}>
          <span>模拟输出</span>
          <b>{Math.round((code / 15) * 100)}%</b>
        </button>
        <div className="analog-lamp" style={{ "--light": code / 15 }}>
          <span>模拟亮度</span>
          <b>{Math.round((code / 15) * 100)}%</b>
        </div>
      </div>
      <Oscilloscope
        title={probe === "digital" ? "4 位数字码" : probe === "dac" ? "D/A 阶梯电压" : "负载亮度信号"}
        bits={probe === "digital" ? bits : [code > 0 ? 1 : 0]}
        tick={code}
      />
    </div>
  );
}

function NumberSystemLab() {
  const [number, setNumber] = useState("45.5");
  const [baseView, setBaseView] = useState(2);
  const [binaryInput, setBinaryInput] = useState("101101.1");
  const decimal = Number(number);
  const safe = Number.isFinite(decimal) ? decimal : 0;
  const intPart = Math.trunc(Math.abs(safe));
  const fracPart = Math.abs(safe) - intPart;
  const binary = `${safe < 0 ? "-" : ""}${intPart.toString(2)}${fracPart ? "." + fractionToBase(fracPart, 2, 8) : ""}`;
  const octal = `${safe < 0 ? "-" : ""}${intPart.toString(8)}${fracPart ? "." + fractionToBase(fracPart, 8, 6) : ""}`;
  const hex = `${safe < 0 ? "-" : ""}${intPart.toString(16).toUpperCase()}${fracPart ? "." + fractionToBase(fracPart, 16, 5).toUpperCase() : ""}`;
  const selectedValue = baseView === 2 ? binary : baseView === 8 ? octal : hex;
  const powers = buildExpansion(selectedValue.replace("-", ""), baseView);
  const parsedBinary = parseBaseNumber(binaryInput, 2);
  const grouped3 = groupBinary(binaryInput, 3);
  const grouped4 = groupBinary(binaryInput, 4);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Binary size={20} />
        <div>
          <h3>按权展开与分组转换</h3>
          <p>输入一个十进制数，下面同步展示二、八、十六进制，以及二进制按权展开过程。</p>
        </div>
      </div>
      <label className="number-input">
        <span>十进制输入</span>
        <input value={number} onChange={(event) => setNumber(event.target.value)} />
      </label>
      <div className="radix-grid">
        <RadixCard label="二进制" value={binary} active={baseView === 2} onClick={() => setBaseView(2)} />
        <RadixCard label="八进制" value={octal} active={baseView === 8} onClick={() => setBaseView(8)} />
        <RadixCard label="十六进制" value={hex} active={baseView === 16} onClick={() => setBaseView(16)} />
      </div>
      <div className="weight-board">
        {powers.map((item, index) => (
          <div className={item.digit !== "0" ? "active" : ""} key={`${item.power}-${index}`}>
            <strong>{item.digit}</strong>
            <span>{baseView}^{item.power}</span>
            <em>{item.value.toFixed(item.power < 0 ? 4 : 0)}</em>
          </div>
        ))}
      </div>
      <div className="conversion-process">
        <label className="number-input">
          <span>二进制数转换</span>
          <input value={binaryInput} onChange={(event) => setBinaryInput(event.target.value.replace(/[^01.]/g, ""))} />
        </label>
        <div className="process-grid">
          <RadixCard label="按权求十进制" value={Number.isFinite(parsedBinary) ? String(parsedBinary) : "输入有误"} />
          <RadixCard label="三位一组转八进制" value={grouped3} />
          <RadixCard label="四位一组转十六进制" value={grouped4} />
        </div>
        <p className="process-note">分组转换从小数点向两侧分组，不足位补 0；按权展开则把每一位乘以对应基数的幂后相加。</p>
      </div>
    </div>
  );
}

function buildExpansion(value, base) {
  const [intRaw = "0", fracRaw = ""] = value.split(".");
  const chars = "0123456789ABCDEF";
  const intItems = intRaw.split("").map((digit, index) => {
    const power = intRaw.length - index - 1;
    return { digit, power, value: chars.indexOf(digit.toUpperCase()) * base ** power };
  });
  const fracItems = fracRaw.split("").map((digit, index) => {
    const power = -(index + 1);
    return { digit, power, value: chars.indexOf(digit.toUpperCase()) * base ** power };
  });
  return [...intItems, ...fracItems].filter((item) => item.digit !== "");
}

function parseBaseNumber(value, base) {
  const [intRaw = "0", fracRaw = ""] = value.split(".");
  if (!/^[01]*$/.test(intRaw + fracRaw)) return NaN;
  const intValue = intRaw.split("").reverse().reduce((sum, digit, index) => sum + Number(digit) * base ** index, 0);
  const fracValue = fracRaw.split("").reduce((sum, digit, index) => sum + Number(digit) * base ** -(index + 1), 0);
  return Number((intValue + fracValue).toFixed(8));
}

function groupBinary(value, size) {
  const [intRaw = "0", fracRaw = ""] = value.split(".");
  const chars = "0123456789ABCDEF";
  const leftPad = (size - (intRaw.length % size)) % size;
  const rightPad = fracRaw ? (size - (fracRaw.length % size)) % size : 0;
  const intPadded = `${"0".repeat(leftPad)}${intRaw || "0"}`;
  const fracPadded = `${fracRaw}${"0".repeat(rightPad)}`;
  const convert = (bits) => bits.match(new RegExp(`.{1,${size}}`, "g"))?.map((chunk) => chars[parseInt(chunk, 2)]).join("") || "0";
  return `${convert(intPadded)}${fracRaw ? "." + convert(fracPadded) : ""}`;
}

function fractionToBase(frac, base, limit) {
  let value = frac;
  let out = "";
  const chars = "0123456789ABCDEF";
  for (let i = 0; i < limit && value > 1e-8; i += 1) {
    value *= base;
    const digit = Math.floor(value);
    out += chars[digit];
    value -= digit;
  }
  return out || "0";
}

function RadixCard({ label, value, active, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={`radix-card ${active ? "active" : ""}`} onClick={onClick}>
      <span>{label}</span>
      <strong>{value}</strong>
    </Tag>
  );
}

function EncodingLab() {
  const [digit, setDigit] = useState(6);
  const [data, setData] = useState("010110");
  const bcd8421 = digit.toString(2).padStart(4, "0");
  const bcd5421 = encodeWeightedBcd(digit, [5, 4, 2, 1]);
  const bcd2421 = ["0000", "0001", "0010", "0011", "0100", "1011", "1100", "1101", "1110", "1111"][digit];
  const excess3 = (digit + 3).toString(2).padStart(4, "0");
  const gray = digit ^ (digit >> 1);
  const ones = data.replace(/[^1]/g, "").length;
  const oddBit = ones % 2 === 0 ? 1 : 0;
  const evenBit = ones % 2 === 0 ? 0 : 1;

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Cpu size={20} />
        <div>
          <h3>BCD、Gray 码与奇偶校验</h3>
          <p>把 PPT 的编码表变成拨码器：改变十进制数，观察不同编码规则如何生成代码。</p>
        </div>
      </div>
      <Slider label="十进制数码" unit="" value={digit} min={0} max={9} setValue={setDigit} />
      <div className="encoding-grid">
        <RadixCard label="8421 BCD" value={bcd8421} />
        <RadixCard label="5421 BCD" value={bcd5421} />
        <RadixCard label="2421 BCD" value={bcd2421} />
        <RadixCard label="余3码" value={excess3} />
        <RadixCard label="Gray 码" value={gray.toString(2).padStart(4, "0")} />
      </div>
      <table className="code-table">
        <thead>
          <tr><th>十进制</th><th>8421</th><th>5421</th><th>2421</th><th>余3</th><th>Gray</th></tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }, (_, n) => (
            <tr className={n === digit ? "selected" : ""} key={n}>
              <td>{n}</td>
              <td>{n.toString(2).padStart(4, "0")}</td>
              <td>{encodeWeightedBcd(n, [5, 4, 2, 1])}</td>
              <td>{["0000", "0001", "0010", "0011", "0100", "1011", "1100", "1101", "1110", "1111"][n]}</td>
              <td>{(n + 3).toString(2).padStart(4, "0")}</td>
              <td>{(n ^ (n >> 1)).toString(2).padStart(4, "0")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <label className="number-input">
        <span>数据位</span>
        <input value={data} onChange={(event) => setData(event.target.value.replace(/[^01]/g, "").slice(0, 8))} />
      </label>
      <div className="parity-board">
        <span>当前 1 的个数：{ones}</span>
        <strong>奇校验位 {oddBit}</strong>
        <strong>偶校验位 {evenBit}</strong>
      </div>
    </div>
  );
}

function encodeWeightedBcd(value, weights) {
  let remain = value;
  return weights.map((weight) => {
    if (remain >= weight) {
      remain -= weight;
      return "1";
    }
    return "0";
  }).join("");
}

function SignedNumberLab() {
  const [value, setValue] = useState(-117);
  const bits = 8;
  const magnitude = Math.min(127, Math.abs(value));
  const sign = value < 0 ? "1" : "0";
  const magBits = magnitude.toString(2).padStart(bits - 1, "0");
  const original = `${sign}${magBits}`;
  const inverse = value >= 0 ? original : `1${magBits.split("").map((x) => (x === "1" ? "0" : "1")).join("")}`;
  const complement = value >= 0 ? original : ((1 << bits) + value).toString(2).slice(-bits);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Binary size={20} />
        <div>
          <h3>原码、反码、补码对照</h3>
          <p>对应 PPT 中 ±117 的例子。拖动数值，观察负数如何从原码变成反码再加 1 得到补码。</p>
        </div>
      </div>
      <Slider label="十进制整数" unit="" value={value} min={-127} max={127} setValue={setValue} />
      <div className="signed-grid">
        <RadixCard label="原码" value={groupBits(original)} />
        <RadixCard label="反码" value={groupBits(inverse)} />
        <RadixCard label="补码" value={groupBits(complement)} />
      </div>
      <div className="number-line">
        <i style={{ left: `${((value + 127) / 254) * 100}%` }} />
        <span>-127</span>
        <span>0</span>
        <span>+127</span>
      </div>
    </div>
  );
}

function BasicLogicOperationLab() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [gate, setGate] = useState("AND");
  const gates = {
    AND: { name: "与门", expr: "F=A·B", fn: (x, y) => x && y, note: "全 1 出 1，有 0 出 0" },
    OR: { name: "或门", expr: "F=A+B", fn: (x, y) => x || y, note: "有 1 出 1，全 0 出 0" },
    NOT: { name: "非门", expr: "F=A'", fn: (x) => !x, note: "输入取反" },
    NAND: { name: "与非门", expr: "F=(A·B)'", fn: (x, y) => !(x && y), note: "全 1 出 0，有 0 出 1" },
    NOR: { name: "或非门", expr: "F=(A+B)'", fn: (x, y) => !(x || y), note: "有 1 出 0，全 0 出 1" },
    AOI: { name: "与或非门", expr: "F=(A·B+C·D)'", fn: (x, y) => !(x && y), note: "先与、再或、最后取非，此处用 A/B 演示一路" },
    XOR: { name: "异或门", expr: "F=A⊕B", fn: (x, y) => x !== y, note: "相异出 1，相同出 0" },
    XNOR: { name: "同或门", expr: "F=A⊙B", fn: (x, y) => x === y, note: "相同出 1，相异出 0" }
  };
  const current = gates[gate];
  const out = current.fn(a, b);
  const rows = gate === "NOT"
    ? [[0, bit(current.fn(false))], [1, bit(current.fn(true))]]
    : [0, 1].flatMap((x) => [0, 1].map((y) => [x, y, bit(current.fn(!!x, !!y))]));

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Zap size={20} />
        <div>
          <h3>基本逻辑运算开关板</h3>
          <p>把 PPT 中与、或、非、异或的开关电路和真值表合在一张可操作面板里。</p>
        </div>
      </div>
      <div className="bit-row">
        <Toggle label="开关 A" value={a} setValue={setA} />
        {gate !== "NOT" && <Toggle label="开关 B" value={b} setValue={setB} />}
      </div>
      <div className="gate-picker">
        {Object.entries(gates).map(([key, item]) => (
          <button className={gate === key ? "active" : ""} key={key} onClick={() => setGate(key)}>{item.name}</button>
        ))}
      </div>
      <div className="gate-deep-grid">
        <div className="switch-circuit">
          <span>等效开关电路</span>
          <SwitchCircuit gate={gate} a={a} b={b} out={out} />
          <p>{current.note}</p>
        </div>
        <div className="logic-symbol">
          <span>逻辑符号</span>
          <div className="symbol-stage">
            <div className={`wire ${a ? "on" : ""}`}>A={bit(a)}</div>
            <div className="gate-body">{gate}</div>
            {gate !== "NOT" && <div className={`wire ${b ? "on" : ""}`}>B={bit(b)}</div>}
            <div className={`lamp ${out ? "on" : ""}`}>{bit(out)}</div>
          </div>
          <strong>{current.expr}</strong>
        </div>
        <table className="truth gate-truth">
          <thead>
            <tr>{gate === "NOT" ? <><th>A</th><th>F</th></> : <><th>A</th><th>B</th><th>F</th></>}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={gate === "NOT" ? row[0] === bit(a) ? "selected" : "" : row[0] === bit(a) && row[1] === bit(b) ? "selected" : ""} key={row.join("")}>
                {row.map((cell, index) => <td key={index}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SwitchCircuit({ gate, a, b, out }) {
  const parallel = ["OR", "NOR"].includes(gate);
  const inverted = ["NOT", "NAND", "NOR", "AOI"].includes(gate);
  return (
    <svg className="switch-svg" viewBox="0 0 360 210" role="img" aria-label="equivalent switch circuit">
      <path className="wire-path" d="M55 60 H116 M244 60 H300 V150 H55 V60" />
      <path className="battery" d="M42 118 H68 M48 132 H62" />
      <text x="28" y="126">E</text>
      <circle className={`bulb ${out ? "on" : ""}`} cx="300" cy="105" r="20" />
      <path className={`bulb-mark ${out ? "on" : ""}`} d="M286 91 L314 119 M314 91 L286 119" />
      <text x="325" y="110">F={bit(out)}</text>
      {gate === "NOT" ? (
        <>
          <SwitchBlade x={144} y={60} closed={!a} label="A'" />
          <text className="gate-hint" x="126" y="34">A=1 时断开，A=0 时闭合</text>
        </>
      ) : parallel ? (
        <>
          <path className="wire-path" d="M116 60 V38 H244 V60 M116 60 V82 H244 V60" />
          <SwitchBlade x={150} y={38} closed={a} label="A" />
          <SwitchBlade x={150} y={82} closed={b} label="B" />
        </>
      ) : (
        <>
          <SwitchBlade x={144} y={60} closed={a} label="A" />
          <SwitchBlade x={204} y={60} closed={b} label="B" />
        </>
      )}
      {inverted && <text className="gate-hint" x="120" y="190">输出端带小圆点表示取反</text>}
    </svg>
  );
}

function SwitchBlade({ x, y, closed, label }) {
  return (
    <g>
      <circle className="switch-node" cx={x} cy={y} r="4" />
      <circle className="switch-node" cx={x + 48} cy={y} r="4" />
      <line className={`switch-blade ${closed ? "closed" : ""}`} x1={x} y1={y} x2={closed ? x + 48 : x + 38} y2={closed ? y : y - 22} />
      <text x={x + 18} y={y - 30}>{label}</text>
    </g>
  );
}

function groupBits(bits) {
  return `${bits.slice(0, 4)} ${bits.slice(4)}`;
}

function LogicLawLab() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const [law, setLaw] = useState("absorb");
  const left = (a || b) && (a || c);
  const right = a || (b && c);
  const deMorganLeft = !(a && b);
  const deMorganRight = !a || !b;
  const laws = {
    zeroOne: { name: "0-1律", left: "A·0 / A+1", right: "0 / 1", l: a && false, r: false, explain: "与 0 相与必为 0；或 1 相或必为 1。" },
    identity: { name: "自等律", left: "A·1 / A+0", right: "A", l: (a && true) || false, r: a, explain: "1 不限制与运算，0 不改变或运算。" },
    idempotent: { name: "重叠律", left: "A+A / A·A", right: "A", l: (a || a) && (a && a), r: a, explain: "同一个条件重复出现不会改变结果。" },
    complement: { name: "互补律", left: "A+A' / A·A'", right: "1 / 0", l: a || !a, r: true, explain: "一个变量和它的反变量总有一个成立。" },
    absorb: { name: "吸收律", left: "A+AB", right: "A", l: a || (a && b), r: a, explain: "当 A=1 时 AB 已被 A 覆盖；当 A=0 时 AB 必为 0。" },
    absorb2: { name: "吸收律2", left: "A(A+B)", right: "A", l: a && (a || b), r: a, explain: "A 已经作为必要条件，括号中的 A+B 不再增加限制。" },
    eliminate: { name: "消去律", left: "AB+AB'", right: "A", l: (a && b) || (a && !b), r: a, explain: "提取 A 后得到 A(B+B')=A。" },
    combine: { name: "相邻合并", left: "A'BC+ABC", right: "BC", l: (!a && b && c) || (a && b && c), r: b && c, explain: "两个最小项只差 A，可消去 A。" },
    consensus: { name: "冗余项", left: "AB+A'C+BC", right: "AB+A'C", l: (a && b) || (!a && c) || (b && c), r: (a && b) || (!a && c), explain: "BC 项被 AB 和 A'C 覆盖，是多余项。" },
    demorgan: { name: "德摩根", left: "(AB)'", right: "A'+B'", l: deMorganLeft, r: deMorganRight, explain: "与的反函数等于各变量取反后作或。" },
    dual: { name: "对偶分配", left: "(A+B)(A+C)", right: "A+BC", l: left, r: right, explain: "这是 A(B+C)=AB+AC 的对偶形式。" }
  };
  const activeLaw = laws[law];

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <CircuitBoard size={20} />
        <div>
          <h3>逻辑函数相等与德摩根定理</h3>
          <p>把“真值表证明相等”做成实时验证器。拨动 A、B、C，左右两个表达式同时计算。</p>
        </div>
      </div>
      <div className="bit-row">
        <Toggle label="A" value={a} setValue={setA} />
        <Toggle label="B" value={b} setValue={setB} />
        <Toggle label="C" value={c} setValue={setC} />
      </div>
      <div className="gate-picker law-picker">
        {Object.entries(laws).map(([key, item]) => (
          <button className={law === key ? "active" : ""} key={key} onClick={() => setLaw(key)}>{item.name}</button>
        ))}
      </div>
      <div className="law-visual">
        <div className={activeLaw.l ? "on" : ""}>
          <span>左式</span>
          <strong>{activeLaw.left}</strong>
          <b>{bit(activeLaw.l)}</b>
        </div>
        <i>=</i>
        <div className={activeLaw.r ? "on" : ""}>
          <span>右式</span>
          <strong>{activeLaw.right}</strong>
          <b>{bit(activeLaw.r)}</b>
        </div>
      </div>
      <div className="law-explain">
        <strong>为什么成立</strong>
        <p>{activeLaw.explain}</p>
      </div>
      <div className="law-grid">
        <div>
          <span>分配律对偶式</span>
          <strong>(A+B)(A+C) = A+BC</strong>
          <p>{bit(left)} = {bit(right)}</p>
        </div>
        <div>
          <span>德摩根定理</span>
          <strong>(AB)' = A' + B'</strong>
          <p>{bit(deMorganLeft)} = {bit(deMorganRight)}</p>
        </div>
      </div>
    </div>
  );
}

function KmapLab() {
  const [ones, setOnes] = useState([3, 4, 5, 6, 7]);
  const [ones4, setOnes4] = useState([0, 1, 3, 7, 8, 10, 13]);
  const order = [0, 1, 3, 2, 4, 5, 7, 6];
  const order4 = [0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10];
  const labels = ["000", "001", "011", "010", "100", "101", "111", "110"];
  const expression = simplifyThreeVariable(ones);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <CircuitBoard size={20} />
        <div>
          <h3>三变量卡诺图化简</h3>
          <p>对应 PPT 例题 F(A,B,C)=Σm(3,4,5,6,7)。点击格子改变最小项，观察表达式变化。</p>
        </div>
      </div>
      <div className="kmap-layout">
        <div className="kmap">
          <div />
          {["00", "01", "11", "10"].map((bc) => <b key={bc}>{bc}</b>)}
          {[0, 1].map((a) => (
            <React.Fragment key={a}>
              <b>A={a}</b>
              {order.slice(a * 4, a * 4 + 4).map((m, i) => (
                <button
                  className={ones.includes(m) ? "one" : ""}
                  key={m}
                  onClick={() => setOnes(ones.includes(m) ? ones.filter((x) => x !== m) : [...ones, m].sort((x, y) => x - y))}
                >
                  <span>m{m}</span>
                  <strong>{ones.includes(m) ? "1" : "0"}</strong>
                  <em>{labels[a * 4 + i]}</em>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="kmap-result">
          <span>Σm({ones.join(", ") || "空"})</span>
          <strong>F = {expression}</strong>
          <p>课堂提示：圈要尽可能大，圈数要尽可能少；边缘和对称位置也相邻。</p>
        </div>
      </div>
      <div className="kmap-four-wrap">
        <h4>四变量卡诺图：F(A,B,C,D)=Σm(0,1,3,7,8,10,13)</h4>
        <div className="kmap-layout">
          <div className="kmap kmap-four">
            <div />
            {["00", "01", "11", "10"].map((cd) => <b key={cd}>CD={cd}</b>)}
            {["00", "01", "11", "10"].map((ab, row) => (
              <React.Fragment key={ab}>
                <b>AB={ab}</b>
                {order4.slice(row * 4, row * 4 + 4).map((m) => (
                  <button
                    className={ones4.includes(m) ? "one" : ""}
                    key={m}
                    onClick={() => setOnes4(ones4.includes(m) ? ones4.filter((x) => x !== m) : [...ones4, m].sort((x, y) => x - y))}
                  >
                    <span>m{m}</span>
                    <strong>{ones4.includes(m) ? "1" : "0"}</strong>
                    <em>{m.toString(2).padStart(4, "0")}</em>
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="kmap-result">
            <span>Σm({ones4.join(", ") || "空"})</span>
            <strong>标准与或式：{fourVariableCanonical(ones4)}</strong>
            <strong>化简形式：{suggestFourVariable(ones4)}</strong>
            <p>四变量图的左右边界、上下边界也相邻。点击格子可以模拟填图和重新圈组。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function simplifyThreeVariable(ones) {
  const set = new Set(ones);
  if (ones.length === 0) return "0";
  if (ones.length === 8) return "1";
  if ([3, 4, 5, 6, 7].every((x) => set.has(x)) && ones.length === 5) return "A + BC";
  if ([1, 2, 3, 4, 5, 6].every((x) => set.has(x)) && ones.length === 6) return "A'B + A'C + AB' + AC'";
  const terms = ones.map((m) => {
    const bits = m.toString(2).padStart(3, "0");
    return ["A", "B", "C"].map((v, i) => bits[i] === "1" ? v : `${v}'`).join("");
  });
  return terms.join(" + ");
}

function suggestFourVariable(ones) {
  const canonical = [0, 1, 3, 7, 8, 10, 13];
  if (canonical.every((x) => ones.includes(x)) && ones.length === canonical.length) {
    return "A'B'D + A'CD + B'C'D' + AB'CD' + ABC'D";
  }
  if (ones.length === 0) return "F = 0";
  if (ones.length === 16) return "F = 1";
  return `F = Σm(${ones.join(", ")})`;
}

function fourVariableCanonical(ones) {
  if (ones.length === 0) return "0";
  return ones.map((m) => {
    const bits = m.toString(2).padStart(4, "0");
    return ["A", "B", "C", "D"].map((v, i) => bits[i] === "1" ? v : `${v}'`).join("");
  }).join(" + ");
}

function LearningBlock({ title, items, mode }) {
  return (
    <article className={`learning-block ${mode || ""}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            {mode === "steps" && <span>{index + 1}</span>}
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

function GateLab() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const out = gateFns[gate](a, b);
  const rows = [0, 1].flatMap((x) => [0, 1].map((y) => [x, y, bit(gateFns[gate](!!x, !!y))]));

  return (
    <div className="lab-panel">
      <div className="panel-title">
        <Zap size={20} />
        <div>
          <h3>逻辑门真值表实验台</h3>
          <p>把课件里的门电路符号变成可拨动开关。输出灯和真值表同步变化。</p>
        </div>
      </div>
      <div className="segmented">
        {Object.keys(gateFns).map((name) => (
          <button className={gate === name ? "active" : ""} key={name} onClick={() => setGate(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className="gate-layout">
        <div className="switch-bank">
          <Toggle label="A" value={a} setValue={setA} />
          <Toggle label="B" value={b} setValue={setB} />
        </div>
        <div className="gate-svg" data-hot={out ? "1" : "0"}>
          <div className={`wire ${a ? "on" : ""}`}>A={bit(a)}</div>
          <div className="gate-body">{gate}</div>
          <div className={`wire ${b ? "on" : ""}`}>B={bit(b)}</div>
          <div className={`lamp ${out ? "on" : ""}`}>{bit(out)}</div>
        </div>
        <table className="truth">
          <thead>
            <tr><th>A</th><th>B</th><th>F</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={row[0] === bit(a) && row[1] === bit(b) ? "selected" : ""} key={row.join("")}>
                {row.map((cell, index) => <td key={index}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Toggle({ label, value, setValue }) {
  return (
    <button className={`toggle ${value ? "on" : ""}`} onClick={() => setValue(!value)}>
      <span>{label}</span>
      <b>{value ? "高电平 1" : "低电平 0"}</b>
    </button>
  );
}

function CoincidenceLab() {
  const [bits, setBits] = useState([1, 1, 1]);
  const [step, setStep] = useState(0);
  const same = bits.every((v) => v === bits[0]);
  const steps = [
    "写中间变量：P2=A'B'C'，P3=AB'C' 或按电路逐级标注。",
    "列真值表：只有 000 和 111 让三个输入一致。",
    "得到功能：F=A'B'C' + ABC，称为三变量一致检测。"
  ];

  return (
    <div className="lab-panel">
      <div className="panel-title">
        <CircuitBoard size={20} />
        <div>
          <h3>组合逻辑：一致检测器</h3>
          <p>改造第3章例题：从逻辑图分析到功能判断，让学生看到“为什么是 000 或 111”。</p>
        </div>
      </div>
      <div className="bit-row">
        {["A", "B", "C"].map((name, index) => (
          <button
            key={name}
            className={`bit ${bits[index] ? "on" : ""}`}
            onClick={() => setBits(bits.map((v, i) => (i === index ? 1 - v : v)))}
          >
            <span>{name}</span>
            <strong>{bits[index]}</strong>
          </button>
        ))}
      </div>
      <div className="equation-board">
        <div className="formula">F = A'B'C' + ABC</div>
        <div className={`result ${same ? "on" : ""}`}>{same ? "输入一致，F=1" : "输入不一致，F=0"}</div>
      </div>
      <div className="stepper">
        <button onClick={() => setStep((step + steps.length - 1) % steps.length)}><RotateCcw size={16} /></button>
        <p>{steps[step]}</p>
        <button onClick={() => setStep((step + 1) % steps.length)}><Play size={16} /></button>
      </div>
    </div>
  );
}

function CounterLab() {
  const [count, setCount] = useState(0);
  const states = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);
  const bits = [0, 1, 2, 3].map((i) => (count >> i) & 1);

  return (
    <div className="lab-panel">
      <div className="panel-title">
        <Clock3 size={20} />
        <div>
          <h3>四位异步二进制加法计数器</h3>
          <p>对应第6章波形图：每按一次 CLK，Q0-Q3 翻转并同步画出 16 个状态。</p>
        </div>
      </div>
      <div className="counter-controls">
        <button className="primary-action small" onClick={() => setCount((count + 1) % 16)}>CLK ↑</button>
        <button className="ghost-action small" onClick={() => setCount(0)}>清零</button>
        <div className="count-readout">{count.toString(2).padStart(4, "0")}<span>{count}</span></div>
      </div>
      <div className="flipflops">
        {bits.map((v, i) => (
          <div className={`ff ${v ? "on" : ""}`} key={i}>
            <span>Q{i}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
      <div className="waveform">
        {["CLK", "Q0", "Q1", "Q2", "Q3"].map((name, row) => (
          <div className="wave-row" key={name}>
            <span>{name}</span>
            <div className="cells">
              {states.map((s) => {
                const active = row === 0 ? s <= count : ((s >> (row - 1)) & 1) === 1 && s <= count;
                return <i className={active ? "high" : ""} key={s} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PulseAndConversionLab() {
  const [r, setR] = useState(47);
  const [c, setC] = useState(10);
  const [vin, setVin] = useState(2.7);
  const period = (0.693 * (2 * r) * c / 1000).toFixed(2);
  const code = Math.min(15, Math.max(0, Math.round((vin / 5) * 15)));
  const quantized = ((code / 15) * 5).toFixed(2);

  return (
    <div className="dual-labs">
      <div className="lab-panel">
        <div className="panel-title">
          <Waves size={20} />
          <div>
            <h3>555 脉冲调参器</h3>
            <p>把第8章的 R、C 参数和矩形波周期联系起来。</p>
          </div>
        </div>
        <Slider label="R" unit="kΩ" value={r} min={10} max={100} setValue={setR} />
        <Slider label="C" unit="nF" value={c} min={1} max={47} setValue={setC} />
        <div className="pulse-box">
          <div className="square-wave" style={{ "--speed": `${Math.max(0.8, 3 - period / 2)}s` }} />
          <strong>T ≈ {period} ms</strong>
        </div>
      </div>
      <div className="lab-panel">
        <div className="panel-title">
          <Gauge size={20} />
          <div>
            <h3>4 位 A/D 量化阶梯</h3>
            <p>对应第9章：模拟电压被映射到有限数字码，误差由此产生。</p>
          </div>
        </div>
        <Slider label="Vin" unit="V" value={vin} min={0} max={5} step={0.1} setValue={setVin} />
        <div className="adc-stage">
          <div className="meter"><i style={{ height: `${(vin / 5) * 100}%` }} /></div>
          <div className="adc-code">{code.toString(2).padStart(4, "0")}</div>
          <div className="quant">量化值 {quantized} V</div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, unit, value, min, max, step = 1, setValue }) {
  return (
    <label className="slider">
      <span>{label}: <b>{value}</b> {unit}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );
}

function Quiz() {
  const [selected, setSelected] = useState({});
  return (
    <section className="section">
      <div className="section-head">
        <p className="eyebrow">Quick Check</p>
        <h2>随堂小测：听懂之后马上确认</h2>
      </div>
      <div className="quiz-grid">
        {quizItems.map((item, qi) => (
          <article className="quiz-card" key={item.question}>
            <h3>{item.question}</h3>
            {item.options.map((option, oi) => (
              <button
                key={option}
                className={selected[qi] === oi ? (oi === item.answer ? "right" : "wrong") : ""}
                onClick={() => setSelected({ ...selected, [qi]: oi })}
              >
                {option}
              </button>
            ))}
            {selected[qi] !== undefined && <p>{item.explain}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Labs() {
  return (
    <section className="section" id="labs">
      <div className="section-head">
        <p className="eyebrow">Interactive Labs</p>
        <h2>先做 5 个课堂高频演示模块</h2>
      </div>
      <div className="labs-stack">
        <GateLab />
        <CoincidenceLab />
        <CounterLab />
        <PulseAndConversionLab />
      </div>
    </section>
  );
}

function App() {
  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0].id);
  const selectedChapter = chapters.find((chapter) => chapter.id === selectedChapterId) || chapters[0];

  return (
    <>
      <nav className="topbar">
        <div><Cpu size={20} /> 数字逻辑互动实验室</div>
        <a href="#chapters">课程目录</a>
        <a href="#chapter-content">章节内容</a>
      </nav>
      <Hero />
      <main>
        <ChapterMap selectedId={selectedChapterId} onSelect={setSelectedChapterId} />
        <div id="chapter-content">
          <ChapterDetail chapter={selectedChapter} />
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
