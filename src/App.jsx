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
        <h2>选择章节进入课程内容</h2>
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
              <span>本章结构</span>
              <span>基础知识点</span>
              <span>互动仿真</span>
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
          <p>{chapter.subtitle}</p>
        </div>
        <div className="detail-badge">{chapter.lab}</div>
      </div>
      <div className="learning-grid">
        <LearningBlock title="本章结构" items={chapter.structure} mode="steps" />
        <LearningBlock title="基础知识点" items={chapter.knowledge} />
        <LearningBlock title="互动仿真" items={chapter.simulations} mode="chips" />
        <LearningBlock title="题目录入" items={chapter.exercises} />
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
      <ContentSection
        title="1.0 绪论：从模拟世界到数字系统"
        points={[
          "电子电路的作用是处理和传输信号，信号是信息的载体。",
          "模拟量连续变化，例如温度、压力、距离；数字量是经过抽样、量化、编码得到的离散量。",
          "数字电路基本单元简单、易集成，既能做数值运算，也能做逻辑运算，并且便于存储。"
        ]}
      />
      <SignalSamplingLab />
      <ContentSection
        title="1.1 数制与数制转换"
        points={[
          "数制包括计数符号和进位规则。十进制逢十进一，二进制逢二进一，八进制逢八进一，十六进制逢十六进一。",
          "按权展开是任意进制转十进制的基础，例如 1011.101B = 8 + 2 + 1 + 0.5 + 0.125。",
          "二进制和八/十六进制转换可以分组完成：3 位二进制对应 1 位八进制，4 位二进制对应 1 位十六进制。"
        ]}
      />
      <NumberSystemLab />
      <ContentSection
        title="1.2 几种简单编码"
        points={[
          "BCD 码用 4 位二进制代码表示 1 位十进制数，常见形式有 8421、5421、2421、余3码。",
          "Gray 码是循环码，相邻两个代码之间只有 1 位不同，可降低转换和传输出错可能。",
          "奇偶校验码通过增加校验位，使整个数据中 1 的个数满足奇数或偶数要求；它能检错，但不能纠错。"
        ]}
      />
      <EncodingLab />
      <ContentSection
        title="1.3 有符号二进制数"
        points={[
          "原码最高位为符号位，数值位表示绝对值，但 0 有两种表示，符号位不能直接参与运算。",
          "反码中正数不变，负数数值位逐位取反，同样存在 +0 和 -0。",
          "补码中正数不变，负数为反码加 1；0 只有一种表示，是计算机中最常用的有符号数表示。"
        ]}
      />
      <SignedNumberLab />
      <ContentSection
        title="1.4-1.5 逻辑运算、基本定律和规则"
        points={[
          "基本逻辑运算包括与、或、非，复合逻辑包括与非、或非、异或、同或等。",
          "两个逻辑函数若在所有变量取值下输出都相等，则两个函数相等，真值表是证明相等的直接工具。",
          "常用规则包括代入规则、反演规则和对偶规则；德摩根定理是公式化简中非常重要的工具。"
        ]}
      />
      <LogicLawLab />
      <ContentSection
        title="1.6-1.8 标准形式、真值表与卡诺图化简"
        points={[
          "最小项是包含全部变量的与项，标准与或式是最小项之和；最大项是包含全部变量的或项，标准或与式是最大项之积。",
          "由表达式列真值表、由真值表写表达式，是分析和设计数字电路的基本桥梁。",
          "卡诺图把真值表重新排布，让相邻最小项可以合并，达到项数最少、每项变量数最少。"
        ]}
      />
      <KmapLab />
    </div>
  );
}

function ContentSection({ title, points }) {
  return (
    <article className="content-section">
      <h3>{title}</h3>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}

function SignalSamplingLab() {
  const [samples, setSamples] = useState(12);
  const [levels, setLevels] = useState(8);
  const wave = Array.from({ length: 24 }, (_, i) => 27 + 6 * Math.sin((i / 23) * Math.PI * 2 - 0.8) + 2 * Math.sin((i / 23) * Math.PI * 4));
  const picked = wave.filter((_, i) => i % Math.max(1, Math.floor(24 / samples)) === 0).slice(0, samples);
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
        <Slider label="抽样点数" unit="点" value={samples} min={4} max={24} setValue={setSamples} />
        <Slider label="量化等级" unit="级" value={levels} min={4} max={16} setValue={setLevels} />
      </div>
      <div className="signal-stage">
        <svg viewBox="0 0 720 260" role="img" aria-label="sampling and quantization graph">
          {Array.from({ length: levels }).map((_, i) => {
            const y = 230 - (i / (levels - 1)) * 190;
            return <line className="grid-line" key={i} x1="40" x2="690" y1={y} y2={y} />;
          })}
          <polyline
            className="analog-wave"
            points={wave.map((v, i) => `${40 + i * (650 / 23)},${230 - ((v - min) / (max - min)) * 190}`).join(" ")}
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
          {picked.slice(0, 12).map((v, i) => {
            const q = quantize(v);
            return <span key={i}>{q.toString(2).padStart(Math.ceil(Math.log2(levels)), "0")}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

function NumberSystemLab() {
  const [number, setNumber] = useState("45.5");
  const decimal = Number(number);
  const safe = Number.isFinite(decimal) ? decimal : 0;
  const intPart = Math.trunc(Math.abs(safe));
  const fracPart = Math.abs(safe) - intPart;
  const binary = `${safe < 0 ? "-" : ""}${intPart.toString(2)}${fracPart ? "." + fractionToBase(fracPart, 2, 8) : ""}`;
  const octal = `${safe < 0 ? "-" : ""}${intPart.toString(8)}${fracPart ? "." + fractionToBase(fracPart, 8, 6) : ""}`;
  const hex = `${safe < 0 ? "-" : ""}${intPart.toString(16).toUpperCase()}${fracPart ? "." + fractionToBase(fracPart, 16, 5).toUpperCase() : ""}`;
  const powers = intPart.toString(2).split("").reverse().map((digit, index) => ({ digit, power: index })).reverse();

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
        <RadixCard label="二进制" value={binary} />
        <RadixCard label="八进制" value={octal} />
        <RadixCard label="十六进制" value={hex} />
      </div>
      <div className="weight-board">
        {powers.map((item, index) => (
          <div className={item.digit === "1" ? "active" : ""} key={`${item.power}-${index}`}>
            <strong>{item.digit}</strong>
            <span>2^{item.power}</span>
          </div>
        ))}
      </div>
    </div>
  );
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

function RadixCard({ label, value }) {
  return (
    <div className="radix-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EncodingLab() {
  const [digit, setDigit] = useState(6);
  const [data, setData] = useState("010110");
  const bcd8421 = digit.toString(2).padStart(4, "0");
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
        <RadixCard label="余3码" value={excess3} />
        <RadixCard label="Gray 码" value={gray.toString(2).padStart(4, "0")} />
      </div>
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

function groupBits(bits) {
  return `${bits.slice(0, 4)} ${bits.slice(4)}`;
}

function LogicLawLab() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const left = (a || b) && (a || c);
  const right = a || (b && c);
  const deMorganLeft = !(a && b);
  const deMorganRight = !a || !b;

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
  const order = [0, 1, 3, 2, 4, 5, 7, 6];
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
        <Quiz />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
