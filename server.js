const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));


// =========================================================
// SKILLS DATABASE
// =========================================================

const skills = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "c",
    "c#",
    "html",
    "css",
    "react",
    "node.js",
    "nodejs",
    "express",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "git",
    "github",
    "api",
    "data structures",
    "algorithms",
    "machine learning",
    "artificial intelligence",
    "docker",
    "aws",
    "azure",
    "linux",
    "bash",
    "flask",
    "django",
    "spring",
    "next.js",
    "rest",
    "rest api",
    "graphql",
    "firebase",
    "figma"
];


// =========================================================
// HELPER FUNCTIONS
// =========================================================

function findSkills(text = "") {

    const lower = text.toLowerCase();

    return skills.filter(skill =>
        lower.includes(skill)
    );
}


function uniqueSkills(skillList) {

    return [...new Set(skillList)];
}


function getInterviewTypeName(type) {

    if (type === "internship") {
        return "Internship";
    }

    if (type === "part-time") {
        return "Part-Time Job";
    }

    return "Full-Time Job";
}


function getDifficulty(type) {

    if (type === "internship") {
        return "Beginner";
    }

    if (type === "part-time") {
        return "Beginner–Intermediate";
    }

    return "Intermediate–Advanced";
}


function getPriority(missingSkills) {

    if (missingSkills.length >= 4) {
        return "High";
    }

    if (missingSkills.length >= 2) {
        return "Medium";
    }

    return "Low";
}


// =========================================================
// JOB REQUIREMENT DETECTION
// =========================================================

function detectJobRequirements(jobDescription) {

    const detected = findSkills(jobDescription);

    return uniqueSkills(detected);
}


// =========================================================
// MATCH ANALYSIS
// =========================================================

function analyzeMatches(resumeSkills, jobSkills) {

    const strongMatches = jobSkills.filter(skill =>
        resumeSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
        !resumeSkills.includes(skill)
    );

    return {
        strongMatches,
        missingSkills
    };
}


// =========================================================
// READINESS SCORE
// =========================================================

function calculateReadiness(
    jobSkills,
    strongMatches,
    missingSkills
) {

    if (jobSkills.length === 0) {
        return 50;
    }

    const matchRatio =
        strongMatches.length /
        jobSkills.length;

    let score =
        Math.round(matchRatio * 100);

    /*
      Keep the score realistic.
      This is a preparation estimate,
      NOT an actual hiring prediction.
    */

    if (score < 20) {
        score = 20;
    }

    if (score > 100) {
        score = 100;
    }

    return score;
}


// =========================================================
// LIKELY INTERVIEW TOPICS
// =========================================================

function generateLikelyTopics(
    strongMatches,
    missingSkills,
    projects
) {

    const topics = [];

    strongMatches
        .slice(0, 5)
        .forEach(skill => {
            topics.push(skill);
        });


    if (projects && projects.trim()) {
        topics.push("Projects");
    }


    topics.push("Problem Solving");


    if (
        strongMatches.includes("api") ||
        strongMatches.includes("rest") ||
        strongMatches.includes("rest api")
    ) {
        topics.push("APIs");
    }


    if (
        strongMatches.includes("sql") ||
        strongMatches.includes("mysql") ||
        strongMatches.includes("postgresql")
    ) {
        topics.push("Databases");
    }


    if (
        strongMatches.includes("data structures") ||
        strongMatches.includes("algorithms")
    ) {
        topics.push("Data Structures & Algorithms");
    }


    return uniqueSkills(topics).slice(0, 8);
}


// =========================================================
// PREPARATION PRIORITIES
// =========================================================

function generatePreparationPriorities(
    strongMatches,
    missingSkills,
    projects
) {

    const priorities = [];


    if (missingSkills.length > 0) {

        priorities.push(
            `Review ${missingSkills
                .slice(0, 3)
                .join(", ")}`
        );
    }


    if (strongMatches.length > 0) {

        priorities.push(
            `Prepare concrete examples using ${strongMatches
                .slice(0, 3)
                .join(", ")}`
        );
    }


    if (projects && projects.trim()) {

        priorities.push(
            "Be ready to explain your projects, technical decisions, challenges, and results."
        );

    } else {

        priorities.push(
            "Prepare 1–2 strong project examples that demonstrate your technical skills."
        );
    }


    priorities.push(
        "Practice explaining technical concepts clearly without relying on memorized answers."
    );


    priorities.push(
        "Prepare behavioral answers using the STAR structure."
    );


    return priorities;
}


// =========================================================
// MAIN LOCAL ANALYSIS
// =========================================================

function performLocalAnalysis({
    resume,
    jobDescription,
    projects,
    interviewType
}) {

    const resumeSkills =
        uniqueSkills(
            findSkills(resume)
        );


    const jobSkills =
        detectJobRequirements(
            jobDescription
        );


    const projectSkills =
        uniqueSkills(
            findSkills(projects)
        );


    const allCandidateSkills =
        uniqueSkills([
            ...resumeSkills,
            ...projectSkills
        ]);


    const {
        strongMatches,
        missingSkills
    } =
        analyzeMatches(
            allCandidateSkills,
            jobSkills
        );


    const readiness =
        calculateReadiness(
            jobSkills,
            strongMatches,
            missingSkills
        );


    const likelyTopics =
        generateLikelyTopics(
            strongMatches,
            missingSkills,
            projects
        );


    const preparationPriorities =
        generatePreparationPriorities(
            strongMatches,
            missingSkills,
            projects
        );


    return {

        interviewType:
            getInterviewTypeName(
                interviewType
            ),

        difficulty:
            getDifficulty(
                interviewType
            ),

        readiness,

        candidateSkills:
            allCandidateSkills,

        jobRequirements:
            jobSkills,

        strongMatches,

        missingSkills,

        likelyTopics,

        preparationPriorities,

        source:
            "local-analysis"

    };
}


// =========================================================
// ROOT
// =========================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message:
            "InterviewCoach AI server is running!"
    });

});


// =========================================================
// ANALYSIS API
// =========================================================

app.post("/analyze", (req, res) => {

    try {

        const {
            resume,
            jobDescription,
            projects,
            interviewType
        } = req.body;


        if (!resume || !resume.trim()) {

            return res.status(400).json({
                success: false,
                error:
                    "Resume is required."
            });

        }


        if (
            !jobDescription ||
            !jobDescription.trim()
        ) {

            return res.status(400).json({
                success: false,
                error:
                    "Job description is required."
            });

        }


        if (!interviewType) {

            return res.status(400).json({
                success: false,
                error:
                    "Interview type is required."
            });

        }


        const analysis =
            performLocalAnalysis({
                resume,
                jobDescription,
                projects:
                    projects || "",
                interviewType
            });


        res.json({

            success: true,

            analysis

        });

    }


    catch (error) {

        console.error(
            "Analysis error:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Local analysis failed."

        });

    }

});


// =========================================================
// SERVER
// =========================================================

app.listen(3000, () => {

    console.log(
        "InterviewCoach AI server running at http://localhost:3000"
    );

});