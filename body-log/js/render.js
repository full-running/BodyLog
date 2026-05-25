"use strict";

// render.js
// DOM 렌더링 전담 모듈
// 데이터를 받아서 화면에 그리는 역할만 담당
// 저장/계산 로직은 절대 여기서 하지 않음

// setup-section / main-section 전환
// LocalStorage에 기본정보 없으면 setup 화면, 있으면 main 화면 표시
const showSetupSection = () => {
  document.getElementById("setup-section").style.display = "flex";
  document.getElementById("main-section").style.display = "none";
};

const showMainSection = () => {
  document.getElementById("setup-section").style.display = "none";
  document.getElementById("main-section").style.display = "flex";
};

// 체중 기록 목록 전체를 tbody에 렌더링
// 날짜 내림차순 정렬 후 각 행을 생성
const renderRecordList = (records, heightCm) => {
  const tableBody = document.getElementById("weight-list");

  // 기존 목록 초기화 후 새로 그림
  tableBody.innerHTML = "";

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">기록이 없습니다.</td></tr>`;
    return;
  }

  // 날짜 내림차순 정렬
  const sortedRecords = [...records].sort((firstRecord, secondRecord) =>
    secondRecord.date.localeCompare(firstRecord.date),
  );

  sortedRecords.forEach((record) => {
    const { bmiValue, bmiStatus } = getBmiResult(record.weight, heightCm);
    const tableRow = createRecordRow(record, bmiValue, bmiStatus);
    tableBody.appendChild(tableRow);
  });
};

// 기록 한 행(tr) 생성
// 수정 / 삭제 버튼에 data-id 부여 → app.js에서 이벤트 위임으로 처리
const createRecordRow = (record, bmiValue, bmiStatus) => {
  const tableRow = document.createElement("tr");
  tableRow.dataset.id = record.id;
  tableRow.innerHTML = `
    <td>${record.date}</td>
    <td>${record.weight}kg</td>
    <td>${bmiValue}</td>
    <td>${bmiStatus}</td>
    <td>
      <button class="edit-btn" data-id="${record.id}">수정</button>
      <button class="delete-btn" data-id="${record.id}">삭제</button>
    </td>
  `;
  return tableRow;
};

// 수정 시 입력 폼에 기존 값 불러오기
const fillFormForEdit = (record) => {
  document.getElementById("date-input").value = record.date;
  document.getElementById("weight-input").value = record.weight;
};

// 입력 폼 초기화
const clearForm = () => {
  document.getElementById("date-input").value = getTodayDateString();
  document.getElementById("weight-input").value = "";
};
