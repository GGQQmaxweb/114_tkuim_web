// client/signup_form.js
async function submitForm(payload) {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || '送出失敗');
    }
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Basic validation and gathering data
            const formData = new FormData(form);
            const payload = {};
            formData.forEach((value, key) => payload[key] = value);

            // Handle tags if they are checkboxes
            const tags = Array.from(document.querySelectorAll('.tag-input:checked')).map(el => el.value);
            // Although the current schema in signup.js doesn't seem to save tags/interests, we send them anyway or ignore
            // The schema in server/routes/signup.js only extracts { name, email, phone, password }
            // So we ensure we have those.

            try {
                await submitForm(payload);
                alert('註冊成功！');
                window.location.href = 'login.html';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});
