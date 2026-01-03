window.GeoStats = (function () {
    function createSessionStats(options) {
        const correctKey = options.correctKey;
        const totalKey = options.totalKey;
        const confirmMessage = options.confirmMessage || 'Are you sure you want to reset your stats?';

        let correctAnswers = parseInt(sessionStorage.getItem(correctKey) || '0');
        let totalQuestions = parseInt(sessionStorage.getItem(totalKey) || '0');

        function updateStats() {
            const correctEl = document.getElementById('correct-count');
            const totalEl = document.getElementById('total-count');
            const accuracyEl = document.getElementById('accuracy');

            if (!correctEl || !totalEl || !accuracyEl) {
                return;
            }

            correctEl.textContent = correctAnswers;
            totalEl.textContent = totalQuestions;

            const accuracy = totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0;
            accuracyEl.textContent = accuracy + '%';
        }

        function persist() {
            sessionStorage.setItem(correctKey, String(correctAnswers));
            sessionStorage.setItem(totalKey, String(totalQuestions));
        }

        function resetStats() {
            if (!confirm(confirmMessage)) {
                return;
            }

            correctAnswers = 0;
            totalQuestions = 0;
            persist();
            updateStats();
        }

        function increment(isCorrect) {
            totalQuestions++;
            if (isCorrect) {
                correctAnswers++;
            }
            persist();
            updateStats();
        }

        function incrementTotal() {
            totalQuestions++;
            persist();
            updateStats();
        }

        updateStats();

        return {
            resetStats,
            increment,
            incrementTotal,
        };
    }

    return {
        createSessionStats,
    };
})();
