"use strict";

// storage.js
// LocalStorage / Cookie / Session 저장 전담 모듈
// 다른 파일에서 직접 저장소를 건드리지 않고 이 파일을 통해서만 접근

// 키 상수를 한 곳에서 관리 — 오타로 인한 버그 방지
const STORAGE_KEY = {
  USER_INFO: "weightlog_user_info",
  RECORDS: "weightlog_records",
};

// 쿠키 만료일 — 365일
const COOKIE_EXPIRE_DAYS = 365;

// =====================
// 쿠키 기반 userInfo
// =====================

// 쿠키에 기본정보 저장 (365일 유지)
const saveUserInfoToCookie = (userInfo) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRE_DAYS);
  document.cookie = `${STORAGE_KEY.USER_INFO}=${JSON.stringify(userInfo)};expires=${expiryDate.toUTCString()};path=/`;
};

// 쿠키에서 기본정보 불러오기
const loadUserInfoFromCookie = () => {
  const cookiePrefix = `${STORAGE_KEY.USER_INFO}=`;
  const targetCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(cookiePrefix));
  if (!targetCookie) return null;
  return JSON.parse(targetCookie.substring(cookiePrefix.length));
};

// =====================
// 세션 기반 userInfo
// =====================

// sessionStorage에 기본정보 저장 (브라우저 닫으면 삭제)
const saveUserInfoToSession = (userInfo) => {
  sessionStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));
};

// sessionStorage에서 기본정보 불러오기
const loadUserInfoFromSession = () => {
  const storedUserInfo = sessionStorage.getItem(STORAGE_KEY.USER_INFO);
  return storedUserInfo ? JSON.parse(storedUserInfo) : null;
};

// =====================
// 저장 방식 통합 — 외부에서는 이 함수만 사용
// =====================

// 동의 방식에 따라 cookie / session 분기
const saveUserInfo = (userInfo, consentType) => {
  if (consentType === "cookie") {
    saveUserInfoToCookie(userInfo);
  } else {
    saveUserInfoToSession(userInfo);
  }
};

// 쿠키 → 세션 순서로 탐색
// 없으면 null 반환 → app.js에서 첫 방문 여부 판단에 사용
const loadUserInfo = () => {
  return loadUserInfoFromCookie() || loadUserInfoFromSession();
};

// =====================
// 체중 기록 — LocalStorage
// =====================

// 없으면 빈 배열 반환 → render.js에서 null 체크 없이 바로 순회 가능
const loadAllRecords = () => {
  const storedRecords = localStorage.getItem(STORAGE_KEY.RECORDS);
  return storedRecords ? JSON.parse(storedRecords) : [];
};

// add / delete / update 모두 이 함수를 통해서 저장 → 저장 로직 단일화
const saveAllRecords = (records) => {
  localStorage.setItem(STORAGE_KEY.RECORDS, JSON.stringify(records));
};

// 체중 기록 추가
const addRecord = (newRecord) => {
  const existingRecords = loadAllRecords();
  existingRecords.push(newRecord);
  saveAllRecords(existingRecords);
};

// 체중 기록 삭제 (id 기준)
const deleteRecord = (targetId) => {
  const filteredRecords = loadAllRecords().filter(
    (record) => record.id !== targetId,
  );
  saveAllRecords(filteredRecords);
};

// 체중 기록 수정 (id 기준)
const updateRecord = (targetId, updatedFields) => {
  const updatedRecords = loadAllRecords().map((record) =>
    record.id === targetId ? { ...record, ...updatedFields } : record,
  );
  saveAllRecords(updatedRecords);
};
