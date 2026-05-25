"use strict";

// app.js
// 진입점 — 이벤트 바인딩 및 타이머 상태 관리
// 직접 계산/저장하지 않고 timer.js / storage.js를 호출하는 역할만 함

// 타이머 상태
let timerIntervalId = null;
let elapsedSeconds = 0;
let sessionStartTime = null;
let isRunning = false;

// =====================
// 초기화
// =====================

const initializeApp = () => {
  renderTodayDate();
  renderRecordSummary();
  renderSessionList();
  bindEvents();
};

// =====================
// 이벤트 바인딩
// =====================

const bindEvents = () => {
  document.getElementById("start-btn").addEventListener("click", handleStart);
  document.getElementById("stop-btn").addEventListener("click", handleStop);
  document.getElementById("reset-btn").addEventListener("click", handleReset);
};

// =====================
// 핸들러
// =====================

const handleStart = () => {
  if (isRunning) return;

  isRunning = true;
  sessionStartTime = new Date();

  // 매 초마다 타이머 업데이트
  timerIntervalId = setInterval(() => {
    elapsedSeconds += 1;
    renderTimerDisplay();
    renderWarning();
  }, 1000);

  updateButtonState();
  document.getElementById("timer-status").textContent = "앉아 있는 중...";
};

const handleStop = () => {
  if (!isRunning) return;

  clearInterval(timerIntervalId);
  isRunning = false;

  // 세션 저장 (1초 이상일 때만)
  if (elapsedSeconds > 0) {
    saveSession({
      startTime: formatTimeToHHMM(sessionStartTime),
      endTime: formatTimeToHHMM(new Date()),
      durationSeconds: elapsedSeconds,
    });
  }

  elapsedSeconds = 0;
  sessionStartTime = null;

  renderTimerDisplay();
  renderWarning();
  renderRecordSummary();
  renderSessionList();
  updateButtonState();
  document.getElementById("timer-status").textContent =
    "정지됨 — 다시 시작하려면 시작 버튼을 누르세요";
};

const handleReset = () => {
  clearInterval(timerIntervalId);
  isRunning = false;
  elapsedSeconds = 0;
  sessionStartTime = null;

  renderTimerDisplay();
  renderWarning();
  updateButtonState();
  document.getElementById("timer-status").textContent =
    "앉기 전에 시작 버튼을 눌러주세요";
};

// =====================
// 렌더링
// =====================

// 오늘 날짜 표시
const renderTodayDate = () => {
  const now = new Date();
  const dateString = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  document.getElementById("today-date").textContent = dateString;
};

// 타이머 숫자 업데이트
const renderTimerDisplay = () => {
  const { minutes, seconds } = formatSecondsToDisplay(elapsedSeconds);
  document.getElementById("timer-minutes").textContent = minutes;
  document.getElementById("timer-seconds").textContent = seconds;
};

// 30분 경고 배너 토글
const renderWarning = () => {
  const warningSection = document.getElementById("warning-section");
  if (isOverWarningThreshold(elapsedSeconds)) {
    warningSection.classList.remove("hidden");
  } else {
    warningSection.classList.add("hidden");
  }
};

// 요약 정보 업데이트
const renderRecordSummary = () => {
  const totalSeconds = loadTotalSecondsToday();
  const sessionCount = loadAllSessions().length;

  document.getElementById("total-time").textContent =
    formatSecondsToReadable(totalSeconds);
  document.getElementById("session-count").textContent = `${sessionCount}회`;
};

// 세션 목록 렌더링
const renderSessionList = () => {
  const sessionList = document.getElementById("session-list");
  const allSessions = loadAllSessions();

  sessionList.innerHTML = "";

  if (allSessions.length === 0) {
    sessionList.innerHTML = `<li class="empty-message">아직 기록이 없어요</li>`;
    return;
  }

  // 최신 세션이 위로
  [...allSessions].reverse().forEach((session) => {
    const listItem = document.createElement("li");
    listItem.classList.add("session-item");
    listItem.innerHTML = `
      <span class="session-time">${session.startTime} ~ ${session.endTime}</span>
      <span class="session-duration">${formatSecondsToReadable(session.durationSeconds)}</span>
    `;
    sessionList.appendChild(listItem);
  });
};

// 버튼 상태 업데이트
const updateButtonState = () => {
  const startButton = document.getElementById("start-btn");
  const stopButton = document.getElementById("stop-btn");
  const resetButton = document.getElementById("reset-btn");

  startButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
  resetButton.disabled = isRunning;
};

// =====================
// 앱 시작
// =====================

initializeApp();
