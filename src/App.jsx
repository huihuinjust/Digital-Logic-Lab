import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
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
        {chapter.id === "gates" && <GateLab />}
        {chapter.id === "combinational" && <CoincidenceLab />}
        {chapter.id === "counters" && <CounterLab />}
        {chapter.id === "pulse" && <PulseAndConversionLab />}
        {chapter.id === "conversion" && <PulseAndConversionLab />}
        {!["gates", "combinational", "counters", "pulse", "conversion"].includes(chapter.id) && (
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
