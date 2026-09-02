// ------------------------------------------------------------
// INTERVIEW HISTORY CONNECTOR — MILESTONE 10
// Automatically saves completed interviews to localStorage.
// ------------------------------------------------------------

(function () {
    let lastSavedInterviewId = null;

    function saveCompletedInterviewToHistory() {
        if (
            typeof interviewAnswers === "undefined" ||
            !Array.isArray(interviewAnswers) ||
            interviewAnswers.length === 0
        ) {
            return;
        }

        const answered = interviewAnswers.filter(
            item =>
                item.answer &&
                item.answer !== "Skipped"
        );

        const skipped = interviewAnswers.filter(
            item =>
                item.answer === "Skipped"
        );

        const scores = answered.map(
            item => Number(item.score) || 0
        );

        const average = scores.length
            ? scores.reduce(
                (sum, score) => sum + score,
                0
            ) / scores.length
            : 0;

        const overall =
            Math.round(average * 10) / 10;

        const interviewTypeElement =
            document.getElementById("interviewType");

        const interviewType =
            interviewTypeElement
                ? interviewTypeElement.value
                : "General";

        const report = {
            score: overall,
            totalQuestions: interviewAnswers.length,
            answered: answered.length,
            skipped: skipped.length,
            strengths: [],
            improvements: [],
            interviewType: interviewType
        };

        if (average >= 7) {
            report.strengths.push(
                "Your answers generally demonstrated good interview readiness."
            );
        }

        if (
            answered.some(
                item =>
                    item.answer.split(/\s+/).length >= 40
            )
        ) {
            report.strengths.push(
                "You provided detailed answers rather than only short responses."
            );
        }

        if (
            answered.some(
                item =>
                    /project|built|developed|created/i.test(
                        item.answer
                    )
            )
        ) {
            report.strengths.push(
                "You connected your answers to practical project experience."
            );
        }

        if (report.strengths.length === 0) {
            report.strengths.push(
                "You completed the interview practice session."
            );
        }

        if (
            answered.some(
                item =>
                    item.answer.split(/\s+/).length < 25
            )
        ) {
            report.improvements.push(
                "Give more detailed answers and include specific examples."
            );
        }

        if (skipped.length > 0) {
            report.improvements.push(
                "Try to answer every question instead of skipping questions."
            );
        }

        if (
            answered.some(
                item =>
                    Number(item.score) < 6
            )
        ) {
            report.improvements.push(
                "Review your lower-scoring answers and strengthen their structure."
            );
        }

        if (report.improvements.length === 0) {
            report.improvements.push(
                "Keep practicing and make your answers increasingly specific and concise."
            );
        }

        const interviewId =
            interviewAnswers
                .map(item => item.question)
                .join("|") +
            "|" +
            interviewAnswers.length +
            "|" +
            overall;

        if (interviewId === lastSavedInterviewId) {
            return;
        }

        lastSavedInterviewId = interviewId;

        if (
            typeof saveInterviewToHistory ===
            "function"
        ) {
            saveInterviewToHistory(report);

            if (
                typeof displayInterviewHistory ===
                "function"
            ) {
                displayInterviewHistory();
            }

            console.log(
                "Interview saved to history."
            );
        }
    }

    function watchForCompletion() {
        const complete =
            document.getElementById(
                "mockComplete"
            );

        if (!complete) {
            return;
        }

        const observer =
            new MutationObserver(function () {
                if (
                    !complete.classList.contains(
                        "hidden"
                    )
                ) {
                    setTimeout(
                        saveCompletedInterviewToHistory,
                        100
                    );
                }
            });

        observer.observe(complete, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            watchForCompletion
        );
    } else {
        watchForCompletion();
    }
})();

// ------------------------------------------------------------
// LOAD SAVED INTERVIEW HISTORY ON PAGE LOAD
// ------------------------------------------------------------

(function () {
    function loadHistoryOnPage() {
        if (
            typeof displayInterviewHistory ===
            "function"
        ) {
            displayInterviewHistory();
        }
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            loadHistoryOnPage
        );
    } else {
        loadHistoryOnPage();
    }
})();
