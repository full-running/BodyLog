"use strict";

// storage.js
// SitGuard 세션 기록 LocalStorage 전담 모듈
// 날짜가 바뀌면 자동으로 초기화

const SIT_STORAGE_KEY = {
  SESSIONS: "sitguard_sessions",
  DATE: "sitguard_date",
};

// 오늘 날짜 문자열 반환 "YYYY-MM-DD"
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 날짜가 바뀌었으면 세션 초기화
const resetIfNewDay = () => {
  const storedDate = localStorage.getItem(SIT_STORAGE_KEY.DATE);
  const todayString = getTodayString();
  if (storedDate !== todayString) {
    localStorage.setItem(SIT_STORAGE_KEY.DATE, todayString);
    localStorage.setItem(SIT_STORAGE_KEY.SESSIONS, JSON.stringify([]));
  }
};

// 세션 전체 불러오기
const loadAllSessions = () => {
  resetIfNewDay();
  const storedSessions = localStorage.getItem(SIT_STORAGE_KEY.SESSIONS);
  return storedSessions ? JSON.parse(storedSessions) : [];
};

// 세션 추가 저장
// session: { startTime, endTime, durationSeconds }
const saveSession = (session) => {
  const existingSessions = loadAllSessions();
  existingSessions.push(session);
  localStorage.setItem(
    SIT_STORAGE_KEY.SESSIONS,
    JSON.stringify(existingSessions),
  );
};

// 오늘 총 앉은 시간 (초 단위)
const loadTotalSecondsToday = () => {
  return loadAllSessions().reduce(
    (total, session) => total + session.durationSeconds,
    0,
  );
};
