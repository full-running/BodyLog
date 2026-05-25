import { useState } from 'react';

// 지금은 연습용으로 관리자 계정을 프론트 코드 안에 직접 둡니다.
// 실제 서비스에서는 서버에서 아이디/비밀번호를 검증해야 안전합니다.
const ADMIN_USER = {
  id: 'admin',
  password: '1234',
};

function LoginPage({ onLogin }) {
  // 사용자가 입력한 아이디와 비밀번호를 한 객체로 관리합니다.
  // input의 name 값(id, password)을 이용해 아래 handleChange에서 값을 바꿉니다.
  const [form, setForm] = useState({
    id: '',
    password: '',
  });

  // 로그인 실패나 입력 누락처럼 사용자에게 보여줄 안내 문구입니다.
  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    // 기존 form 값을 유지하면서, 방금 입력한 칸만 name 기준으로 갱신합니다.
    // 예: name이 "id"이면 form.id만 바뀌고 password는 그대로 남습니다.
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    // form 제출 시 브라우저가 페이지를 새로고침하는 기본 동작을 막습니다.
    event.preventDefault();

    // trim()은 앞뒤 공백을 제거합니다. 공백만 입력한 경우도 빈 값으로 봅니다.
    if (
      !form.id.trim() ||
      !form.password.trim()
    ) {
      setErrorMessage(
        '아이디와 비밀번호를 모두 입력해주세요.'
      );
      return;
    }

    // 입력한 값이 위에 정의한 ADMIN_USER와 일치하는지 확인합니다.
    if (
      form.id !== ADMIN_USER.id ||
      form.password !==
        ADMIN_USER.password
    ) {
      setErrorMessage(
        '아이디 또는 비밀번호가 올바르지 않습니다.'
      );
      return;
    }

    // 로그인 성공 상태를 브라우저 저장소에 남깁니다.
    // 새로고침해도 이 값이 남아 있으면 로그인 상태를 복원할 수 있습니다.
    localStorage.setItem(
      'adminLoggedIn',
      'true'
    );

    // 부모 컴포넌트(App)에 로그인 성공을 알려 화면을 대시보드로 바꿉니다.
    onLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          WeightLog Admin
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          관리자 로그인이 필요합니다.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="admin-id"
            >
              아이디
            </label>
            <input
              id="admin-id"
              name="id"
              type="text"
              value={form.id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="admin"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="admin-password"
            >
              비밀번호
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="1234"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            로그인
          </button>
        </form>
      </section>
    </main>
  );
}

function DashboardPage({ onLogout }) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              관리자 대시보드
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              WeightLog 관리 화면입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            로그아웃
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              총 사용자
            </p>
            <strong className="mt-2 block text-3xl text-slate-900">
              0
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              오늘 기록
            </p>
            <strong className="mt-2 block text-3xl text-slate-900">
              0
            </strong>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              관리 상태
            </p>
            <strong className="mt-2 block text-3xl text-slate-900">
              정상
            </strong>
          </article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  // 앱이 처음 켜질 때 localStorage를 확인해 이전 로그인 상태를 복원합니다.
  // useState에 함수를 넣으면 최초 렌더링 때 한 번만 실행됩니다.
  const [isLoggedIn, setIsLoggedIn] =
    useState(() => {
      const savedLoginStatus =
        localStorage.getItem(
          'adminLoggedIn'
        ) === 'true';

      return savedLoginStatus;
    });

  // LoginPage에서 로그인에 성공하면 호출됩니다.
  // isLoggedIn이 true가 되면 아래 return에서 DashboardPage가 렌더링됩니다.
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 로그아웃 시 저장소의 로그인 표시를 지우고, 화면도 로그인 페이지로 되돌립니다.
  const handleLogout = () => {
    localStorage.removeItem(
      'adminLoggedIn'
    );
    setIsLoggedIn(false);
  };

  // isLoggedIn 값에 따라 보여줄 화면을 결정합니다.
  // true면 관리자 대시보드, false면 로그인 페이지를 보여줍니다.
  return isLoggedIn ? (
    <DashboardPage
      onLogout={handleLogout}
    />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}
