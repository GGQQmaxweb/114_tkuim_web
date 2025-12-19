
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-info').textContent = `你好, ${user.name}`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    const listContainer = document.getElementById('participants-list');

    try {
        const response = await fetch('/api/signup'); // GET /api/signup returns list
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        // server returns { items: [], total: number }

        const participants = result.items || [];

        if (participants.length === 0) {
            listContainer.innerHTML = '<tr><td colspan="4" class="text-center">尚無資料</td></tr>';
            return;
        }

        listContainer.innerHTML = participants.map(p => `
      <tr>
        <td>${p.name || '-'}</td>
        <td>${p.email || '-'}</td>
        <td>${p.phone || '-'}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
      </tr>
    `).join('');
    } catch (err) {
        console.error(err);
        listContainer.innerHTML = '<tr><td colspan="4" class="text-center text-danger">載入失敗</td></tr>';
    }
});
