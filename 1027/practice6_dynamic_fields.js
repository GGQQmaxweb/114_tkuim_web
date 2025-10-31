// practice6_dynamic_fields.js
// 動態新增報名欄位並整合事件委派、即時驗證與送出攔截

const form = document.getElementById('dynamic-form');
const list = document.getElementById('participant-list');
const addBtn = document.getElementById('add-participant');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const countLabel = document.getElementById('count');

const maxParticipants = 5;
let participantIndex = 0;
const STORAGE_KEY = 'practice6_participants';

const exportJsonBtn = document.getElementById('export-json');
const exportTxtBtn = document.getElementById('export-txt');
const clearStorageBtn = document.getElementById('clear-storage');

function createParticipantCard(data = {}) {
  const index = participantIndex++;
  const wrapper = document.createElement('div');
  wrapper.className = 'participant card border-0 shadow-sm';
  wrapper.dataset.index = index;
  wrapper.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="card-title mb-0">參與者 ${index + 1}</h5>
        <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove">移除</button>
      </div>
      <div class="mb-3">
        <label class="form-label" for="name-${index}">姓名</label>
        <input id="name-${index}" name="name-${index}" class="form-control" type="text" required aria-describedby="name-${index}-error" value="${data.name || ''}">
        <p id="name-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
      <div class="mb-0">
        <label class="form-label" for="email-${index}">Email</label>
        <input id="email-${index}" name="email-${index}" class="form-control" type="email" required aria-describedby="email-${index}-error" inputmode="email" value="${data.email || ''}">
        <p id="email-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
    </div>
  `
  return wrapper;
}

function updateCount() {
  countLabel.textContent = list.children.length;
  addBtn.disabled = list.children.length >= maxParticipants;
}

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  if (message) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
}

function validateInput(input) {
  const value = input.value.trim();
  if (!value) {
    setError(input, '此欄位必填');
    return false;
  }
  if (input.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(input, 'Email 格式不正確');
      return false;
    }
  }
  setError(input, '');
  return true;
}

function handleAddParticipant() {
  if (list.children.length >= maxParticipants) {
    return;
  }
  const participant = createParticipantCard();
  list.appendChild(participant);
  updateCount();
  participant.querySelector('input').focus();
  saveToStorage();
}

addBtn.addEventListener('click', handleAddParticipant);

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) {
    return;
  }
  const participant = button.closest('.participant');
  participant?.remove();
  updateCount();
  saveToStorage();
});

list.addEventListener('blur', (event) => {
  if (event.target.matches('input')) {
    validateInput(event.target);
  }
}, true);

list.addEventListener('input', (event) => {
  if (event.target.matches('input')) {
    const wasInvalid = event.target.validationMessage;
    if (wasInvalid) {
      validateInput(event.target);
    }
    // 儲存使用者的未送出變更
    saveToStorage();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (list.children.length === 0) {
    alert('請至少新增一位參與者');
    handleAddParticipant();
    return;
  }

  let firstInvalid = null;
  list.querySelectorAll('input').forEach((input) => {
    const valid = validateInput(input);
    if (!valid && !firstInvalid) {
      firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('表單已送出！');
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  // 送出成功後清除暫存
  localStorage.removeItem(STORAGE_KEY);
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  localStorage.removeItem(STORAGE_KEY);
});

// 序列化目前的參與者資料
function getParticipantsData() {
  const data = [];
  list.querySelectorAll('.participant').forEach((card) => {
    const name = card.querySelector('input[type="text"]').value.trim();
    const email = card.querySelector('input[type="email"]').value.trim();
    data.push({ name, email });
  });
  return data;
}

function saveToStorage() {
  try {
    const data = getParticipantsData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // skip storage errors
    console.warn('保存至 localStorage 失敗', e);
  }
}

function restoreFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) return false;
    // 清空並重建
    list.innerHTML = '';
    participantIndex = 0;
    data.forEach((p) => {
      const card = createParticipantCard(p);
      list.appendChild(card);
    });
    updateCount();
    return true;
  } catch (e) {
    console.warn('從 localStorage 還原失敗', e);
    return false;
  }
}

// 匯出為檔案
function download(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

exportJsonBtn?.addEventListener('click', () => {
  const data = getParticipantsData();
  if (data.length === 0) {
    alert('沒有參與者可匯出');
    return;
  }
  download('participants.json', JSON.stringify(data, null, 2), 'application/json');
});

exportTxtBtn?.addEventListener('click', () => {
  const data = getParticipantsData();
  if (data.length === 0) {
    alert('沒有參與者可匯出');
    return;
  }
  const lines = data.map((p, i) => `${i + 1}. ${p.name} <${p.email}>`);
  download('participants.txt', lines.join('\n'), 'text/plain');
});

clearStorageBtn?.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  alert('已清除暫存資料');
});

// 在載入時嘗試還原；若無資料則預設新增一筆
if (!restoreFromStorage()) {
  handleAddParticipant();
} else {
  // 還原後若存在未驗證欄位，稍微觸發驗證樣式顯示
  list.querySelectorAll('input').forEach((inp) => validateInput(inp));
}
