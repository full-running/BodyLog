"use strict";

// app.js
// 진입점 — 이벤트 바인딩 및 앱 초기화 담당
// 직접 계산/저장/렌더링하지 않고 각 모듈 함수를 호출하는 역할만 함

// 수정 중인 기록의 id를 임시 보관
// null이면 새 기록 추가, 값이 있으면 수정 모드
let currentEditingId = null;

// 초기 시드 데이터 — 실제 기록 기반
// 기록이 없을 때만 주입 (기존 데이터 덮어쓰기 방지)
const seedInitialData = () => {
  if (loadAllRecords().length > 0) return;

  // 기본정보 세팅 (쿠키에 저장)
  saveUserInfo({ gender: "male", heightCm: 179.8 }, "cookie");

  // 실제 체중 기록 주입
  const seedRecords = [
    { id: "1", date: "2026-04-11", weight: 82.7 },
    { id: "2", date: "2026-04-12", weight: 82.3 },
    { id: "3", date: "2026-04-14", weight: 82.6 },
    { id: "4", date: "2026-04-16", weight: 81.8 },
    { id: "5", date: "2026-04-21", weight: 82.1 },
    { id: "6", date: "2026-04-22", weight: 81.4 },
    { id: "7", date: "2026-04-24", weight: 80.9 },
    { id: "8", date: "2026-04-25", weight: 80.2 },
    { id: "9", date: "2026-04-29", weight: 79.6 },
    { id: "10", date: "2026-05-02", weight: 79.2 },
    { id: "11", date: "2026-05-05", weight: 80.7 },
  ];

  saveAllRecords(seedRecords);
};

// =====================
// 초기화
// =====================

const initializeApp = () => {
  seedInitialData(); // 추가
  const userInfo = loadUserInfo();

  if (userInfo === null) {
    showSetupSection();
  } else {
    showMainSection();
    renderRecordList(loadAllRecords(), userInfo.heightCm);
  }

  document.getElementById("date-input").value = getTodayDateString();
  bindEvents();
};

// =====================
// 이벤트 바인딩
// =====================

const bindEvents = () => {
  document
    .getElementById("setup-save-btn")
    .addEventListener("click", handleSetupSave);
  document
    .getElementById("weight-save-btn")
    .addEventListener("click", handleWeightSave);
  document
    .getElementById("weight-list")
    .addEventListener("click", handleRecordAction);
};

// =====================
// 핸들러
// =====================

// 기본정보 저장 — 동의 방식에 따라 cookie / session 분기
const handleSetupSave = () => {
  const selectedGender = document.querySelector("input[name='gender']:checked");
  const heightInput = document.getElementById("height-input").value;
  const selectedConsent = document.querySelector(
    "input[name='consent']:checked",
  );

  if (selectedGender === null) {
    alert("성별을 선택해주세요.");
    return;
  }

  if (!isValidHeight(heightInput)) {
    alert("키를 올바르게 입력해주세요. (100cm ~ 250cm)");
    return;
  }

  if (selectedConsent === null) {
    alert("정보 저장 방식을 선택해주세요.");
    return;
  }

  const userInfo = {
    gender: selectedGender.value,
    heightCm: parseFloat(heightInput),
  };

  saveUserInfo(userInfo, selectedConsent.value);
  showMainSection();
  renderRecordList(loadAllRecords(), userInfo.heightCm);
};

// 체중 기록 추가 또는 수정
const handleWeightSave = () => {
  const dateValue = document.getElementById("date-input").value;
  const weightValue = document.getElementById("weight-input").value;

  if (!dateValue) {
    alert("날짜를 선택해주세요.");
    return;
  }

  if (!isValidWeight(weightValue)) {
    alert("체중을 올바르게 입력해주세요. (10kg ~ 300kg)");
    return;
  }

  const userInfo = loadUserInfo();

  if (currentEditingId !== null) {
    // 수정 모드
    updateRecord(currentEditingId, {
      date: dateValue,
      weight: parseFloat(weightValue),
    });
    currentEditingId = null;
    document.getElementById("weight-save-btn").textContent = "기록 추가";
  } else {
    // 추가 모드
    const newRecord = {
      id: generateUniqueId(),
      date: dateValue,
      weight: parseFloat(weightValue),
    };
    addRecord(newRecord);
  }

  clearForm();
  renderRecordList(loadAllRecords(), userInfo.heightCm);
};

// 수정 / 삭제 버튼 — 이벤트 위임
const handleRecordAction = (event) => {
  const clickedButton = event.target;
  const targetId = clickedButton.dataset.id;

  if (clickedButton.classList.contains("delete-btn")) {
    if (confirm("정말 삭제하시겠습니까?")) deleteRecord(targetId);
    renderRecordList(loadAllRecords(), loadUserInfo().heightCm);
  }

  if (clickedButton.classList.contains("edit-btn")) {
    const allRecords = loadAllRecords();
    const targetRecord = allRecords.find((record) => record.id === targetId);

    if (targetRecord) {
      fillFormForEdit(targetRecord);
      currentEditingId = targetId;
      document.getElementById("weight-save-btn").textContent = "수정 완료";
    }
  }
};

// =====================
// 앱 시작
// =====================

initializeApp();
