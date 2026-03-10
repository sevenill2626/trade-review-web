const $ = (id) => document.getElementById(id);

const scoreEl = $("score");
const statusEl = $("status");
const shotInput = $("shot");
const shotPreview = $("shotPreview");

let currentScore = 3;
let currentShot = "";

const storageKey = "tradeReviewRecords";

const buildScoreButtons = () => {
  scoreEl.innerHTML = "";
  for (let i = 1; i <= 5; i += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(i);
    if (i === currentScore) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentScore = i;
      updateScoreUI();
    });
    scoreEl.appendChild(btn);
  }
};

const updateScoreUI = () => {
  [...scoreEl.children].forEach((btn) => {
    btn.classList.toggle("active", Number(btn.textContent) === currentScore);
  });
};

const readImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

const loadRecords = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch (err) {
    return [];
  }
};

const saveRecords = (records) => {
  localStorage.setItem(storageKey, JSON.stringify(records));
};

const renderRecords = () => {
  const list = $("recordList");
  const records = loadRecords();
  list.innerHTML = "";

  if (!records.length) {
    list.innerHTML = "<div class=\"record\"><small>暂无记录。</small></div>";
    return;
  }

  records.slice(0, 6).forEach((record) => {
    const item = document.createElement("div");
    item.className = "record";
    item.innerHTML = `
      <h3>${record.symbol || "未命名"} (${record.tradeType})</h3>
      <small>${record.tradeDate || "未填日期"} ${record.tradeTime || ""}</small>
      <div>方向: ${record.direction} · 盈亏: ${record.pl || "0"} · R: ${
      record.rr || "-"
    }</div>
      <small>评分: ${record.score} · 执行质量: ${record.quality}</small>
    `;
    list.appendChild(item);
  });
};

const setStatus = (text) => {
  statusEl.textContent = text;
  setTimeout(() => {
    if (statusEl.textContent === text) statusEl.textContent = "";
  }, 2500);
};

shotInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  currentShot = await readImage(file);
  shotPreview.innerHTML = `<img src="${currentShot}" alt="交易截图" />`;
});

$("saveRecord").addEventListener("click", () => {
  const record = {
    id: Date.now(),
    tradeType: $("tradeType").value,
    symbol: $("symbol").value.trim(),
    direction: $("direction").value,
    entryType: $("entryType").value,
    tradeDate: $("tradeDate").value,
    tradeTime: $("tradeTime").value,
    entryReason: $("entryReason").value.trim(),
    plan: $("plan").value.trim(),
    execution: $("execution").value.trim(),
    summary: $("summary").value.trim(),
    pl: $("pl").value,
    rr: $("rr").value,
    quality: $("quality").value,
    emotion: $("emotion").value,
    score: currentScore,
    shot: currentShot,
  };

  const records = loadRecords();
  records.unshift(record);
  saveRecords(records);
  renderRecords();
  setStatus("已保存到本地。");
});

$("clearAll").addEventListener("click", () => {
  const ok = window.confirm("确认清空所有记录吗？此操作不可恢复。");
  if (!ok) return;
  saveRecords([]);
  renderRecords();
  setStatus("已清空全部记录。");
});

$("exportJson").addEventListener("click", () => {
  const records = loadRecords();
  const blob = new Blob([JSON.stringify(records, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `trade-review-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

$("addExample").addEventListener("click", () => {
  $("tradeType").value = "Breakout";
  $("symbol").value = "MES";
  $("direction").value = "做多";
  $("entryType").value = "回踩确认";
  $("tradeDate").value = "2026-03-10";
  $("tradeTime").value = "09:45";
  $("entryReason").value = "趋势结构清晰，关键位放量确认。";
  $("plan").value = "回踩入场，结构下方止损，目标 2R。";
  $("execution").value = "成交顺畅，1.5R 处减仓。";
  $("summary").value = "耐心等待入场，出场可再优化。";
  $("pl").value = "125";
  $("rr").value = "1.8";
  $("quality").value = "良好";
  $("emotion").value = "专注";
  currentScore = 4;
  updateScoreUI();
  setStatus("已填充示例。");
});

buildScoreButtons();
renderRecords();
