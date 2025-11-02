  (function(){
    const form = document.getElementById('signup');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');

    const fields = {
      fullname: document.getElementById('fullname'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      password: document.getElementById('password'),
      confirm: document.getElementById('confirm'),
      terms: document.getElementById('terms'),
      interestsContainer: document.getElementById('interests')
    };

    const errors = {
      fullname: document.getElementById('fullname-error'),
      email: document.getElementById('email-error'),
      phone: document.getElementById('phone-error'),
      password: document.getElementById('password-error'),
      confirm: document.getElementById('confirm-error'),
      interests: document.getElementById('interests-error'),
      terms: document.getElementById('terms-error')
    };

    const strengthBar = document.getElementById('password-strength');
    const strengthText = document.getElementById('password-strength-text');

    // Track touched state so we only show messages after first blur
    const touched = {};

    function setError(fieldEl, message){
      const id = fieldEl.id || fieldEl.name || 'field';
      const p = errors[id] || null;
      fieldEl.setCustomValidity(message || '');
      if(p) p.textContent = message || '';
    }

    function validateName(){
      const v = fields.fullname.value.trim();
      if(!v){ setError(fields.fullname, '請輸入姓名'); return false; }
      setError(fields.fullname, ''); return true;
    }

    function validateEmail(){
      const v = fields.email.value.trim();
      if(!v){ setError(fields.email, '請輸入 Email'); return false; }
      // let browser handle basic format, but provide Chinese message
      if(!fields.email.checkValidity()){
        setError(fields.email, 'Email 格式錯誤');
        return false;
      }
      setError(fields.email, ''); return true;
    }

    function validatePhone(){
      const v = fields.phone.value.trim();
      if(!v){ setError(fields.phone, '請輸入手機號碼'); return false; }
      if(!/^\d{10}$/.test(v)){
        setError(fields.phone, '手機需為 10 碼數字'); return false;
      }
      setError(fields.phone, ''); return true;
    }

    function validatePassword(){
      const v = fields.password.value;
      if(!v){ setError(fields.password, '請輸入密碼'); return false; }
      if(v.length < 8){ setError(fields.password, '密碼至少 8 碼'); return false; }
      if(!(/[A-Za-z]/.test(v) && /[0-9]/.test(v))){ setError(fields.password, '密碼需含英文字母與數字'); return false; }
      setError(fields.password, ''); return true;
    }

    function validateConfirm(){
      const v = fields.confirm.value;
      if(!v){ setError(fields.confirm, '請再次輸入密碼'); return false; }
      if(v !== fields.password.value){ setError(fields.confirm, '兩次密碼不一致'); return false; }
      setError(fields.confirm, ''); return true;
    }

    function validateInterests(){
      const checked = Array.from(fields.interestsContainer.querySelectorAll('input[type=checkbox]')).some(cb=>cb.checked);
      if(!checked){ errors.interests.textContent = '請至少選擇一項興趣';
        // set a pseudo validity on container by using dataset
        fields.interestsContainer.dataset.invalid = 'true';
        return false;
      }
      errors.interests.textContent = '';
      delete fields.interestsContainer.dataset.invalid;
      return true;
    }

    function validateTerms(){
      if(!fields.terms.checked){ setError(fields.terms, '需同意服務條款'); return false; }
      setError(fields.terms, ''); return true;
    }

    function updateStrength(){
      const v = fields.password.value || '';
      let score = 0;
      if(v.length >= 8) score++;
      if(/[A-Z]/.test(v)) score++;
      if(/[0-9]/.test(v)) score++;
      if(/[^A-Za-z0-9]/.test(v)) score++;

      if(score <= 1){ strengthBar.className = 'strength weak'; strengthText.textContent = '密碼強度：弱'; }
      else if(score === 2 || score ===3){ strengthBar.className = 'strength medium'; strengthText.textContent = '密碼強度：中'; }
      else { strengthBar.className = 'strength strong'; strengthText.textContent = '密碼強度：強'; }
    }

    // Event helpers
    function onBlurValidate(e){
      const id = e.target.id;
      touched[id] = true;
      switch(id){
        case 'fullname': validateName(); break;
        case 'email': validateEmail(); break;
        case 'phone': validatePhone(); break;
        case 'password': validatePassword(); updateStrength(); break;
        case 'confirm': validateConfirm(); break;
      }
    }

    function onInputValidate(e){
      const id = e.target.id;
      switch(id){
        case 'fullname': if(touched[id]) validateName(); break;
        case 'email': if(touched[id]) validateEmail(); break;
        case 'phone': if(touched[id]) validatePhone(); break;
        case 'password': if(touched[id]) validatePassword(); updateStrength(); if(touched['confirm']) validateConfirm(); break;
        case 'confirm': if(touched[id]) validateConfirm(); break;
      }
      saveToLocalStorage();
    }

    // Event delegation for interest tags
    fields.interestsContainer.addEventListener('click', (e)=>{
      // If clicking label or inner text, find the <label>
      let label = e.target.closest('label.tag');
      if(!label) return;
      const checkbox = label.querySelector('input[type=checkbox]');
      checkbox.checked = !checkbox.checked;
      label.classList.toggle('checked', checkbox.checked);
      // update accessibility: announce count
      validateInterests();
      saveToLocalStorage();
    });

    // Also listen for change on hidden checkboxes (in case keyboard navigation)
    fields.interestsContainer.addEventListener('change', () => {
      Array.from(fields.interestsContainer.querySelectorAll('label.tag')).forEach(l=>{
        const cb = l.querySelector('input[type=checkbox]');
        l.classList.toggle('checked', cb.checked);
      });
      validateInterests();
      saveToLocalStorage();
    });

    // Attach blur / input handlers
    ['fullname','email','phone','password','confirm'].forEach(id=>{
      const el = fields[id];
      el.addEventListener('blur', onBlurValidate);
      el.addEventListener('input', onInputValidate);
    });

    fields.terms.addEventListener('change', ()=>{ validateTerms(); saveToLocalStorage(); });

    // Submit handling
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      // run all validators
      const validators = [validateName, validateEmail, validatePhone, validatePassword, validateConfirm, validateInterests, validateTerms];
      const results = validators.map(fn=>fn());
      const allValid = results.every(Boolean);
      if(!allValid){
        // focus first invalid
        const order = ['fullname','email','phone','password','confirm','interests','terms'];
        for(const id of order){
          if(id === 'interests' && fields.interestsContainer.dataset.invalid){ fields.interestsContainer.focus(); break; }
          if(id === 'terms' && !fields.terms.checked){ fields.terms.focus(); break; }
          const el = fields[id];
          if(el && !el.checkValidity()){ el.focus(); break; }
        }
        return;
      }

      // disable to prevent double submit and show loading
      submitBtn.disabled = true; submitBtn.classList.add('loading');
      submitBtn.textContent = '送出中…';

      // Simulate sending (1s)
      await new Promise(res=>setTimeout(res, 1000));

      // Show success message, clear localStorage
      form.innerHTML = '<div class="success" role="status">註冊成功！已收到您的資料（示範畫面）。</div>';
      localStorage.removeItem('signup_form_data');
    });

    // Reset handling
    resetBtn.addEventListener('click', ()=>{
      form.reset();
      Object.values(errors).forEach(p=>p.textContent='');
      // reset tag visuals
      Array.from(fields.interestsContainer.querySelectorAll('label.tag')).forEach(l=>l.classList.remove('checked'));
      strengthBar.className = 'strength'; strengthText.textContent = '密碼強度： — ';
      localStorage.removeItem('signup_form_data');
    });

    // LocalStorage save/restore
    function saveToLocalStorage(){
      const data = {
        fullname: fields.fullname.value,
        email: fields.email.value,
        phone: fields.phone.value,
        password: fields.password.value,
        confirm: fields.confirm.value,
        terms: fields.terms.checked,
        interests: Array.from(fields.interestsContainer.querySelectorAll('input[type=checkbox]')).filter(cb=>cb.checked).map(cb=>cb.value)
      };
      localStorage.setItem('signup_form_data', JSON.stringify(data));
    }

    function restoreFromLocalStorage(){
      const raw = localStorage.getItem('signup_form_data');
      if(!raw) return;
      try{
        const data = JSON.parse(raw);
        fields.fullname.value = data.fullname || '';
        fields.email.value = data.email || '';
        fields.phone.value = data.phone || '';
        fields.password.value = data.password || '';
        fields.confirm.value = data.confirm || '';
        fields.terms.checked = !!data.terms;
        Array.from(fields.interestsContainer.querySelectorAll('input[type=checkbox]')).forEach(cb=>{
          cb.checked = Array.isArray(data.interests) && data.interests.includes(cb.value);
        });
        // update visuals
        Array.from(fields.interestsContainer.querySelectorAll('label.tag')).forEach(l=>{
          const cb = l.querySelector('input[type=checkbox]');
          l.classList.toggle('checked', cb.checked);
        });
        updateStrength();
      }catch(err){ console.warn('restore failed', err); }
    }

    // restore on load
    restoreFromLocalStorage();

    // Accessibility: make clicking space/enter on interest group toggle focused tag
    fields.interestsContainer.addEventListener('keydown', (e)=>{
      const focusable = Array.from(fields.interestsContainer.querySelectorAll('label.tag'));
      const idx = focusable.findIndex(l=>l === document.activeElement || l.contains(document.activeElement));
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); const next = focusable[(idx+1) % focusable.length]; next.focus(); }
      if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); const prev = focusable[(idx-1+focusable.length) % focusable.length]; prev.focus(); }
      if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); const label = document.activeElement.closest('label.tag'); if(label){ const cb = label.querySelector('input[type=checkbox]'); cb.checked = !cb.checked; label.classList.toggle('checked', cb.checked); validateInterests(); saveToLocalStorage(); } }
    });

    // Put tabindex on tags for keyboard
    Array.from(fields.interestsContainer.querySelectorAll('label.tag')).forEach(l=>l.setAttribute('tabindex','0'));

  })();