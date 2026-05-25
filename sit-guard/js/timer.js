"use strict";

// timer.js
// 타이머 핵심 로직 전담 모듈
// 경과 시간 계산, 30분 경고 판정, 포맷 변환

const WARNING_THRESHOLD_SECONDS = 30 * 60; // 30분

// 초를 MM:SS 형식으로 변환
const formatSecondsToDisplay = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

// 초를 "X시간 Y분" 형식으로 변환 (기록 표시용)
const formatSecondsToReadable = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  if (minutes > 0) return `${minutes}분`;
  return `${totalSeconds}초`;
};

// 30분 초과 여부 판정
const isOverWarningThreshold = (elapsedSeconds) => {
  return elapsedSeconds >= WARNING_THRESHOLD_SECONDS;
};

// 시작 시각을 "HH:MM" 형식으로 반환
const formatTimeToHHMM = (dateObject) => {
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
