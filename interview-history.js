// ------------------------------------------------------------
// INTERVIEW HISTORY — MILESTONE 10
// Stores and displays completed mock interviews.
// ------------------------------------------------------------

const INTERVIEW_HISTORY_KEY = "interviewCoachHistory";

function getInterviewHistory() {
    try {
        return JSON.parse(
            localStorage.getItem(INTERVIEW_HISTORY_KEY)
        ) || [];
    } catch (error) {
        console.error(
            "Could not read interview history:",
            error
        );
        return [];
    }
}

function saveInterviewToHistory(report) {
    const history = getInterviewHistory();

    const interview = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        interviewType:
            report.interviewType || "General",
        score:
            Number(report.score || 0),
        totalQuestions:
            Number(report.totalQuestions || 0),
        answered:
            Number(report.answered || 0),
        skipped:
            Number(report.skipped || 0),
        strengths:
            report.strengths || [],
        improvements:
            report.improvements || []
    };

    history.unshift(interview);

    localStorage.setItem(
        INTERVIEW_HISTORY_KEY,
        JSON.stringify(history)
    );

    displayInterviewHistory();
}

function displayInterviewHistory() {
    let historySection =
        document.getElementById(
            "interviewHistory"
        );

    if (!historySection) {
        historySection =
            document.createElement("section");

        historySection.id =
            "interviewHistory";

        historySection.className =
            "card";

        const mockInterview =
            document.getElementById(
                "mockInterview"
            );

        const finalReport =
            document.getElementById(
                "finalInterviewReport"
            );

        if (finalReport) {
            finalReport.after(historySection);
        } else if (mockInterview) {
            mockInterview.after(historySection);
        } else {
            document.body.appendChild(
                historySection
            );
        }
    }

    const history =
        getInterviewHistory();

    if (history.length === 0) {
        historySection.innerHTML = `
            <div class="history-header">
                <div>
                    <h2>
                        <span class="step-index">08</span>
                        Interview History
                    </h2>
                    <p>
                        Your completed mock interviews
                        will appear here.
                    </p>
                </div>
            </div>

            <div class="feedback-card">
                <p>
                    No completed interviews yet.
                    Finish a mock interview to start
                    building your history.
                </p>
            </div>
        `;

        return;
    }

    historySection.innerHTML = `
        <div class="history-header">
            <div>
                <h2>
                    <span class="step-index">08</span>
                    Interview History
                </h2>
                <p>
                    Review your previous interview
                    performance.
                </p>
            </div>

            <button
                type="button"
                class="secondary-button"
                id="clearInterviewHistory"
            >
                🗑️ Clear History
            </button>
        </div>

        <div class="interview-history-list">
            ${history.map((interview, index) => `
                <div class="analysis-card interview-history-card">

                    <div class="history-card-top">
                        <div>
                            <h3>
                                Interview ${history.length - index}
                            </h3>

                            <p class="history-date">
                                📅 ${interview.date}
                            </p>
                        </div>

                        <div class="history-score">
                            ${interview.score}/10
                        </div>
                    </div>

                    <div class="history-details">

                        <div>
                            <strong>Interview Type</strong>
                            <span>
                                ${interview.interviewType}
                            </span>
                        </div>

                        <div>
                            <strong>Questions</strong>
                            <span>
                                ${interview.totalQuestions}
                            </span>
                        </div>

                        <div>
                            <strong>Answered</strong>
                            <span>
                                ${interview.answered}
                            </span>
                        </div>

                        <div>
                            <strong>Skipped</strong>
                            <span>
                                ${interview.skipped}
                            </span>
                        </div>

                    </div>

                    <div class="history-feedback">

                        <div>
                            <h4>✅ Strengths</h4>
                            <ul>
                                ${
                                    interview.strengths
                                        .map(
                                            item =>
                                                `<li>${item}</li>`
                                        )
                                        .join("")
                                }
                            </ul>
                        </div>

                        <div>
                            <h4>⚠️ Areas to Improve</h4>
                            <ul>
                                ${
                                    interview.improvements
                                        .map(
                                            item =>
                                                `<li>${item}</li>`
                                        )
                                        .join("")
                                }
                            </ul>
                        </div>

                    </div>

                </div>
            `).join("")}
        </div>
    `;

    const clearButton =
        document.getElementById(
            "clearInterviewHistory"
        );

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearInterviewHistory
        );
    }
}

function clearInterviewHistory() {
    const confirmed =
        window.confirm(
            "Are you sure you want to delete all interview history?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        INTERVIEW_HISTORY_KEY
    );

    displayInterviewHistory();
}

window.getInterviewHistory =
    getInterviewHistory;

window.saveInterviewToHistory =
    saveInterviewToHistory;

window.displayInterviewHistory =
    displayInterviewHistory;

window.clearInterviewHistory =
    clearInterviewHistory;

console.log(
    "Interview History loaded."
);
