# ⚖️ WeightLog

날짜별 체중을 기록하고 BMI를 확인하는 바닐라 JS 토이 프로젝트입니다.
프레임워크 없이 JavaScript만으로 구현했습니다.

---

## 📌 서비스 소개

별도 회원가입 없이 브라우저에서 바로 체중을 기록하고 관리할 수 있는 웹 애플리케이션입니다.
첫 방문 시 기본 정보(성별, 키)를 입력하고 저장 방식(쿠키/세션)을 선택하면,
이후 방문부터는 바로 기록 화면으로 진입합니다.
순수 JS만으로 관심사를 분리해 구현했습니다.

---

## ✅ 주요 기능

- 첫 방문 시 성별 / 키 입력 및 저장 방식 선택 (쿠키 / 세션)
- 날짜 + 체중 입력 및 저장
- 기록 목록 조회 / 수정 / 삭제
- BMI 자동 계산 및 상태 표시
- LocalStorage 기반 데이터 유지

---

## 📂 프로젝트 구조

```
WeightLog/
├── index.html
├── css/
│   ├── reset.css       # 브라우저 기본 스타일 초기화
│   └── style.css       # 전체 스타일 (glassmorphism 기반)
├── js/
│   ├── app.js          # 진입점, 이벤트 바인딩
│   ├── storage.js      # LocalStorage / Cookie / Session 읽기/쓰기
│   ├── bmi.js          # BMI 계산 로직
│   ├── render.js       # DOM 렌더링
│   └── utils.js        # 날짜 포맷 등 공통 유틸
└── .vscode/
    ├── extensions.json # 추천 익스텐션
    └── settings.json   # 에디터 설정
```

---

## 🛠 Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)

---

## 🔗 Demo

https://full-running.github.io/BodyLog/

## ✅ 기능 상세

### 기본정보 입력 (첫 방문)

- 성별 / 키(cm) 입력
- 저장 방식 선택
  - 쿠키: 브라우저를 닫아도 유지 (365일)
  - 세션: 브라우저를 닫으면 삭제

### 체중 입력

- 날짜와 체중(kg)을 입력하면 LocalStorage에 저장
- 같은 날짜 중복 입력 시 덮어쓰기

### 기록 조회 / 수정 / 삭제

- 저장된 기록을 날짜 내림차순으로 목록 표시
- 수정 시 기존 값 입력 폼에 불러오기
- 삭제 시 확인 없이 즉시 제거

### BMI 계산

- 기본정보 입력 시 키(cm) 저장
- 체중 입력 시 BMI 자동 계산 및 상태 표시
  - 저체중 / 정상 / 과체중 / 비만 (대한비만학회 기준)
