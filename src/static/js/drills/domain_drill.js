(() => {
    const stats = window.GeoStats.createSessionStats({
        correctKey: 'domainCorrectAnswers',
        totalKey: 'domainTotalQuestions',
    });

    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', () => stats.resetStats());
    }

    const dataScript = document.getElementById('domain-data');
    const data = dataScript ? JSON.parse(dataScript.textContent) : [];
    const domainDisplay = document.getElementById('domain-display');
    const resultContainer = document.getElementById('result-container');
    const resultMessage = document.getElementById('result-message');
    const optionButtons = [
        document.getElementById('option-0'),
        document.getElementById('option-1'),
        document.getElementById('option-2'),
        document.getElementById('option-3'),
    ];

    let correctCountry = '';
    let hasAnswered = false;

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function domainKey(domain) {
        return domain.replace(/^\./, '').toLowerCase();
    }

    function isCloseDomain(target, candidate) {
        const a = domainKey(target);
        const b = domainKey(candidate);

        if (!a || !b) return false;
        if (a === b) return false;

        if (a.length === b.length) {
            if (a.length <= 3) {
                if (a[0] === b[0] || a[a.length - 1] === b[b.length - 1]) return true;
                if (a.length > 1 && a[1] === b[1]) return true;
            } else {
                if (a.slice(0, 2) === b.slice(0, 2)) return true;
                if (a.slice(-2) === b.slice(-2)) return true;
            }
        }

        if (a[0] === b[0]) return true;
        return false;
    }

    function buildOptions(entry, domain) {
        const closePool = [];
        const fallbackPool = [];

        data.forEach(candidate => {
            if (candidate.country === entry.country) return;
            const hasClose = candidate.domains.some(d => isCloseDomain(domain, d));
            if (hasClose) {
                closePool.push(candidate.country);
            } else {
                fallbackPool.push(candidate.country);
            }
        });

        const options = [entry.country];
        while (options.length < 4 && closePool.length) {
            const pick = pickRandom(closePool);
            closePool.splice(closePool.indexOf(pick), 1);
            if (!options.includes(pick)) options.push(pick);
        }

        while (options.length < 4 && fallbackPool.length) {
            const pick = pickRandom(fallbackPool);
            fallbackPool.splice(fallbackPool.indexOf(pick), 1);
            if (!options.includes(pick)) options.push(pick);
        }

        return options.sort(() => Math.random() - 0.5);
    }

    function chooseDomain(domains) {
        if (domains.length <= 1) return domains[0];
        const filtered = domains.filter(domain => domain.toLowerCase() !== '.eu');
        return pickRandom(filtered.length ? filtered : domains);
    }

    function renderQuestion() {
        if (!data.length) return;
        hasAnswered = false;
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }

        const entry = pickRandom(data);
        const domain = chooseDomain(entry.domains);
        correctCountry = entry.country;

        if (domainDisplay) {
            domainDisplay.textContent = domain;
        }

        const options = buildOptions(entry, domain);
        optionButtons.forEach((btn, index) => {
            if (!btn) return;
            btn.disabled = false;
            btn.textContent = options[index] || '';
        });
    }

    function lockButtons() {
        optionButtons.forEach(btn => {
            if (btn) btn.disabled = true;
        });
    }

    function showResult(isCorrect) {
        if (!resultContainer || !resultMessage) return;
        resultContainer.className = isCorrect
            ? 'result-container correct'
            : 'result-container incorrect';
        resultContainer.style.display = 'block';

        if (isCorrect) {
            resultMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    fill="#28a745" class="result-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.97 11.03a.75.75 0 0 0 1.08.02l3.99-4a.75.75 0 1 0-1.06-1.06L7.5 9.44 5.97 7.91a.75.75 0 1 0-1.06 1.06z" />
                </svg>
                <span style="color: #155724;">Correct! ${correctCountry} matches the domain.</span>
            `;
        } else {
            resultMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    fill="#dc3545" class="result-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.646 4.646a.5.5 0 0 0 0 .708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646a.5.5 0 0 0-.708 0" />
                </svg>
                <span style="color: #721c24;">Correct answer: <strong>${correctCountry}</strong></span>
            `;
        }
    }

    function handleAnswer(choice) {
        if (hasAnswered) return;
        hasAnswered = true;
        const isCorrect = choice === correctCountry;
        stats.increment(isCorrect);
        lockButtons();
        showResult(isCorrect);
        setTimeout(() => {
            renderQuestion();
        }, 1600);
    }

    optionButtons.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => handleAnswer(btn.textContent));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key, 10) - 1;
            const btn = optionButtons[index];
            if (btn && !btn.disabled) {
                handleAnswer(btn.textContent);
            }
        } else if (e.key === 'r' || e.key === 'R') {
            renderQuestion();
        }
    });

    renderQuestion();
})();
