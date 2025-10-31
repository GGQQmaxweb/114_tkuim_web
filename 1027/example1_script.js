// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
function add(){
  const value = input.value.trim();
  if (!value) {
    return;
  }
  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `${value} <div class="btn-group">
          <button class="btn btn-sm btn-outline-success" data-action="complete">完成</button>
          <button class="btn btn-sm btn-outline-danger" data-action="remove">刪除</button>
        </div>`;
  list.appendChild(item);
  input.value = '';
  input.focus();
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  add();
});
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    add();
  }
});
list.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="remove"]');
  if (!target) {
    return;
  }
  const item = target.closest('li');
  if (item) {
    item.remove();
  }
});
list.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="complete"]');
  if (!target) {
    return;
  }
  const item = target.closest('li');
  if (item) {
    item.classList.toggle('list-group-item-success');
  }
});
