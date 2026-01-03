(() => {
    const stats = window.GeoStats.createSessionStats({
        correctKey: 'correctAnswers',
        totalKey: 'totalQuestions',
    });

    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', () => stats.resetStats());
    }

    function populateLHSCountries() {
        const lhsCountriesData = document.getElementById('lhs-countries-data');
        const paragraphElement = document.getElementById('lhs-countries-paragraph');
        const countBadge = document.getElementById('lhs-count');

        if (!lhsCountriesData || !paragraphElement || !countBadge) {
            return;
        }

        const lhsCountries = JSON.parse(lhsCountriesData.textContent);

        countBadge.textContent = lhsCountries.length;

        if (lhsCountries.length === 0) {
            paragraphElement.innerHTML = '<span class="text-muted">No left-hand drive countries found</span>';
        } else {
            paragraphElement.textContent = lhsCountries.join(', ');
        }
    }

    populateLHSCountries();

    const countryData = document.getElementById('country-data');
    const correctAnswer = countryData ? countryData.dataset.driveSide : null;
    let hasAnswered = false;

    function checkAnswer(selectedSide) {
        if (hasAnswered || !correctAnswer || !countryData) {
            return;
        }

        hasAnswered = true;
        const answerButtons = document.getElementById('answer-buttons');
        if (answerButtons) {
            answerButtons.classList.add('d-none');
        }

        const isCorrect = selectedSide === correctAnswer;
        stats.increment(isCorrect);

        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
        });

        const resultContainer = document.getElementById('result-container');
        const resultMessage = document.getElementById('result-message');
        const sideName = correctAnswer === 'LHS' ? 'left' : 'right';

        if (!resultContainer || !resultMessage) {
            return;
        }

        if (isCorrect) {
            resultContainer.className = 'result-container correct';
            resultContainer.style.display = 'block';
            resultMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    fill="#28a745" class="result-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.97 11.03a.75.75 0 0 0 1.08.02l3.99-4a.75.75 0 1 0-1.06-1.06L7.5 9.44 5.97 7.91a.75.75 0 1 0-1.06 1.06z" />
                </svg>
                <span style="color: #155724;">Correct! ${countryData.dataset.country} drives on the ${sideName}</span>
            `;
        } else {
            resultContainer.className = 'result-container incorrect';
            resultContainer.style.display = 'block';
            resultMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    fill="#dc3545" class="result-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.646 4.646a.5.5 0 0 0 0 .708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646a.5.5 0 0 0-.708 0" />
                </svg>
                <span style="color: #721c24;">${countryData.dataset.country} drives on the <strong>${sideName}</strong></span>
            `;
        }

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    const leftButton = document.getElementById('answer-left');
    if (leftButton) {
        leftButton.addEventListener('click', () => checkAnswer('LHS'));
    }

    const rightButton = document.getElementById('answer-right');
    if (rightButton) {
        rightButton.addEventListener('click', () => checkAnswer('RHS'));
    }

    document.addEventListener('keydown', function (e) {
        if (hasAnswered) {
            return;
        }

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            checkAnswer('LHS');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            checkAnswer('RHS');
        }
    });
})();
