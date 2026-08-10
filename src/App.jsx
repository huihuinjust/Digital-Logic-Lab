import React, { useEffect, useMemo, useState } from "react";
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
  NOT: (a) => !a,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XOR: (a, b) => a !== b,
  XNOR: (a, b) => a === b
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
        {chapter.id === "gates" && <ChapterTwoContent />}
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

function ChapterTwoContent() {
  return (
    <div className="chapter-two">
      <SimulationIndex
        chapterLabel="Chapter 02 Simulations"
        title="第二章仿真工作台"
        items={[
          "半导体开关特性",
          "逻辑门真值表",
          "TTL/CMOS 对比",
          "噪声容限演示",
          "门级延时观察"
        ]}
      />
      <SemiconductorSwitchLab />
      <GateLab />
      <LogicFamilyLab />
      <NoiseMarginLab />
      <GateDelayLab />
    </div>
  );
}

function SimulationIndex({ items, chapterLabel = "Chapter 01 Simulations", title = "第一章仿真工作台" }) {
  return (
    <article className="simulation-index">
      <div>
        <p className="eyebrow">{chapterLabel}</p>
        <h3>{title}</h3>
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
      <TimerWaveformBank probe={probe} seconds={seconds} digits={digits} />
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
  const history = Array.from({ length: 24 }, (_, i) => tick - 23 + i);
  return (
    <div className="oscilloscope">
      <div>
        <span>示波器探头</span>
        <strong>{title}</strong>
      </div>
      <WaveformSvg
        rows={bits.map((_, row) => ({
          label: `CH${row + 1}`,
          values: history.map((t) => row === 0 && bits.length === 1 ? Math.abs(t) % 2 : bits[row])
        }))}
      />
    </div>
  );
}

function TimerWaveformBank({ probe, seconds, digits }) {
  const history = Array.from({ length: 24 }, (_, i) => positiveMod(seconds - 23 + i, 60));
  const rows = [
    { key: "clk", label: "CLK", values: history.map((t) => t % 2) },
    { key: "counter", label: "秒个Q0", values: history.map((t) => (t % 10) & 1) },
    { key: "counter", label: "秒个Q1", values: history.map((t) => ((t % 10) >> 1) & 1) },
    { key: "counter", label: "秒十Q0", values: history.map((t) => (Math.floor((t % 60) / 10)) & 1) },
    { key: "decoder", label: "段a", values: history.map((t) => sevenSegmentBits(t % 10)[0]) }
  ];
  return (
    <div className="oscilloscope wide-scope">
      <div>
        <span>连续示波器</span>
        <strong>点击 1s 脉冲后，关键节点波形同步推进；当前探头：{probe}</strong>
      </div>
      <WaveformSvg rows={rows.map((row) => ({ ...row, active: row.key === probe }))} />
      <div className="scope-readout">
        <span>当前显示</span>
        <strong>{digits.join(" ")}</strong>
      </div>
    </div>
  );
}

function positiveMod(value, mod) {
  return ((value % mod) + mod) % mod;
}

function WaveformSvg({ rows }) {
  return (
    <div className="scope-channel-grid">
      {rows.map((row, rowIndex) => {
        const high = 28;
        const low = 70;
        const step = 20;
        const points = row.values.flatMap((value, index) => {
          const x = 18 + index * step;
          const y = value ? high : low;
          if (index === 0) return [`${x},${y}`];
          const prevY = row.values[index - 1] ? high : low;
          return [`${x},${prevY}`, `${x},${y}`];
        }).join(" ");
        return (
          <div className={row.active ? "scope-mini active" : "scope-mini"} key={row.label}>
            <span>{row.label}</span>
            <svg viewBox="0 0 500 92" role="img" aria-label={`${row.label} waveform`}>
              <line x1="16" x2="484" y1={low} y2={low} className="scope-baseline" />
              <polyline points={points} className={row.active ? "scope-trace active" : "scope-trace"} />
            </svg>
          </div>
        );
      })}
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
        <div className="dac-input-bank">
          {bits.map((value, index) => (
            <button className={probe === "digital" ? "active" : ""} key={index} onClick={() => setProbe("digital")}>
              <span>D{3 - index}</span>
              <b>{value}</b>
            </button>
          ))}
        </div>
        <i />
        <button className={probe === "dac" ? "active dac-network" : "dac-network"} onClick={() => setProbe("dac")}>
          <span>D/A转换器：二进制权重电阻网络</span>
          <b>{bits.map((v, i) => `${v ? "5V" : "0V"}${i < 3 ? " | " : ""}`).join("")}</b>
          <DacLadder bits={bits} />
          <em>这是 D/A 转换器的一种内部实现：D3 权重大，D0 权重小，各位电压按权相加得到模拟电压。</em>
        </button>
        <i />
        <button className={probe === "analog" ? "active opamp-block" : "opamp-block"} onClick={() => setProbe("analog")}>
          <span>求和放大器 / 负载</span>
          <b>Vout={voltage} V</b>
        </button>
        <div className="analog-lamp" style={{ "--light": code / 15 }}>
          <span>模拟亮度</span>
          <b>{Math.round((code / 15) * 100)}%</b>
        </div>
      </div>
      <DacWaveformBank code={code} probe={probe} />
      <DacStaircaseExample />
    </div>
  );
}

function DacLadder({ bits }) {
  return (
    <svg className="dac-ladder" viewBox="0 0 320 120" role="img" aria-label="R-2R ladder">
      <path className="ladder-wire" d="M24 58 H292" />
      {bits.map((value, index) => {
        const x = 54 + index * 58;
        return (
          <g key={index}>
            <path className={value ? "ladder-bit on" : "ladder-bit"} d={`M${x} 20 V58`} />
            <path className="resistor" d={`M${x - 16} 58 l8 -8 l8 16 l8 -16 l8 16 l8 -16 l8 8`} />
            <text x={x - 8} y="16">D{3 - index}</text>
          </g>
        );
      })}
      <path className="ladder-wire" d="M292 58 L306 48 L306 68 Z" />
    </svg>
  );
}

function DacStaircaseExample() {
  const [step, setStep] = useState(0);
  const [gain, setGain] = useState(8);
  const [micOn, setMicOn] = useState(true);
  const sequence = [8, 10, 12, 13, 12, 9, 6, 3, 2, 4, 7, 11, 14, 13, 9, 8];
  useEffect(() => {
    const timer = window.setInterval(() => setStep((value) => value + 1), 520);
    return () => window.clearInterval(timer);
  }, []);
  const current = micOn ? sequence[step % sequence.length] : 0;
  const amplified = Math.min(15, Math.round(current * gain / 8));
  return (
    <div className="dac-extra">
      <div>
        <h4>数模例子：麦克风采样、数字处理、喇叭播放</h4>
        <p>麦克风声音经 A/D 采样成数字码，数字增益处理后送入 D/A，再经功放驱动喇叭。</p>
      </div>
      <div className="dac-extra-controls">
        <button className={micOn ? "primary-action small" : "ghost-action small"} onClick={() => setMicOn(!micOn)}>麦克风 {micOn ? "接入" : "断开"}</button>
        <Slider label="音量倍数" unit="x" value={gain} min={2} max={12} setValue={setGain} />
      </div>
      <AudioSystemDiagram micOn={micOn} current={current} amplified={amplified} gain={gain} step={step} />
      <div className="audio-chain">
        {[
          ["麦克风", "模拟声音"],
          ["A/D采样", current.toString(2).padStart(4, "0")],
          ["数字增益", amplified.toString(2).padStart(4, "0")],
          ["D/A转换", `${((amplified / 15) * 5).toFixed(2)}V`],
          ["功放+喇叭", "声波"]
        ].map(([label, value], index) => (
          <React.Fragment key={label}>
            <div className="audio-node"><span>{label}</span><b>{value}</b></div>
            {index < 4 && <i />}
          </React.Fragment>
        ))}
      </div>
      <div className="dac-extra-grid">
        <RadixCard label="当前数字码" value={current.toString(2).padStart(4, "0")} />
        <RadixCard label="处理后码" value={amplified.toString(2).padStart(4, "0")} />
        <RadixCard label="喇叭电压" value={`${((amplified / 15) * 5).toFixed(2)} V`} />
      </div>
      <AnalogWaveformSvg rows={[{
        key: "mic",
        label: "麦克风",
        active: false,
        analog: Array.from({ length: 16 }, (_, i) => micOn ? sequence[(step + i) % sequence.length] / 15 : 0)
      }, {
        key: "speaker",
        label: "喇叭输出",
        active: true,
        analog: Array.from({ length: 16 }, (_, i) => micOn ? Math.min(15, Math.round(sequence[(step + i) % sequence.length] * gain / 8)) / 15 : 0)
      }]} />
    </div>
  );
}

function AudioSystemDiagram({ micOn, current, amplified, gain, step }) {
  const wave = (startX, width, centerY, amp, count = 54) => Array.from({ length: count }, (_, i) => {
    const x = startX + (i / (count - 1)) * width;
    const y = centerY + Math.sin((i + step) * 0.62) * amp + Math.sin((i + step) * 1.33) * amp * 0.22;
    return `${x},${y}`;
  }).join(" ");
  const micPath = wave(34, 150, 40, micOn ? 18 : 0, 64);
  const preampPath = wave(126, 74, 112, micOn ? 14 : 0, 28);
  const dacPath = wave(574, 70, 112, micOn ? 13 : 0, 28);
  const speakerPath = wave(748, 166, 56, micOn ? Math.max(8, gain * 2.4) : 0, 60);
  const samplePoints = Array.from({ length: 12 }, (_, i) => {
    const value = micOn ? (8 + Math.sin((step + i) * 0.62) * 5 + Math.sin((step + i) * 1.33) * 1.2) / 15 : 0;
    return { x: 284 + i * 9, y: 136 - value * 58 };
  });
  return (
    <svg className="audio-system-svg" viewBox="0 0 940 210" role="img" aria-label="microphone sampling digital processing dac amplifier speaker circuit">
      <path className={micOn ? "sound-wave on" : "sound-wave"} d={`M${micPath}`} />
      <g className="mic-symbol">
        <rect x="24" y="92" width="22" height="42" rx="11" />
        <path d="M35 134 V162 M18 162 H52" />
        <text x="12" y="184">麦克风</text>
      </g>
      <SwitchBlade x={76} y={112} closed={micOn} label="声音开关" />
      <path className={micOn ? "sound-wave on mid" : "sound-wave mid"} d={`M${preampPath}`} />
      <path className="wire-path" d="M124 112 H178" />
      <rect className="audio-block" x="178" y="54" width="96" height="116" rx="8" />
      <text x="202" y="96">前置</text><text x="202" y="124">放大</text>
      <path className="wire-path" d="M274 112 H322" />
      {samplePoints.map((point, index) => <line className={micOn ? "sample-stem on" : "sample-stem"} x1={point.x} x2={point.x} y1={point.y} y2="136" key={`stem-${index}`} />)}
      {samplePoints.map((point, index) => <circle className={micOn ? "sample-dot on" : "sample-dot"} cx={point.x} cy={point.y} r="4" key={index} />)}
      <rect className="audio-block" x="322" y="54" width="100" height="116" rx="8" />
      <text x="344" y="96">A/D</text><text x="336" y="124">{current.toString(2).padStart(4, "0")}</text>
      <path className="wire-path" d="M422 112 H470" />
      <rect className="audio-block" x="470" y="54" width="112" height="116" rx="8" />
      <text x="498" y="90">数字</text><text x="490" y="118">增益 x{gain}</text><text x="488" y="146">{amplified.toString(2).padStart(4, "0")}</text>
      <path className="wire-path" d="M582 112 H628" />
      <path className={micOn ? "sound-wave on mid" : "sound-wave mid"} d={`M${dacPath}`} />
      <rect className="audio-block" x="628" y="54" width="100" height="116" rx="8" />
      <text x="650" y="96">D/A</text><text x="642" y="124">{((amplified / 15) * 5).toFixed(2)}V</text>
      <path className="wire-path" d="M728 112 H784" />
      <path className="amp-symbol" d="M784 70 L860 112 L784 154 Z" />
      <text x="804" y="118">功放</text>
      <path className="wire-path" d="M860 112 H892" />
      <path className="speaker-symbol" d="M892 92 H908 L928 72 V152 L908 132 H892 Z" />
      <path className={micOn ? "sound-wave on" : "sound-wave"} d={`M${speakerPath}`} />
      <text x="876" y="184">喇叭输出</text>
      <g className="node-scope">
        <text x="180" y="36">模拟</text><text x="336" y="36">采样码</text><text x="640" y="36">模拟电压</text>
      </g>
    </svg>
  );
}

function DacWaveformBank({ code, probe }) {
  const history = Array.from({ length: 16 }, (_, i) => Math.max(0, code - 15 + i));
  const digitalRows = [
    { key: "digital", label: "D3", values: history.map((v) => (v >> 3) & 1) },
    { key: "digital", label: "D2", values: history.map((v) => (v >> 2) & 1) },
    { key: "digital", label: "D1", values: history.map((v) => (v >> 1) & 1) },
    { key: "digital", label: "D0", values: history.map((v) => v & 1) }
  ];
  const analogRows = [
    { key: "dac", label: "Vout", analog: history.map((v) => v / 15) },
    { key: "analog", label: "亮度", analog: history.map((v) => v / 15) }
  ];
  return (
    <div className="oscilloscope wide-scope">
      <div>
        <span>连续示波器</span>
        <strong>4 位输入码、D/A 阶梯电压和模拟亮度同步变化；当前探头：{probe}</strong>
      </div>
      <AnalogWaveformSvg className="dac-bit-grid" rows={digitalRows.map((row) => ({ ...row, active: row.key === probe }))} />
      <AnalogWaveformSvg rows={analogRows.map((row) => ({ ...row, active: row.key === probe }))} />
    </div>
  );
}

function AnalogWaveformSvg({ rows, className = "" }) {
  return (
    <div className={`scope-channel-grid ${className}`}>
      {rows.map((row, rowIndex) => {
        const top = 28;
        const low = 70;
        const step = 30;
        const values = row.analog || row.values;
        const points = values.flatMap((value, index) => {
          const x = 18 + index * step;
          const y = row.analog ? low - value * 24 : value ? top : low;
          if (index === 0) return [`${x},${y}`];
          const prev = values[index - 1];
          const prevY = row.analog ? low - prev * 24 : prev ? top : low;
          return [`${x},${prevY}`, `${x},${y}`];
        }).join(" ");
        return (
          <div className={row.active ? "scope-mini active" : "scope-mini"} key={row.label}>
            <span>{row.label}</span>
            <svg viewBox="0 0 500 92" role="img" aria-label={`${row.label} waveform`}>
              <line x1="16" x2="484" y1={low} y2={low} className="scope-baseline" />
              <polyline points={points} className={row.active ? "scope-trace active" : "scope-trace"} />
            </svg>
          </div>
        );
      })}
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
    AOI: { name: "与或非门", expr: "F=(A·B+C·D)'", fn: (x, y) => !(x && y), note: "两条与支路先并联成或，再在输出端取非；演示中 C=0、D=1 固定为一路断开" },
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
          <LogicGateSymbol gate={gate} a={a} b={b} out={out} />
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
  const networks = {
    AND: { lanes: [["A", "B"]], invert: false },
    OR: { lanes: [["A"], ["B"]], invert: false },
    NOT: { lanes: [["A'"]], invert: false, note: "A=1 时开关断开，A=0 时闭合" },
    NAND: { lanes: [["A", "B"]], invert: true },
    NOR: { lanes: [["A"], ["B"]], invert: true },
    XOR: { lanes: [["A", "B'"], ["A'", "B"]], invert: false, note: "上支路表示 A=1、B=0；下支路表示 A=0、B=1" },
    XNOR: { lanes: [["A", "B"], ["A'", "B'"]], invert: false, note: "上支路表示同为 1；下支路表示同为 0" },
    AOI: { lanes: [["A", "B"], ["C", "D"]], invert: true, fixed: { C: false, D: true }, note: "C=0、D=1，因此第二条与支路断开；输出端再取非" }
  };
  const config = networks[gate] || networks.AND;
  return (
    <>
      <svg className="switch-svg" viewBox="0 0 390 210" role="img" aria-label="equivalent switch circuit">
        <path className="wire-path" d="M55 78 H92 M310 78 H332 V168 H55 V78" />
        <path className="battery" d="M42 118 H68 M48 132 H62" />
        <text x="26" y="126">E</text>
        <circle className={`bulb ${out ? "on" : ""}`} cx="332" cy="123" r="20" />
        <path className={`bulb-mark ${out ? "on" : ""}`} d="M318 109 L346 137 M346 109 L318 137" />
        <text x="354" y="128">F={bit(out)}</text>
        <NetworkBranches lanes={config.lanes} a={a} b={b} fixed={config.fixed} />
        {config.invert && (
          <g className="inverter-stage">
            <rect x="272" y="58" width="38" height="40" rx="6" />
            <circle cx="316" cy="78" r="5" />
            <text x="278" y="84">取反</text>
          </g>
        )}
      </svg>
      <div className="circuit-caption">
        {config.note && <span>{config.note}</span>}
        {config.invert && <span>输出端小圆点表示该网络结果再取反</span>}
      </div>
    </>
  );
}

function NetworkBranches({ lanes, a, b, fixed = {} }) {
  const active = { A: a, B: b, C: fixed.C ?? true, D: fixed.D ?? true, "A'": !a, "B'": !b, "C'": !(fixed.C ?? true), "D'": !(fixed.D ?? true) };
  return (
    <g>
      {lanes.map((lane, laneIndex) => {
        const y = lanes.length === 1 ? 78 : 52 + laneIndex * 52;
        const endX = 132 + lane.length * 68;
        return (
          <g key={`${lane.join("-")}-${laneIndex}`}>
            <path className="wire-path" d={`M92 78 V${y} H132 M${endX} ${y} H272 V78`} />
            {lane.map((name, index) => <SwitchBlade key={`${name}-${index}`} x={132 + index * 68} y={y} closed={active[name]} label={`${name}=${bit(active[name])}`} />)}
          </g>
        );
      })}
    </g>
  );
}

function LogicGateSymbol({ gate, a, b, out }) {
  const inputY = gate === "NOT" ? [82] : [62, 104];
  const gatePath = (() => {
    if (gate === "OR" || gate === "NOR" || gate === "XOR" || gate === "XNOR") return "M142 42 C168 42 194 56 214 83 C194 110 168 124 142 124 C154 98 154 68 142 42 Z";
    if (gate === "NOT") return "M146 52 L146 112 L210 82 Z";
    return "M142 42 H178 C210 42 226 58 226 83 C226 108 210 124 178 124 H142 Z";
  })();
  const hasBubble = ["NOT", "NAND", "NOR", "XNOR", "AOI"].includes(gate);
  const outputStart = hasBubble ? 238 : 226;
  return (
    <svg className="logic-gate-svg" viewBox="0 0 330 166" role="img" aria-label={`${gate} logic symbol`}>
      <path className={a ? "symbol-wire on" : "symbol-wire"} d={`M28 ${inputY[0]} H142`} />
      <text x="34" y={inputY[0] - 10}>A={bit(a)}</text>
      {gate !== "NOT" && (
        <>
          <path className={b ? "symbol-wire on" : "symbol-wire"} d={`M28 ${inputY[1]} H142`} />
          <text x="34" y={inputY[1] + 22}>B={bit(b)}</text>
        </>
      )}
      {(gate === "XOR" || gate === "XNOR") && <path className="gate-shape extra" d="M132 42 C144 70 144 96 132 124" />}
      <path className="gate-shape" d={gatePath} />
      {gate === "AOI" && <text x="156" y="87">AOI</text>}
      {hasBubble && <circle className="gate-bubble" cx="233" cy="83" r="6" />}
      <path className={out ? "symbol-wire on" : "symbol-wire"} d={`M${outputStart} 83 H284`} />
      <circle className={out ? "lamp on" : "lamp"} cx="304" cy="83" r="18" />
      <text x="298" y="89">{bit(out)}</text>
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
  const [law, setLaw] = useState("zeroAnd");
  const [lawTab, setLawTab] = useState("and");
  const laws = {
    zeroAnd: { name: "0-1律", left: "A·0", right: "0", l: a && false, r: false, explain: "与式中只要串入一个 0，整条通路一定断开。" },
    identityAnd: { name: "自等律", left: "A·1", right: "A", l: a && true, r: a, explain: "与式中串入 1，相当于串入一只永远闭合的开关，不改变 A。" },
    idempotentAnd: { name: "重迭律", left: "A·A", right: "A", l: a && a, r: a, explain: "两个同状态 A 开关串联，通断仍由 A 决定。" },
    compAnd: { name: "互补律", left: "A·A'", right: "0", l: a && !a, r: false, explain: "A 与 A' 不可能同时为 1，所以串联通路一定断开。" },
    commuteAnd: { name: "交换律", left: "A·B", right: "B·A", l: a && b, r: b && a, explain: "串联开关前后顺序互换，不改变整条通路是否接通。" },
    assocAnd: { name: "结合律", left: "A(BC)", right: "(AB)C", l: a && (b && c), r: (a && b) && c, explain: "三个开关串联时，先把哪两个看成一组，最终通断相同。" },
    distribAnd: { name: "分配律", left: "A(B+C)", right: "AB+AC", l: a && (b || c), r: (a && b) || (a && c), explain: "A 先串联一个并联网络，等效于把 A 分到两条支路中。" },
    deMorganAnd: { name: "反演律", left: "(A·B)'", right: "A'+B'", l: !(a && b), r: !a || !b, explain: "与的反函数等于各变量取反后作或。" },
    involutionAnd: { name: "还原律", left: "(A')'", right: "A", l: !!a, r: a, explain: "同一个变量连续取反两次，会回到原变量。" },
    oneOr: { name: "0-1律", left: "A+1", right: "1", l: a || true, r: true, explain: "或式中只要并入一条恒为 1 的支路，输出一定为 1。" },
    identityOr: { name: "自等律", left: "A+0", right: "A", l: a || false, r: a, explain: "或式中并入一条恒为 0 的支路，不改变 A。" },
    idempotentOr: { name: "重迭律", left: "A+A", right: "A", l: a || a, r: a, explain: "两条相同 A 支路并联，效果仍等于 A。" },
    compOr: { name: "互补律", left: "A+A'", right: "1", l: a || !a, r: true, explain: "A 与 A' 总有一条为 1，所以并联网络一定接通。" },
    commuteOr: { name: "交换律", left: "A+B", right: "B+A", l: a || b, r: b || a, explain: "并联支路交换上下位置，不改变输出。" },
    assocOr: { name: "结合律", left: "A+(B+C)", right: "(A+B)+C", l: a || (b || c), r: (a || b) || c, explain: "多条并联支路中，先把哪几条看成一组，最终输出相同。" },
    distribOr: { name: "分配律", left: "A+BC", right: "(A+B)(A+C)", l: a || (b && c), r: (a || b) && (a || c), explain: "或对与的分配可看作串并联网络的对偶变换。" },
    deMorganOr: { name: "反演律", left: "(A+B)'", right: "A'·B'", l: !(a || b), r: !a && !b, explain: "或的反函数等于各变量取反后作与。" },
    involutionOr: { name: "还原律", left: "(A')'", right: "A", l: !!a, r: a, explain: "连续两次取反，变量还原为 A。" }
  };
  const lawGroups = {
    and: ["zeroAnd", "identityAnd", "idempotentAnd", "compAnd", "commuteAnd", "assocAnd", "distribAnd", "deMorganAnd", "involutionAnd"],
    or: ["oneOr", "identityOr", "idempotentOr", "compOr", "commuteOr", "assocOr", "distribOr", "deMorganOr", "involutionOr"]
  };
  const activeLaw = laws[law];
  const activeVars = lawVariables(law);
  const rows = uniqueLawTruthRows(law, activeVars);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <CircuitBoard size={20} />
        <div>
          <h3>逻辑代数基础</h3>
          <p>按课件中的基本定律组织为与式、或式两组。拨动变量，观察等效开关电路、逻辑符号和真值表同步变化。</p>
        </div>
      </div>
      <div className="bit-row">
        {activeVars.includes("A") && <Toggle label="A" value={a} setValue={setA} />}
        {activeVars.includes("B") && <Toggle label="B" value={b} setValue={setB} />}
        {activeVars.includes("C") && <Toggle label="C" value={c} setValue={setC} />}
      </div>
      <div className="law-tabs" role="tablist" aria-label="logic law groups">
        <button className={lawTab === "and" ? "active" : ""} onClick={() => { setLawTab("and"); setLaw("zeroAnd"); }}>与式</button>
        <button className={lawTab === "or" ? "active" : ""} onClick={() => { setLawTab("or"); setLaw("oneOr"); }}>或式</button>
      </div>
      <div className="gate-picker law-picker">
        {lawGroups[lawTab].map((key) => (
          <button className={law === key ? "active" : ""} key={key} onClick={() => setLaw(key)}>{laws[key].name}</button>
        ))}
      </div>
      <div className="law-formula-strip">
        <span>公式</span>
        <strong>{activeLaw.left} = {activeLaw.right}</strong>
        <b>F={bit(activeLaw.l)}</b>
      </div>
      <div className="law-explain">
        <strong>为什么成立</strong>
        <p>{activeLaw.explain}</p>
      </div>
      <div className="law-workbench">
        <div className="switch-circuit">
          <span>等效开关电路</span>
          <LawEquivalentCircuit law={law} a={a} b={b} c={c} output={activeLaw.l} />
        </div>
        <div className="logic-symbol">
          <span>逻辑符号</span>
          <LawSymbolDiagram law={law} activeLaw={activeLaw} a={a} b={b} c={c} output={activeLaw.l} />
          <strong>{activeLaw.left} = {activeLaw.right}</strong>
        </div>
        <table className="truth law-truth">
          <thead>
            <tr>{activeVars.map((name) => <th key={name}>{name}</th>)}<th>F</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={isActiveLawRow(row, activeVars, { a, b, c }) ? "selected" : ""} key={`${row.a}${row.b}${row.c}`}>
                {activeVars.includes("A") && <td>{row.a}</td>}
                {activeVars.includes("B") && <td>{row.b}</td>}
                {activeVars.includes("C") && <td>{row.c}</td>}
                <td>{row.f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LawSymbolDiagram({ law, activeLaw, a, b, c, output }) {
  const [in1, in2, gate, simplified] = lawSymbolModel(law, a, b, c, activeLaw);
  const hasBubble = gate === "NAND" || gate === "NOR";
  const isOrShape = gate === "OR" || gate === "NOR";
  const gateShape = gate === "BUF"
    ? "M158 56 L158 134 L224 95 Z"
    : isOrShape
      ? "M150 50 C178 50 204 66 226 95 C204 124 178 140 150 140 C164 110 164 80 150 50 Z"
      : "M150 50 H186 C218 50 236 68 236 95 C236 122 218 140 186 140 H150 Z";
  return (
    <svg className="law-symbol-svg" viewBox="0 0 440 190" role="img" aria-label={`${activeLaw.left} equals ${activeLaw.right}`}>
      <text x="28" y="28">公式门级结构</text>
      <path className={in1.value ? "symbol-wire on" : "symbol-wire"} d="M34 72 H150" />
      {gate !== "BUF" && <path className={in2.value ? "symbol-wire on" : "symbol-wire"} d="M34 118 H150" />}
      <text x="40" y="62">{in1.label}={bit(in1.value)}</text>
      {gate !== "BUF" && <text x="40" y="142">{in2.label}={bit(in2.value)}</text>}
      <path className="gate-shape" d={gateShape} />
      <text x={gate === "BUF" ? "174" : "174"} y="101">{gate === "BUF" ? "NOT" : gate}</text>
      {hasBubble && <circle className="gate-bubble" cx="244" cy="95" r="6" />}
      <path className={output ? "symbol-wire on" : "symbol-wire"} d={`M${hasBubble ? 250 : 236} 95 H286`} />
      <text x="286" y="101">= {simplified}</text>
      <circle className={output ? "bulb on" : "bulb"} cx="398" cy="96" r="22" />
      <path className="bulb-mark" d="M384 82 L412 110 M412 82 L384 110" />
      <text x="392" y="102">{bit(output)}</text>
    </svg>
  );
}

function lawSymbolModel(law, a, b, c, activeLaw) {
  const models = {
    zeroAnd: [{ label: "A", value: a }, { label: "0", value: false }, "AND", "0"],
    identityAnd: [{ label: "A", value: a }, { label: "1", value: true }, "AND", "A"],
    idempotentAnd: [{ label: "A", value: a }, { label: "A", value: a }, "AND", "A"],
    compAnd: [{ label: "A", value: a }, { label: "A'", value: !a }, "AND", "0"],
    commuteAnd: [{ label: "A", value: a }, { label: "B", value: b }, "AND", "B·A"],
    assocAnd: [{ label: "A", value: a }, { label: "BC", value: b && c }, "AND", "(AB)C"],
    distribAnd: [{ label: "A", value: a }, { label: "B+C", value: b || c }, "AND", "AB+AC"],
    deMorganAnd: [{ label: "A", value: a }, { label: "B", value: b }, "NAND", "A'+B'"],
    involutionAnd: [{ label: "A'", value: !a }, { label: "NOT", value: a }, "BUF", "A"],
    oneOr: [{ label: "A", value: a }, { label: "1", value: true }, "OR", "1"],
    identityOr: [{ label: "A", value: a }, { label: "0", value: false }, "OR", "A"],
    idempotentOr: [{ label: "A", value: a }, { label: "A", value: a }, "OR", "A"],
    compOr: [{ label: "A", value: a }, { label: "A'", value: !a }, "OR", "1"],
    commuteOr: [{ label: "A", value: a }, { label: "B", value: b }, "OR", "B+A"],
    assocOr: [{ label: "A", value: a }, { label: "B+C", value: b || c }, "OR", "(A+B)+C"],
    distribOr: [{ label: "A", value: a }, { label: "BC", value: b && c }, "OR", "(A+B)(A+C)"],
    deMorganOr: [{ label: "A", value: a }, { label: "B", value: b }, "NOR", "A'·B'"],
    involutionOr: [{ label: "A'", value: !a }, { label: "NOT", value: a }, "BUF", "A"]
  };
  return models[law] || [{ label: activeLaw.left, value: activeLaw.l }, { label: activeLaw.right, value: activeLaw.r }, "OR", activeLaw.right];
}

function LawEquivalentCircuit({ law, a, b, c, output }) {
  const lanes = lawSwitchLanes(law).map((lane) => lane.map((name) => ({ name, closed: switchValue(name, { a, b, c }) })));
  const laneYs = lanes.length === 1 ? [112] : lanes.map((_, index) => 62 + index * Math.min(58, 118 / Math.max(1, lanes.length - 1)));
  const busTop = Math.min(...laneYs);
  const busBottom = Math.max(...laneYs);
  const leftBusTop = Math.min(busTop, 112);
  const leftBusBottom = Math.max(busBottom, 112);
  const rightBusTop = Math.min(busTop, 112);
  const rightBusBottom = Math.max(busBottom, 112);
  return (
    <svg className="law-circuit-svg" viewBox="0 0 560 250" role="img" aria-label="law equivalent switch network">
      <path className="wire-path" d="M58 112 V212 H452 V156" />
      <path className="battery" d="M45 160 H72 M52 178 H65" />
      <text x="22" y="173">E</text>
      <path className="wire-path" d={`M58 112 H100 M100 ${leftBusTop} V${leftBusBottom} M386 ${rightBusTop} V${rightBusBottom} M386 112 H428`} />
      <circle className={output ? "bulb on" : "bulb"} cx="452" cy="132" r="24" />
      <path className="bulb-mark" d="M436 116 L468 148 M468 116 L436 148" />
      <text x="486" y="139">F={bit(output)}</text>
      {lanes.map((lane, laneIndex) => {
        const y = laneYs[laneIndex];
        const startX = 132;
        const gap = lane.length > 2 ? 72 : 102;
        const connectors = lane.slice(1).map((_, index) => {
          const x1 = startX + index * gap + 58;
          const x2 = startX + (index + 1) * gap;
          return `M${x1} ${y} H${x2}`;
        }).join(" ");
        const lastEnd = startX + (lane.length - 1) * gap + 58;
        return (
          <g key={`${lane.map((item) => item.name).join("")}-${laneIndex}`}>
            <path className="wire-path" d={`M100 ${y} H${startX} ${connectors} M${lastEnd} ${y} H386`} />
            {lane.map((item, index) => (
              <LawSwitchBlade
                key={`${item.name}-${index}`}
                x={startX + index * gap}
                y={y}
                closed={item.closed}
                label={`${item.name}=${bit(item.closed)}`}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function LawSwitchBlade({ x, y, closed, label }) {
  return (
    <g className="law-switch">
      <circle className={closed ? "switch-node on" : "switch-node"} cx={x} cy={y} r="4.5" />
      <circle className={closed ? "switch-node on" : "switch-node"} cx={x + 58} cy={y} r="4.5" />
      <line className={closed ? "switch-blade closed" : "switch-blade"} x1={x} y1={y} x2={closed ? x + 58 : x + 44} y2={closed ? y : y - 26} />
      <rect className="switch-label-bg" x={x + 5} y={y - 46} width={Math.max(48, label.length * 11)} height="20" rx="4" />
      <text x={x + 10} y={y - 31}>{label}</text>
    </g>
  );
}

function lawSwitchLanes(law) {
  const lanesByLaw = {
    zeroAnd: [["A", "0"]],
    identityAnd: [["A", "1"]],
    idempotentAnd: [["A", "A"]],
    compAnd: [["A", "A'"]],
    commuteAnd: [["A", "B"]],
    assocAnd: [["A", "B", "C"]],
    distribAnd: [["A", "B"], ["A", "C"]],
    deMorganAnd: [["A'"], ["B'"]],
    involutionAnd: [["A"]],
    oneOr: [["A"], ["1"]],
    identityOr: [["A"], ["0"]],
    idempotentOr: [["A"], ["A"]],
    compOr: [["A"], ["A'"]],
    commuteOr: [["A"], ["B"]],
    assocOr: [["A"], ["B"], ["C"]],
    distribOr: [["A"], ["B", "C"]],
    deMorganOr: [["A'", "B'"]],
    involutionOr: [["A"]]
  };
  return lanesByLaw[law] || [["A"]];
}

function switchValue(name, values) {
  const table = {
    A: values.a,
    B: values.b,
    C: values.c,
    "A'": !values.a,
    "B'": !values.b,
    "C'": !values.c,
    0: false,
    1: true
  };
  return Boolean(table[name]);
}

function lawTruthRows(law) {
  return [0, 1].flatMap((a) => [0, 1].flatMap((b) => [0, 1].map((c) => {
    const A = !!a, B = !!b, C = !!c;
    const evals = {
      zeroAnd: [A && false, false],
      identityAnd: [A && true, A],
      idempotentAnd: [A && A, A],
      compAnd: [A && !A, false],
      commuteAnd: [A && B, B && A],
      assocAnd: [A && (B && C), (A && B) && C],
      distribAnd: [A && (B || C), (A && B) || (A && C)],
      deMorganAnd: [!(A && B), !A || !B],
      involutionAnd: [!!A, A],
      oneOr: [A || true, true],
      identityOr: [A || false, A],
      idempotentOr: [A || A, A],
      compOr: [A || !A, true],
      commuteOr: [A || B, B || A],
      assocOr: [A || (B || C), (A || B) || C],
      distribOr: [A || (B && C), (A || B) && (A || C)],
      deMorganOr: [!(A || B), !A && !B],
      involutionOr: [!!A, A]
    };
    const [l, r] = evals[law];
    return { a, b, c, f: bit(l), check: bit(r) };
  })));
}

function uniqueLawTruthRows(law, vars) {
  const seen = new Set();
  return lawTruthRows(law).filter((row) => {
    const key = vars.map((name) => row[name.toLowerCase()]).join("");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isActiveLawRow(row, vars, values) {
  return vars.every((name) => row[name.toLowerCase()] === bit(values[name.toLowerCase()]));
}

function lawVariables(law) {
  const vars = {
    zeroAnd: ["A"],
    identityAnd: ["A"],
    idempotentAnd: ["A"],
    compAnd: ["A"],
    commuteAnd: ["A", "B"],
    assocAnd: ["A", "B", "C"],
    distribAnd: ["A", "B", "C"],
    deMorganAnd: ["A", "B"],
    involutionAnd: ["A"],
    oneOr: ["A"],
    identityOr: ["A"],
    idempotentOr: ["A"],
    compOr: ["A"],
    commuteOr: ["A", "B"],
    assocOr: ["A", "B", "C"],
    distribOr: ["A", "B", "C"],
    deMorganOr: ["A", "B"],
    involutionOr: ["A"]
  };
  return vars[law] || ["A"];
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

function SemiconductorSwitchLab() {
  const [device, setDevice] = useState("bjt");
  const [drive, setDrive] = useState(0.8);
  const devices = {
    diode: {
      name: "二极管",
      control: "正向电压",
      unit: "V",
      min: 0,
      max: 1.2,
      step: 0.05,
      threshold: 0.7,
      onText: "正向导通，等效闭合开关",
      offText: "未达到导通压降，等效断开开关"
    },
    bjt: {
      name: "三极管",
      control: "基极电压",
      unit: "V",
      min: 0,
      max: 1.2,
      step: 0.05,
      threshold: 0.7,
      onText: "饱和导通，集电极被拉到低电平",
      offText: "截止，集电极由上拉电阻保持高电平"
    },
    mos: {
      name: "MOS 管",
      control: "栅极电压",
      unit: "V",
      min: 0,
      max: 5,
      step: 0.1,
      threshold: 2.5,
      onText: "沟道形成，漏源近似接通",
      offText: "沟道未形成，漏源近似断开"
    }
  };
  const current = devices[device];
  const on = drive >= current.threshold;
  const outputHigh = device === "diode" ? on : !on;

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <CircuitBoard size={20} />
        <div>
          <h3>半导体器件的开关特性</h3>
          <p>拖动输入激励，观察二极管、三极管、MOS 管何时从“断开”变成“闭合”，并看到输出电平如何变化。</p>
        </div>
      </div>
      <div className="segmented three">
        {Object.entries(devices).map(([key, item]) => (
          <button
            className={device === key ? "active" : ""}
            key={key}
            onClick={() => {
              setDevice(key);
              setDrive(item.threshold);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <Slider label={current.control} unit={current.unit} value={drive} min={current.min} max={current.max} step={current.step} setValue={setDrive} />
      <div className="device-lab-grid">
        <DeviceSwitchSvg device={device} drive={drive} threshold={current.threshold} on={on} outputHigh={outputHigh} />
        <div className="device-readout">
          <RadixCard label="阈值" value={`${current.threshold}${current.unit}`} />
          <RadixCard label="开关状态" value={on ? "ON" : "OFF"} active={on} />
          <RadixCard label="输出电平" value={outputHigh ? "1 / 高电平" : "0 / 低电平"} active={outputHigh} />
          <p>{on ? current.onText : current.offText}</p>
        </div>
      </div>
    </div>
  );
}

function DeviceSwitchSvg({ device, drive, threshold, on, outputHigh }) {
  const controlLabel = device === "diode" ? "Vin" : device === "bjt" ? "VB" : "VG";
  return (
    <svg className="device-switch-svg" viewBox="0 0 680 280" role="img" aria-label="semiconductor switch circuit">
      <path className={on ? "device-wire on" : "device-wire"} d="M92 84 H210 M318 84 H438" />
      <path className={outputHigh ? "device-wire on" : "device-wire"} d="M438 84 H572" />
      <path className="device-wire" d="M438 84 V182 M438 216 V238 H92 V84" />
      <path className="device-resistor" d="M438 84 l-10 12 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-10 12" />
      <text x="456" y="142">上拉电阻</text>
      <circle className={outputHigh ? "device-lamp on" : "device-lamp"} cx="598" cy="84" r="24" />
      <text x="588" y="91">{bit(outputHigh)}</text>
      <path className="battery" d="M76 144 H106 M84 160 H98" />
      <text x="50" y="154">VCC</text>
      <path className={on ? "device-wire on" : "device-wire"} d="M438 182 H438" />
      {device === "diode" && (
        <g>
          <path className={on ? "device-symbol on" : "device-symbol"} d="M210 54 L270 84 L210 114 Z M270 54 V114" />
          <text x="212" y="142">二极管</text>
        </g>
      )}
      {device === "bjt" && (
        <g>
          <circle className={on ? "device-symbol on" : "device-symbol"} cx="264" cy="104" r="44" />
          <path className={on ? "device-symbol on" : "device-symbol"} d="M264 60 V84 M264 124 V160 M220 104 H264 M264 84 L316 84 M264 124 L316 156" />
          <path className={on ? "device-symbol on" : "device-symbol"} d="M302 148 l14 8 l-14 8" />
          <text x="216" y="182">NPN 三极管</text>
        </g>
      )}
      {device === "mos" && (
        <g>
          <path className={on ? "device-symbol on" : "device-symbol"} d="M258 52 V158 M294 52 V158 M294 84 H338 M294 126 H338 M222 105 H258" />
          <text x="226" y="184">NMOS</text>
        </g>
      )}
      <path className={on ? "device-wire on" : "device-wire"} d="M318 84 H438" />
      <path className={on ? "device-wire on" : "device-wire"} d="M438 182 V238" />
      <g className="drive-meter">
        <rect x="72" y="204" width="214" height="18" rx="9" />
        <rect className={on ? "on" : ""} x="72" y="204" width={Math.max(0, Math.min(214, drive / threshold / 1.5 * 214))} height="18" rx="9" />
        <text x="72" y="250">{controlLabel}={drive.toFixed(2)}V</text>
        <text x="210" y="250">阈值 {threshold}V</text>
      </g>
    </svg>
  );
}

function LogicFamilyLab() {
  const [family, setFamily] = useState("CMOS");
  const [frequency, setFrequency] = useState(5);
  const [load, setLoad] = useState(20);
  const data = {
    TTL: { vcc: 5, vih: 2.0, vil: 0.8, delay: 10, staticPower: 10, input: "输入阻抗较低，驱动电流要求更明显", strength: "速度稳定，传统 74 系列应用广" },
    CMOS: { vcc: 5, vih: 3.5, vil: 1.5, delay: 25, staticPower: 0.02, input: "输入阻抗高，静态功耗很低", strength: "抗干扰能力强，适合高集成度低功耗电路" }
  };
  const current = data[family];
  const dynamicPower = family === "CMOS" ? (load * frequency * 0.025).toFixed(2) : (current.staticPower + frequency * 0.12).toFixed(2);
  const delay = Math.round(current.delay * (1 + load / 80));

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Cpu size={20} />
        <div>
          <h3>TTL 与 CMOS 门电路特性对比</h3>
          <p>切换逻辑系列，调节负载电容和工作频率，观察功耗、延时、输入阈值这些电气特性如何改变。</p>
        </div>
      </div>
      <div className="segmented two">
        {["TTL", "CMOS"].map((name) => (
          <button className={family === name ? "active" : ""} key={name} onClick={() => setFamily(name)}>{name}</button>
        ))}
      </div>
      <div className="family-controls">
        <Slider label="工作频率" unit="MHz" value={frequency} min={1} max={30} setValue={setFrequency} />
        <Slider label="负载电容" unit="pF" value={load} min={5} max={100} setValue={setLoad} />
      </div>
      <div className="family-grid">
        <RadixCard label="供电电压" value={`${current.vcc} V`} />
        <RadixCard label="输入低电平上限 VIL" value={`${current.vil} V`} />
        <RadixCard label="输入高电平下限 VIH" value={`${current.vih} V`} />
        <RadixCard label="估算功耗" value={`${dynamicPower} mW`} />
        <RadixCard label="估算传播延时" value={`${delay} ns`} />
        <RadixCard label="课堂关键词" value={family === "TTL" ? "电流驱动" : "电压驱动"} />
      </div>
      <div className="family-note">
        <strong>{current.strength}</strong>
        <p>{current.input}；负载越大、频率越高，输出翻转越吃力。</p>
      </div>
    </div>
  );
}

function NoiseMarginLab() {
  const [family, setFamily] = useState("TTL");
  const [vin, setVin] = useState(2.3);
  const [noise, setNoise] = useState(0.4);
  const spec = {
    TTL: { vil: 0.8, vih: 2.0 },
    CMOS: { vil: 1.5, vih: 3.5 }
  }[family];
  const disturbed = Math.max(0, Math.min(5, vin + noise));
  const level = disturbed <= spec.vil ? "0" : disturbed >= spec.vih ? "1" : "X";
  const distance = level === "0" ? spec.vil - disturbed : level === "1" ? disturbed - spec.vih : Math.min(disturbed - spec.vil, spec.vih - disturbed);

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Gauge size={20} />
        <div>
          <h3>输入电平与噪声容限演示</h3>
          <p>给输入端叠加噪声，观察信号是否仍能被门电路可靠识别。中间灰区就是课堂上容易误判的“不确定区”。</p>
        </div>
      </div>
      <div className="segmented two">
        {["TTL", "CMOS"].map((name) => (
          <button className={family === name ? "active" : ""} key={name} onClick={() => setFamily(name)}>{name}</button>
        ))}
      </div>
      <div className="family-controls">
        <Slider label="原始输入 Vin" unit="V" value={vin} min={0} max={5} step={0.1} setValue={setVin} />
        <Slider label="叠加噪声" unit="V" value={noise} min={-2} max={2} step={0.1} setValue={setNoise} />
      </div>
      <div className="noise-grid">
        <VoltageRail vil={spec.vil} vih={spec.vih} vin={vin} disturbed={disturbed} />
        <div className={`noise-result ${level === "X" ? "danger" : "ok"}`}>
          <span>门电路看到的输入</span>
          <strong>{level}</strong>
          <p>{level === "X" ? "落入不确定区，后级可能随机识别为 0 或 1。" : `距离阈值约 ${Math.abs(distance).toFixed(2)} V，仍可可靠识别。`}</p>
        </div>
      </div>
    </div>
  );
}

function VoltageRail({ vil, vih, vin, disturbed }) {
  const clampPercent = (value) => `${Math.max(0, Math.min(100, (value / 5) * 100))}%`;
  return (
    <div className="voltage-rail">
      <div className="rail-track">
        <i className="low-zone" style={{ width: clampPercent(vil) }} />
        <i className="mid-zone" style={{ left: clampPercent(vil), width: `${((vih - vil) / 5) * 100}%` }} />
        <i className="high-zone" style={{ left: clampPercent(vih), width: `${((5 - vih) / 5) * 100}%` }} />
        <b className="vin-mark" style={{ left: clampPercent(vin) }}>Vin</b>
        <b className="noise-mark" style={{ left: clampPercent(disturbed) }}>Vin+噪声</b>
      </div>
      <div className="rail-labels">
        <span>0V</span>
        <span>VIL={vil}V</span>
        <span>VIH={vih}V</span>
        <span>5V</span>
      </div>
    </div>
  );
}

function GateDelayLab() {
  const [stages, setStages] = useState(3);
  const [delay, setDelay] = useState(12);
  const total = stages * delay;
  const rows = Array.from({ length: stages + 1 }, (_, row) => ({
    label: row === 0 ? "IN" : `G${row}`,
    values: Array.from({ length: 18 }, (_, col) => ((col - row) % 6 + 6) % 6 < 3 ? 1 : 0),
    active: row === stages
  }));

  return (
    <div className="lab-panel simulation-panel">
      <div className="panel-title">
        <Clock3 size={20} />
        <div>
          <h3>门电路传播延时观察</h3>
          <p>把多个门串联起来，输入跳变不会瞬间到达输出。拖动级数和单级延时，观察总延时如何累积。</p>
        </div>
      </div>
      <div className="family-controls">
        <Slider label="串联门级数" unit="级" value={stages} min={1} max={8} setValue={setStages} />
        <Slider label="单级传播延时" unit="ns" value={delay} min={2} max={40} setValue={setDelay} />
      </div>
      <div className="delay-chain">
        {Array.from({ length: stages }, (_, index) => (
          <React.Fragment key={index}>
            <div className="delay-gate">G{index + 1}<span>{delay}ns</span></div>
            {index < stages - 1 && <i />}
          </React.Fragment>
        ))}
      </div>
      <div className="oscilloscope wide-scope">
        <div>
          <span>延时波形</span>
          <strong>总传播延时约 {total} ns，级数越多输出边沿越晚出现。</strong>
        </div>
        <WaveformSvg rows={rows} />
      </div>
    </div>
  );
}

function GateLab() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const out = gateFns[gate](a, b);
  const rows = gate === "NOT"
    ? [[0, bit(gateFns[gate](false))], [1, bit(gateFns[gate](true))]]
    : [0, 1].flatMap((x) => [0, 1].map((y) => [x, y, bit(gateFns[gate](!!x, !!y))]));

  return (
    <div className="lab-panel simulation-panel">
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
          {gate !== "NOT" && <Toggle label="B" value={b} setValue={setB} />}
        </div>
        <div className="gate-svg" data-hot={out ? "1" : "0"}>
          <div className={`wire ${a ? "on" : ""}`}>A={bit(a)}</div>
          <div className="gate-body">{gate}</div>
          {gate !== "NOT" ? <div className={`wire ${b ? "on" : ""}`}>B={bit(b)}</div> : <div className="wire ghost-wire">取反</div>}
          <div className={`lamp ${out ? "on" : ""}`}>{bit(out)}</div>
        </div>
        <table className="truth">
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
