(() => {
    const stats = window.GeoStats.createSessionStats({
        correctKey: 'flagCorrectAnswers',
        totalKey: 'flagTotalQuestions',
    });

    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', () => stats.resetStats());
    }

    const countryData = document.getElementById('country-data');
    const correctAnswer = countryData ? countryData.dataset.country : '';
    let hasAnswered = false;

    const countriesData = document.getElementById('countries-data');
    const allCountries = countriesData ? JSON.parse(countriesData.textContent) : [];

    const input = document.getElementById('country-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    let currentFocus = -1;

    function closeAllLists() {
        if (autocompleteList) {
            autocompleteList.innerHTML = '';
        }
        currentFocus = -1;
    }

    function addActive(items) {
        if (!items || items.length === 0) return;

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }

        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;

        items[currentFocus].classList.add('active');
        if (input) {
            input.value = items[currentFocus].textContent;
        }
    }

    function checkAnswer() {
        if (hasAnswered) return;
        if (!input) return;

        const userAnswer = input.value.trim();
        if (!userAnswer) {
            alert('Please enter a country name');
            return;
        }

        hasAnswered = true;
        closeAllLists();

        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        stats.increment(isCorrect);

        input.disabled = true;
        const submitButton = document.getElementById('submit-btn');
        if (submitButton) {
            submitButton.disabled = true;
        }

        const resultContainer = document.getElementById('result-container');
        const resultMessage = document.getElementById('result-message');

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
                <span style="color: #155724;">Correct! This is the flag of ${correctAnswer}</span>
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
                <span style="color: #721c24;">Incorrect. This is the flag of <strong>${correctAnswer}</strong></span>
            `;
        }

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    function skipQuestion() {
        if (hasAnswered) return;

        hasAnswered = true;
        closeAllLists();
        stats.increment(false);

        const resultContainer = document.getElementById('result-container');
        const resultMessage = document.getElementById('result-message');

        if (!resultContainer || !resultMessage) {
            return;
        }

        resultContainer.className = 'result-container incorrect';
        resultContainer.style.display = 'block';
        resultMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                fill="#f39c12" class="result-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                    d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 3.94c.11.063.18.18.18.308v3.472a.35.35 0 0 1-.18.308l-6.857 3.94a.13.13 0 0 1-.125 0l-6.857-3.94A.35.35 0 0 1 1 9.736V6.264a.35.35 0 0 1 .18-.308zM2 6.51v2.98l5.5 3.155V9.665L2 6.51m6.5 6.135 5.5-3.155V6.51L8.5 9.665zM8 8.75l5.5-3.155L8 2.44 2.5 5.595z" />
                <path
                    d="M4.5 7.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H5.5v1.5a.5.5 0 0 1-1 0zM10.5 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-.5v1.5a.5.5 0 0 1-1 0z" />
            </svg>
            <span style="color: #856404;">Skipped. This is the flag of <strong>${correctAnswer}</strong></span>
        `;

        if (input) {
            input.disabled = true;
        }

        const submitButton = document.getElementById('submit-btn');
        if (submitButton) {
            submitButton.disabled = true;
        }

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    if (input) {
        input.addEventListener('input', function () {
            const val = this.value.trim();
            closeAllLists();

            if (!val) {
                return;
            }

            currentFocus = -1;
            const matches = allCountries.filter(country =>
                country.toLowerCase().includes(val.toLowerCase())
            );

            if (matches.length === 0 || !autocompleteList) {
                return;
            }

            matches.forEach((country) => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';

                const matchIndex = country.toLowerCase().indexOf(val.toLowerCase());
                const beforeMatch = country.substr(0, matchIndex);
                const match = country.substr(matchIndex, val.length);
                const afterMatch = country.substr(matchIndex + val.length);

                item.innerHTML = beforeMatch + '<strong>' + match + '</strong>' + afterMatch;

                item.addEventListener('click', function () {
                    if (input) {
                        input.value = country;
                    }
                    closeAllLists();
                });

                autocompleteList.appendChild(item);
            });
        });

        input.addEventListener('keydown', function (e) {
            const items = autocompleteList
                ? autocompleteList.getElementsByClassName('autocomplete-item')
                : [];

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentFocus++;
                addActive(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentFocus--;
                addActive(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentFocus > -1 && items[currentFocus]) {
                    items[currentFocus].click();
                } else {
                    checkAnswer();
                }
            }
        });
    }

    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', () => checkAnswer());
    }

    const skipButton = document.getElementById('skip-btn');
    if (skipButton) {
        skipButton.addEventListener('click', () => skipQuestion());
    }

    document.addEventListener('keydown', function (e) {
        if (hasAnswered) {
            return;
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            skipQuestion();
        } else if (e.key === 'Enter' && e.target !== input) {
            e.preventDefault();
            checkAnswer();
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target !== input) {
            closeAllLists();
        }
    });

    window.addEventListener('load', function () {
        if (input) {
            input.focus();
        }
    });
})();
