// ------------------------------------------------------------
// PROGRESS DASHBOARD — MILESTONE 11
// ------------------------------------------------------------

const PROGRESS_DASHBOARD_ID = "progressDashboard";

function getProgressData() {
    if (typeof getInterviewHistory !== "function") {
        return {
            interviews: [],
            totalInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            totalAnswered: 0,
            totalSkipped: 0
        };
    }

    const interviews = getInterviewHistory();

    if (interviews.length === 0) {
        return {
            interviews: [],
            totalInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            totalAnswered: 0,
            totalSkipped: 0
        };
    }

    const scores = interviews.map(
        interview => Number(interview.score) || 0
    );

    const totalScore = scores.reduce(
        (sum, score) => sum + score,
        0
    );

    const totalAnswered = interviews.reduce(
        (sum, interview) =>
            sum + (Number(interview.answered) || 0),
        0
    );

    const totalSkipped = interviews.reduce(
        (sum, interview) =>
            sum + (Number(interview.skipped) || 0),
        0
    );

    return {
        interviews,
        totalInterviews: interviews.length,
        averageScore:
            Math.round(
                (totalScore / interviews.length) * 10
            ) / 10,
        bestScore: Math.max(...scores),
        totalAnswered,
        totalSkipped
    };
}

function getImprovementData() {
    const data = getProgressData();

    if (data.interviews.length < 2) {
        return {
            hasEnoughData: false,
            message:
                "Complete at least two interviews to measure improvement."
        };
    }

    const interviews =
        data.interviews.slice().reverse();

    const firstScore =
        Number(interviews[0].score) || 0;

    const latestScore =
        Number(
            interviews[interviews.length - 1].score
        ) || 0;

    const change =
        Math.round(
            (latestScore - firstScore) * 10
        ) / 10;

    let message;

    if (change > 0) {
        message =
            `Your score has improved by ${change} points since your first interview. Keep going!`;
    } else if (change < 0) {
        message =
            `Your latest score is ${Math.abs(change)} points below your first score. Focus on the areas marked for improvement.`;
    } else {
        message =
            "Your score is currently the same as your first interview. Keep practicing for improvement.";
    }

    return {
        hasEnoughData: true,
        firstScore,
        latestScore,
        change,
        message
    };
}

function displayProgressDashboard() {
    let dashboard =
        document.getElementById(
            PROGRESS_DASHBOARD_ID
        );

    if (!dashboard) {
        dashboard =
            document.createElement("section");

        dashboard.id =
            PROGRESS_DASHBOARD_ID;

        dashboard.className =
            "card";

        const history =
            document.getElementById(
                "interviewHistory"
            );

        if (history) {
            history.before(dashboard);
        } else {
            document.body.appendChild(
                dashboard
            );
        }
    }

    const data =
        getProgressData();

    const improvement =
        getImprovementData();

    dashboard.innerHTML = `
        <div class="history-header">
            <div>
                <h2>
                    <span class="step-index">09</span>
                    Progress Dashboard
                </h2>

                <p>
                    Track your interview preparation
                    and performance over time.
                </p>
            </div>
        </div>

        ${
            data.totalInterviews === 0
                ? `
                    <div class="feedback-card">
                        <p>
                            Complete your first mock
                            interview to start tracking
                            your progress.
                        </p>
                    </div>
                `
                : `
                    <div class="dashboard-grid">

                        <div class="analysis-card">
                            <h3>🎯 Interviews</h3>
                            <div class="dashboard-number">
                                ${data.totalInterviews}
                            </div>
                            <p>Completed</p>
                        </div>

                        <div class="analysis-card">
                            <h3>📊 Average Score</h3>
                            <div class="dashboard-number">
                                ${data.averageScore}/10
                            </div>
                            <p>Across all interviews</p>
                        </div>

                        <div class="analysis-card">
                            <h3>🏆 Best Score</h3>
                            <div class="dashboard-number">
                                ${data.bestScore}/10
                            </div>
                            <p>Personal best</p>
                        </div>

                        <div class="analysis-card">
                            <h3>📝 Questions</h3>
                            <div class="dashboard-number">
                                ${data.totalAnswered}
                            </div>
                            <p>Answered</p>
                        </div>

                    </div>

                    <div class="feedback-card">
                        <h3>📈 Score Trend</h3>

                        <div class="score-trend">
                            ${
                                data.interviews
                                    .slice()
                                    .reverse()
                                    .map(
                                        (interview, index) => `
                                            <div class="trend-item">
                                                <span>
                                                    Interview ${index + 1}
                                                </span>

                                                <strong>
                                                    ${interview.score}/10
                                                </strong>
                                            </div>
                                        `
                                    )
                                    .join("")
                            }
                        </div>
                    </div>

                    <div class="feedback-card">
                        <h3>🚀 Improvement Tracking</h3>

                        ${
                            improvement.hasEnoughData
                                ? `
                                    <div class="history-details">

                                        <div>
                                            <strong>
                                                First Score
                                            </strong>
                                            <span>
                                                ${improvement.firstScore}/10
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                Latest Score
                                            </strong>
                                            <span>
                                                ${improvement.latestScore}/10
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                Change
                                            </strong>
                                            <span>
                                                ${
                                                    improvement.change > 0
                                                        ? "+"
                                                        : ""
                                                }${improvement.change}
                                            </span>
                                        </div>

                                    </div>

                                    <p>
                                        ${improvement.message}
                                    </p>
                                `
                                : `
                                    <p>
                                        ${improvement.message}
                                    </p>
                                `
                        }
                    </div>

                    <div class="feedback-card">
                        <h3>📚 Practice Summary</h3>

                        <p>
                            You have answered
                            <strong>
                                ${data.totalAnswered}
                            </strong>
                            questions and skipped
                            <strong>
                                ${data.totalSkipped}
                            </strong>.
                        </p>

                        <p>
                            Keep practicing to improve
                            your consistency and overall
                            interview performance.
                        </p>
                    </div>
                `
        }
    `;
}

window.getProgressData =
    getProgressData;

window.getImprovementData =
    getImprovementData;

window.displayProgressDashboard =
    displayProgressDashboard;

console.log(
    "Progress Dashboard loaded."
);

// Display dashboard after page loads.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        displayProgressDashboard
    );
} else {
    displayProgressDashboard();
}
