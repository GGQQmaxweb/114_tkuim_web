// example2_script.js
const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');

// 追蹤欄位是否被使用過
const touchedFields = new Set();

function showValidity(input) {
  // 如果欄位未被使用過，不顯示錯誤
  if (!touchedFields.has(input)) {
    return true;
  }

  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title || '格式不正確');
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // 提交時將所有欄位標記為已使用
  touchedFields.add(email);
  touchedFields.add(phone);
  
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);
  
  if (emailOk && phoneOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
    touchedFields.clear(); // 重置已使用欄位記錄
  }
});

// blur 事件：標記欄位為已使用並驗證
[email, phone].forEach(input => {
  input.addEventListener('blur', () => {
    touchedFields.add(input);
    showValidity(input);
  });
});

// input 事件：即時更新錯誤訊息（僅針對已使用過的欄位）
[email, phone].forEach(input => {
  input.addEventListener('input', () => {
    if (touchedFields.has(input)) {
      showValidity(input);
    }
  });
});
