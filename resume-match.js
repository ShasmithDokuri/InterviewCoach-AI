// ============================================================
// RESUME ↔ JOB DESCRIPTION MATCH — MILESTONE 9
// ============================================================

(function () {
    "use strict";

    // ------------------------------------------------------------
    // Skill definitions
    // ------------------------------------------------------------

    const skills = [
        "python",
        "javascript",
        "typescript",
        "java",
        "c++",
        "c#",
        "c",
        "sql",
        "html",
        "css",
        "react",
        "node.js",
        "node",
        "express",
        "git",
        "github",
        "docker",
        "aws",
        "azure",
        "machine learning",
        "artificial intelligence",
        "data analysis",
        "data structures",
        "algorithms",
        "object oriented programming",
        "rest api",
        "api",
        "database",
        "mongodb",
        "mysql",
        "postgresql",
        "linux",
        "cloud",
        "agile",
        "scrum",
        "testing",
        "debugging"
    ];


    // ------------------------------------------------------------
    // Safely check whether a skill appears as a real term
    // ------------------------------------------------------------

    function containsSkill(text, skill) {

        if (!text) {
            return false;
        }

        const normalizedText = text.toLowerCase();


        // C must be a standalone programming language.
        if (skill === "c") {
            return /(^|[^a-z0-9+#])c([^a-z0-9+#]|$)/i.test(
                normalizedText
            );
        }


        // C++
        if (skill === "c++") {
            return /(^|[^a-z0-9])c\+\+([^a-z0-9]|$)/i.test(
                normalizedText
            );
        }


        // C#
        if (skill === "c#") {
            return /(^|[^a-z0-9])c#([^a-z0-9]|$)/i.test(
                normalizedText
            );
        }


        // Node.js
        if (skill === "node.js") {
            return /(^|[^a-z0-9])node\.js([^a-z0-9]|$)/i.test(
                normalizedText
            );
        }


        // Everything else
        const escapedSkill = skill.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const pattern = new RegExp(
            `(^|[^a-z0-9])${escapedSkill}([^a-z0-9]|$)`,
            "i"
        );

        return pattern.test(normalizedText);
    }


    // ------------------------------------------------------------
    // Analyze Resume vs Job Description
    // ------------------------------------------------------------

    function analyzeResumeJobMatch(resumeText, jobDescription) {

        const resume = resumeText.toLowerCase();
        const job = jobDescription.toLowerCase();


        // Find ONLY skills mentioned in the job.
        const jobSkills = skills.filter(function (skill) {
            return containsSkill(job, skill);
        });


        // Find which required skills are also in the resume.
        const matchingSkills = jobSkills.filter(function (skill) {
            return containsSkill(resume, skill);
        });


        // Find required skills missing from resume.
        const missingSkills = jobSkills.filter(function (skill) {
            return !containsSkill(resume, skill);
        });


        // --------------------------------------------------------
        // Technical skill score
        // --------------------------------------------------------

        const skillScore = jobSkills.length > 0
            ? (matchingSkills.length / jobSkills.length) * 100
            : 0;


        // --------------------------------------------------------
        // Job keywords
        // --------------------------------------------------------

        const keywords = [
            "internship",
            "software",
            "developer",
            "engineer",
            "programming",
            "team",
            "leadership",
            "communication",
            "problem solving",
            "problem-solving",
            "research",
            "analysis",
            "development",
            "design",
            "testing",
            "deployment",
            "experience"
        ];


        const jobKeywords = keywords.filter(function (keyword) {
            return job.includes(keyword);
        });


        const matchingKeywords = jobKeywords.filter(function (keyword) {
            return resume.includes(keyword);
        });


        const keywordScore = jobKeywords.length > 0
            ? (matchingKeywords.length / jobKeywords.length) * 100
            : 0;


        // --------------------------------------------------------
        // Experience / project relevance
        // --------------------------------------------------------

        const experienceTerms = [
            "project",
            "experience",
            "internship",
            "developed",
            "built",
            "created",
            "implemented",
            "designed",
            "team"
        ];


        const relevantExperience = experienceTerms.filter(function (term) {
            return resume.includes(term) && job.includes(term);
        });


        const experienceScore = experienceTerms.length > 0
            ? (relevantExperience.length / experienceTerms.length) * 100
            : 0;


        // --------------------------------------------------------
        // Final score
        // --------------------------------------------------------

        let score = 0;

        if (jobSkills.length > 0) {

            score = Math.round(
                (skillScore * 0.60) +
                (keywordScore * 0.25) +
                (experienceScore * 0.15)
            );

        } else {

            score = Math.round(
                (keywordScore * 0.70) +
                (experienceScore * 0.30)
            );
        }


        return {
            score: score,
            jobSkills: jobSkills,
            matchingSkills: matchingSkills,
            missingSkills: missingSkills,
            keywords: jobKeywords,
            matchingKeywords: matchingKeywords
        };
    }


    // ------------------------------------------------------------
    // Display the Resume Match Report
    // ------------------------------------------------------------

    function displayResumeJobMatch() {

        const resumeElement = document.getElementById("resume");
        const jobElement = document.getElementById("jobDescription");


        if (!resumeElement || !jobElement) {
            alert("Resume or Job Description field was not found.");
            return;
        }


        const resumeText = resumeElement.value.trim();
        const jobDescription = jobElement.value.trim();


        if (!resumeText) {
            alert("Please upload or enter your resume first.");
            return;
        }


        if (!jobDescription) {
            alert("Please enter a job description first.");
            return;
        }


        const result = analyzeResumeJobMatch(
            resumeText,
            jobDescription
        );


        let report = document.getElementById(
            "resumeJobMatchReport"
        );


        if (!report) {

            report = document.createElement("section");

            report.id = "resumeJobMatchReport";

            report.style.marginTop = "30px";

            const analysisSection =
                document.getElementById("analysis");


            if (analysisSection) {

                analysisSection.insertAdjacentElement(
                    "afterend",
                    report
                );

            } else {

                const container =
                    document.querySelector(".container");

                if (container) {
                    container.appendChild(report);
                } else {
                    document.body.appendChild(report);
                }
            }
        }


        // --------------------------------------------------------
        // Match level
        // --------------------------------------------------------

        let matchLevel;
        let matchMessage;


        if (result.score >= 80) {

            matchLevel = "🟢 Strong Match";

            matchMessage =
                "Your resume matches most of the important requirements for this job.";

        } else if (result.score >= 50) {

            matchLevel = "🟡 Moderate Match";

            matchMessage =
                "Your resume matches some important requirements, but there are areas you can improve.";

        } else {

            matchLevel = "🔴 Needs Improvement";

            matchMessage =
                "Your resume is missing several important requirements from this job.";
        }


        // --------------------------------------------------------
        // Matching skills HTML
        // --------------------------------------------------------

        const matchingHTML =
            result.matchingSkills.length > 0

                ? result.matchingSkills
                    .map(function (skill) {
                        return `<li>✓ ${skill}</li>`;
                    })
                    .join("")

                : "<li>No matching skills found</li>";


        // --------------------------------------------------------
        // Missing skills HTML
        // --------------------------------------------------------

        const missingHTML =
            result.missingSkills.length > 0

                ? result.missingSkills
                    .map(function (skill) {
                        return `<li>• ${skill}</li>`;
                    })
                    .join("")

                : "<li>No major missing skills detected</li>";


        // --------------------------------------------------------
        // Keywords HTML
        // --------------------------------------------------------

        const keywordsHTML =
            result.keywords.length > 0

                ? result.keywords
                    .map(function (keyword) {
                        return `<li>• ${keyword}</li>`;
                    })
                    .join("")

                : "<li>No major job keywords detected</li>";


        // --------------------------------------------------------
        // Report
        // --------------------------------------------------------

        report.innerHTML = `

            <div class="analysis-card">

                <h2>
                    Resume ↔ Job Description Match
                </h2>


                <div class="match-score">

                    <strong>
                        ${result.score}%
                    </strong>

                    <span>
                        Job Match
                    </span>

                </div>


                <h3>
                    ${matchLevel}
                </h3>


                <p>
                    ${matchMessage}
                </p>


                <h3>
                    Matching Skills
                </h3>

                <ul>
                    ${matchingHTML}
                </ul>


                <h3>
                    Skills to Improve
                </h3>

                <ul>
                    ${missingHTML}
                </ul>


                <h3>
                    Important Job Keywords
                </h3>

                <ul>
                    ${keywordsHTML}
                </ul>


                <p>

                    <strong>
                        Resume Advice:
                    </strong>

                    Focus your resume on the skills and
                    keywords specifically requested in
                    this job description.

                </p>

            </div>
        `;


        report.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // ------------------------------------------------------------
    // Create visible button
    // ------------------------------------------------------------

    function createResumeMatchButton() {

        if (
            document.getElementById(
                "resumeMatchButton"
            )
        ) {
            return;
        }


        const analyzeButton =
            document.getElementById(
                "analyzeButton"
            );


        if (!analyzeButton) {
            console.log(
                "Analyze button not found yet."
            );
            return;
        }


        const button =
            document.createElement("button");


        button.id =
            "resumeMatchButton";


        button.type =
            "button";


        button.textContent =
            "Match Resume to Job";


        button.style.marginTop =
            "10px";


        button.style.padding =
            "12px 20px";


        button.style.cursor =
            "pointer";


        button.addEventListener(
            "click",
            displayResumeJobMatch
        );


        analyzeButton.insertAdjacentElement(
            "afterend",
            button
        );


        console.log(
            "Resume Match button created."
        );
    }


    // ------------------------------------------------------------
    // Start after page loads
    // ------------------------------------------------------------

    window.addEventListener(
        "load",
        function () {

            createResumeMatchButton();

        }
    );


    // Make functions available to the page.
    window.analyzeResumeJobMatch =
        analyzeResumeJobMatch;

    window.displayResumeJobMatch =
        displayResumeJobMatch;


    console.log(
        "Resume ↔ Job Description Match loaded."
    );

})();
