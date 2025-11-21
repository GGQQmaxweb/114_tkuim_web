const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const getbtn = document.getElementById("get");

// POST signup (form submit)
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await sendSignup();
});

// GET participants (button click)
getbtn.addEventListener('click', async () => {
  await fetchParticipants();
});

// POST /api/signup
async function sendSignup() {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.password = payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門'];
  payload.terms = true;

  try {
    resultEl.textContent = '送出中...';

    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '失敗');

    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  }
}

// GET /api/signup
async function fetchParticipants() {
  try {
    resultEl.textContent = '讀取資料中...';

    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || '讀取失敗');

    resultEl.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  }
}
