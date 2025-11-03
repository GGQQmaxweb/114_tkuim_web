const form = document.querySelector('#signup');
const submitBtn = document.querySelector('#submitBtn');
const resetBtn = document.querySelector('#resetBtn');
const tagsContainer = document.querySelector('#tagsContainer');
const password = document.querySelector('#password');
const confirmPwd = document.querySelector('#confirm');
const passwordBar = document.querySelector('#password-bar');
const strengthText = document.querySelector('#password-strength-text');
const note = document.querySelector('#form-note');

// ✅ 即時驗證
form.addEventListener('input', e => validateField(e.target));
form.addEventListener('blur', e => validateField(e.target), true);

// ✅ 密碼強度判斷
password.addEventListener('input', () => {
  const val = password.value;
  let score = 0;
  if (/[a-z]/.test(val)) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (val.length >= 8) score++;

  const percent = (score / 5) * 100;
  passwordBar.style.width = percent + '%';
  let level = '—', color = 'bg-secondary';
  if (percent >= 80) { level = '強'; color = 'bg-success'; }
  else if (percent >= 50) { level = '中'; color = 'bg-warning'; }
  else if (percent > 0) { level = '弱'; color = 'bg-danger'; }
  passwordBar.className = `progress-bar ${color}`;
  strengthText.textContent = `密碼強度：${level}`;
});

// ✅ 驗證邏輯
function validateField(field) {
  if (!(field instanceof HTMLInputElement)) return;
  let msg = '';
  if (field.validity.valueMissing) msg = '此欄位為必填。';
  else if (field.type === 'email' && field.validity.typeMismatch) msg = '請輸入有效的 Email。';
  else if (field.id === 'phone' && !/^\d{10}$/.test(field.value)) msg = '手機號碼須為 10 位數字。';
  else if (field.id === 'confirm' && field.value !== password.value) msg = '兩次密碼不一致。';

  field.setCustomValidity(msg);
  field.classList.toggle('is-invalid', !!msg);
  document.getElementById(field.id + '-error').textContent = msg;
}

// ✅ 標籤事件委派
tagsContainer.addEventListener('click', e => {
  if (e.target.tagName === 'LABEL') {
    const input = document.getElementById(e.target.getAttribute('for'));
    input.checked = !input.checked;
    e.target.classList.toggle('active', input.checked);
  }
});

// ✅ 送出攔截
form.addEventListener('submit', e => {
  e.preventDefault();
  let firstError = null;
  const inputs = form.querySelectorAll('input[required]');
  inputs.forEach(i => {
    validateField(i);
    if (!i.checkValidity() && !firstError) firstError = i;
  });

  const checkedTags = form.querySelectorAll('#tagsContainer input:checked');
  const tagError = document.getElementById('tags-error');
  if (checkedTags.length === 0) {
    tagError.textContent = '請至少選擇一個興趣。';
    firstError ??= tagsContainer;
  } else tagError.textContent = '';

  if (firstError) {
    firstError.focus();
    return;
  }

  // ✅ 模擬送出狀態
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  note.textContent = '';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = '註冊';
    note.textContent = '✅ 註冊成功！';
    localStorage.clear();
    form.reset();
    passwordBar.style.width = '0%';
    strengthText.textContent = '密碼強度：—';
  }, 1000);
});

// ✅ localStorage 暫存
form.addEventListener('input', () => {
  const data = Object.fromEntries(new FormData(form));
  localStorage.setItem('signupData', JSON.stringify(data));
});

// ✅ 恢復資料
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('signupData');
  if (!saved) return;
  const data = JSON.parse(saved);
  for (let [k, v] of Object.entries(data)) {
    const el = form.elements[k];
    if (!el) continue;
    if (el.type === 'checkbox') el.checked = true;
    else el.value = v;
  }
});

// ✅ 重設按鈕
resetBtn.addEventListener('click', () => {
  form.reset();
  localStorage.clear();
  passwordBar.style.width = '0%';
  strengthText.textContent = '密碼強度：—';
  form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
});
