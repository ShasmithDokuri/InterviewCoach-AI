// ==========================================
// INTERVIEWCOACH AI
// MILESTONE 4 — BETTER ANSWER COACHING
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const resumeFile = document.getElementById("resumeFile");
const resume = document.getElementById("resume");
const jobDescription = document.getElementById("jobDescription");
const projects = document.getElementById("projects");
const interviewType = document.getElementById("interviewType");

const analyzeButton = document.getElementById("analyzeButton");
const uploadStatus = document.getElementById("uploadStatus");
const result = document.getElementById("result");

const analysis = document.getElementById("analysis");
const analysisContent = document.getElementById("analysisContent");

const questions = document.getElementById("questions");
const questionContent = document.getElementById("questionContent");

const answers = document.getElementById("answers");
const answerContent = document.getElementById("answerContent");

const mockStart = document.getElementById("mockStart");
const mockSession = document.getElementById("mockSession");
const mockComplete = document.getElementById("mockComplete");

const startMockButton =
    document.getElementById("startMockButton");

const submitMockAnswer =
    document.getElementById("submitMockAnswer");

const skipMockQuestion =
    document.getElementById("skipMockQuestion");

const restartMockButton =
    document.getElementById("restartMockButton");

const mockQuestion =
    document.getElementById("mockQuestion");

const mockQuestionNumber =
    document.getElementById("mockQuestionNumber");

const mockAnswer =
    document.getElementById("mockAnswer");

const mockScore =
    document.getElementById("mockScore");

const startRecordingButton =
    document.getElementById("startRecordingButton");

const stopRecordingButton =
    document.getElementById("stopRecordingButton");

const recordingStatus =
    document.getElementById("recordingStatus");

const audioPreview =
    document.getElementById("audioPreview");


// ==========================================
// APPLICATION STATE
// ==========================================

let generatedQuestions = [];

let currentQuestion = 0;

let interviewAnswers = [];


// ==========================================
// AUDIO RECORDING STATE
// ==========================================

let mediaRecorder = null;
let recordingStream = null;
let audioChunks = [];
let audioBlob = null;


// ==========================================
// SPEECH RECOGNITION STATE
// ==========================================

let speechRecognition = null;
let isSpeechRecognizing = false;
let finalTranscript = "";
let speechSupported = false;


// ==========================================
// SPEECH RECOGNITION SETUP
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    speechSupported = true;

    speechRecognition =
        new SpeechRecognition();

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";


    speechRecognition.onstart =
        function () {

            isSpeechRecognizing = true;

            recordingStatus.textContent =
                "🔴 Listening... Speak clearly.";
        };


    speechRecognition.onresult =
        function (event) {

            let interimTranscript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const transcript =
                    event.results[i][0].transcript;

                if (event.results[i].isFinal) {

                    finalTranscript +=
                        transcript + " ";
                }

                else {

                    interimTranscript +=
                        transcript;
                }
            }

            mockAnswer.value =
                finalTranscript +
                interimTranscript;
        };


    speechRecognition.onerror =
        function (event) {

            console.error(
                "Speech recognition error:",
                event.error
            );

            if (
                event.error ===
                "not-allowed"
            ) {

                recordingStatus.textContent =
                    "Microphone permission was denied.";
            }

            else if (
                event.error ===
                "no-speech"
            ) {

                recordingStatus.textContent =
                    "No speech detected. Please try again.";
            }

            else {

                recordingStatus.textContent =
                    "Speech recognition error. Please try again.";
            }
        };


    speechRecognition.onend =
        function () {

            isSpeechRecognizing = false;
        };
}


// ==========================================
// RESUME PDF UPLOAD
// ==========================================

if (resumeFile) {

    resumeFile.addEventListener(
        "change",
        async function () {

            const file =
                resumeFile.files[0];

            if (!file) {
                return;
            }


            if (
                file.type !==
                "application/pdf"
            ) {

                uploadStatus.textContent =
                    "Please upload a PDF file.";

                return;
            }


            uploadStatus.textContent =
                "Reading resume...";


            try {

                const data =
                    await file.arrayBuffer();


                const pdf =
                    await pdfjsLib.getDocument({
                        data: data
                    }).promise;


                let text = "";


                for (
                    let page = 1;
                    page <= pdf.numPages;
                    page++
                ) {

                    const pdfPage =
                        await pdf.getPage(page);


                    const content =
                        await pdfPage.getTextContent();


                    text +=
                        content.items
                            .map(
                                item => item.str
                            )
                            .join(" ") +
                        "\n";
                }


                resume.value =
                    text;


                uploadStatus.textContent =
                    "Resume uploaded successfully.";

            }

            catch (error) {

                console.error(error);

                uploadStatus.textContent =
                    "Could not read the PDF.";
            }
        }
    );
}


// ==========================================
// SKILLS DATABASE
// ==========================================

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
    "bash"
];


// ==========================================
// FIND SKILLS
// ==========================================

function findSkills(text) {

    const lower =
        text.toLowerCase();

    return skills.filter(
        skill =>
            lower.includes(skill)
    );
}


// ==========================================
// DIFFICULTY
// ==========================================

function getDifficulty(type) {

    if (
        type ===
        "internship"
    ) {

        return "Beginner";
    }


    if (
        type ===
        "part-time"
    ) {

        return "Beginner–Intermediate";
    }


    return "Intermediate–Advanced";
}


// ==========================================
// TEXT HELPERS
// ==========================================

function cleanText(text) {

    return text
        .replace(/\s+/g, " ")
        .trim();
}


function shortenText(text, maxLength = 180) {

    const cleaned =
        cleanText(text);

    if (
        cleaned.length <=
        maxLength
    ) {

        return cleaned;
    }

    return (
        cleaned.substring(
            0,
            maxLength
        ) + "..."
    );
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// PERSONALIZATION HELPERS
// ==========================================

function getRelevantResumeEvidence(
    resumeText
) {

    const lines =
        resumeText
            .split(/\n+/)
            .map(line => cleanText(line))
            .filter(line => line.length > 20);

    return lines.slice(0, 3);
}


function getProjectEvidence(
    projectText
) {

    if (!projectText) {

        return "";
    }

    return shortenText(
        projectText,
        220
    );
}


function projectName(
    projectText
) {

    if (!projectText) {

        return "your project";
    }

    const firstLine =
        projectText
            .split("\n")
            .map(line => cleanText(line))
            .find(line => line.length > 2);

    return firstLine
        ? shortenText(firstLine, 80)
        : "your project";
}


// ==========================================
// QUESTION COACHING ENGINE
// ==========================================

function buildTechnicalCoaching(
    question,
    skill,
    resumeText,
    projectText
) {

    const experience =
        resumeText.toLowerCase()
            .includes(skill.toLowerCase());

    const projectEvidence =
        getProjectEvidence(projectText);


    let strongAnswer;

    if (experience) {

        strongAnswer =
            `I have worked with ${skill} through my coursework and projects. ` +
            `I focused on understanding the fundamentals first and then applying them to a practical problem. ` +
            `For example, I used ${skill} when working on ${projectEvidence || "one of my projects"}. ` +
            `I was responsible for my part of the implementation, tested the solution, and learned how to make the technology work reliably. ` +
            `The main thing I took away was how to apply ${skill} rather than only knowing the theory.`;
    }

    else {

        strongAnswer =
            `I have learned the fundamentals of ${skill}, although I would be careful not to overstate my experience. ` +
            `I understand the main concepts and would explain how I would apply them to a practical problem. ` +
            `If the role requires deeper experience, I would be honest about what I know and explain how I would quickly build the missing knowledge.`;
    }


    return {

        text: question,

        reason:
            `The interviewer wants to determine whether you genuinely understand ${skill} and can connect technical knowledge to practical work.`,

        strongAnswer: strongAnswer,

        whyItWorks:
            `It demonstrates knowledge, personal experience, practical application, and honest communication instead of simply listing ${skill} as a keyword.`,

        avoid:
            `Do not say only "I know ${skill}" or repeat a textbook definition. Do not claim experience you do not actually have.`,

        personalize:
            `Mention the specific project, assignment, feature, or coursework where you actually used ${skill}. Explain what YOU implemented, what problem you faced, and what you learned.`,

        structure:
            "Concept → Application → Your Contribution → Result/Learning"
    };
}


// ==========================================
// RESUME COACHING
// ==========================================

function buildResumeCoaching(
    question,
    resumeText
) {

    const evidence =
        getRelevantResumeEvidence(
            resumeText
        );


    let example;

    if (
        question.toLowerCase()
            .includes("walk me through")
    ) {

        example =
            `I would organize my resume from the most relevant experiences to the current position. ` +
            `I would briefly explain my education, technical skills, projects, and any relevant experience. ` +
            `For each important experience, I would focus on what I did, the skills I developed, and the result. ` +
            `I would finish by connecting those experiences to why I am interested in this role.`;
    }

    else {

        example =
            `The experience I would highlight is the one that best demonstrates skills relevant to this position. ` +
            `I would explain the problem or goal, what I personally contributed, the technologies or skills I used, and the result. ` +
            `I would also explain what I learned and how that experience prepared me for this position.`;
    }


    if (evidence.length > 0) {

        example +=
            ` One piece of evidence from your resume that you can use is: "${shortenText(evidence[0], 150)}"`;
    }


    return {

        text: question,

        reason:
            "The interviewer wants to verify that you understand your own resume and can explain your experiences clearly.",

        strongAnswer:
            example,

        whyItWorks:
            "It creates a clear story instead of simply reading the resume line by line. It also connects past experience to the position.",

        avoid:
            "Do not read your resume word-for-word, list every item without explanation, or claim responsibility for work you did not personally perform.",

        personalize:
            "Choose two or three experiences that are most relevant to the job. Add specific technologies, responsibilities, challenges, and results from your actual experience.",

        structure:
            "Background → Relevant Experience → Skills → Results → Connection to Role"
    };
}


// ==========================================
// PROJECT COACHING
// ==========================================

function buildProjectCoaching(
    question,
    projectText
) {

    const name =
        projectName(projectText);

    const evidence =
        getProjectEvidence(projectText);


    let example;


    if (
        question.toLowerCase()
            .includes("walk me through")
    ) {

        example =
            `One project I would discuss is ${name}. ` +
            `The goal was to solve a specific problem, and I would first explain the problem and why it mattered. ` +
            `Then I would describe the technologies I used, my personal responsibilities, the main challenge, and how I tested the solution. ` +
            `Finally, I would explain the result and what I learned from building it.`;
    }

    else if (
        question.toLowerCase()
            .includes("problem")
    ) {

        example =
            `The problem I focused on was making the project useful for its intended purpose. ` +
            `I first broke the problem into smaller parts, identified the main technical requirements, and then implemented and tested each part. ` +
            `When something did not work, I investigated the cause instead of changing things randomly. ` +
            `The experience taught me how important structured problem-solving is in software development.`;
    }

    else {

        example =
            `The biggest challenge was identifying why something was not working as expected. ` +
            `I isolated the problem, tested possible causes, changed the implementation, and verified the result. ` +
            `This improved my understanding of debugging and showed me the importance of testing each part of a project.`;
    }


    if (evidence) {

        example +=
            ` Your project notes mention: "${shortenText(evidence, 150)}" Use that only if it accurately describes your own work.`;
    }


    return {

        text: question,

        reason:
            "The interviewer wants to see whether you genuinely built or contributed to the project and understand the decisions behind it.",

        strongAnswer:
            example,

        whyItWorks:
            "It explains the problem, your actions, technical decisions, challenges, and learning rather than only describing the final product.",

        avoid:
            "Do not say 'we built it' repeatedly without explaining your own contribution. Avoid claiming technologies or features you cannot explain.",

        personalize:
            `Use your real project name (${name}), technologies, features, your exact contribution, one challenge, and one measurable or observable result.`,

        structure:
            "Problem → Approach → Your Contribution → Challenge → Result → Learning"
    };
}


// ==========================================
// BEHAVIORAL COACHING
// ==========================================

function buildBehavioralCoaching(
    question
) {

    return {

        text: question,

        reason:
            "The interviewer wants evidence of how you behave in real situations, especially communication, teamwork, ownership, problem-solving, and adaptability.",

        strongAnswer:
            `Situation: Briefly describe the real situation and provide enough context. ` +
            `Task: Explain what you were responsible for. ` +
            `Action: Spend most of your answer explaining what YOU did, why you did it, and how you handled the situation. ` +
            `Result: Explain what happened because of your actions and what you learned. ` +
            `For this question, replace the template with a real experience from your coursework, project, work, or team experience.`,

        whyItWorks:
            "STAR keeps the answer organized and gives the interviewer evidence instead of vague personality claims.",

        avoid:
            `Do not say "I work well under pressure" or "I am a great team player" without an example. Do not invent a story. Do not spend most of the answer describing what other people did.`,

        personalize:
            "Choose one real situation. Keep the Situation and Task short, spend the most time on your Actions, and finish with a specific Result and lesson.",

        structure:
            "⭐ STAR: Situation → Task → Action → Result"
    };
}


// ==========================================
// CREATE QUESTION OBJECT
// ==========================================

function createQuestion(
    text,
    category,
    resumeText,
    projectText,
    skill = null
) {

    let coaching;


    if (
        category ===
        "technical"
    ) {

        coaching =
            buildTechnicalCoaching(
                text,
                skill || "the technology",
                resumeText,
                projectText
            );
    }


    else if (
        category ===
        "resume"
    ) {

        coaching =
            buildResumeCoaching(
                text,
                resumeText
            );
    }


    else if (
        category ===
        "project"
    ) {

        coaching =
            buildProjectCoaching(
                text,
                projectText
            );
    }


    else {

        coaching =
            buildBehavioralCoaching(
                text
            );
    }


    return {

        text: coaching.text,

        category: category,

        reason: coaching.reason,

        strongAnswer:
            coaching.strongAnswer,

        whyItWorks:
            coaching.whyItWorks,

        avoid: coaching.avoid,

        personalize:
            coaching.personalize,

        structure:
            coaching.structure,

        skill: skill
    };
}


// ==========================================
// GENERATE TECHNICAL QUESTIONS
// ==========================================

function generateTechnicalQuestions(
    resumeText,
    jobText,
    projectText,
    type
) {

    const resumeSkills =
        findSkills(resumeText);

    const jobSkills =
        findSkills(jobText);

    const matchingSkills =
        jobSkills.filter(
            skill =>
                resumeSkills.includes(skill)
        );


    const technical = [];


    matchingSkills
        .slice(0, 4)
        .forEach(
            skill => {

                technical.push(
                    createQuestion(
                        `Tell me about your experience with ${skill} and how you have used it.`,
                        "technical",
                        resumeText,
                        projectText,
                        skill
                    )
                );
            }
        );


    if (
        type ===
        "internship"
    ) {

        technical.push(
            createQuestion(
                "What programming concepts have you learned recently?",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How do you approach debugging a program?",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How would you learn a technology you have never used?",
                "technical",
                resumeText,
                projectText
            )
        );
    }


    else if (
        type ===
        "part-time"
    ) {

        technical.push(
            createQuestion(
                "Describe a technical problem you solved.",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How do you troubleshoot an application?",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How do you make sure your code works correctly?",
                "technical",
                resumeText,
                projectText
            )
        );
    }


    else {

        technical.push(
            createQuestion(
                "Describe a difficult technical problem you solved.",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How would you improve the performance of an application?",
                "technical",
                resumeText,
                projectText
            )
        );

        technical.push(
            createQuestion(
                "How do you choose between different technical approaches?",
                "technical",
                resumeText,
                projectText
            )
        );
    }


    return {
        questions: technical,
        matchingSkills: matchingSkills
    };
}


// ==========================================
// GENERATE RESUME QUESTIONS
// ==========================================

function generateResumeQuestions(
    resumeText,
    projectText
) {

    return [

        createQuestion(
            "Walk me through your resume.",
            "resume",
            resumeText,
            projectText
        ),

        createQuestion(
            "Which experience on your resume are you most proud of?",
            "resume",
            resumeText,
            projectText
        )

    ];
}


// ==========================================
// GENERATE PROJECT QUESTIONS
// ==========================================

function generateProjectQuestions(
    resumeText,
    projectText
) {

    return [

        createQuestion(
            "Walk me through your most important project.",
            "project",
            resumeText,
            projectText
        ),

        createQuestion(
            "What problem were you trying to solve?",
            "project",
            resumeText,
            projectText
        ),

        createQuestion(
            "What was the biggest challenge in the project?",
            "project",
            resumeText,
            projectText
        )

    ];
}


// ==========================================
// GENERATE BEHAVIORAL QUESTIONS
// ==========================================

function generateBehavioralQuestions(
    resumeText,
    projectText,
    type
) {

    let questionsList;


    if (
        type ===
        "internship"
    ) {

        questionsList = [

            "Tell me about yourself and why you want this internship.",

            "Tell me about a time you had to learn something quickly.",

            "Tell me about a time you worked with a team."

        ];
    }


    else if (
        type ===
        "part-time"
    ) {

        questionsList = [

            "Tell me about yourself and why you want this position.",

            "How do you manage competing responsibilities?",

            "Tell me about a time you helped someone solve a problem."

        ];
    }


    else {

        questionsList = [

            "Tell me about yourself and why you want this position.",

            "Tell me about a difficult problem you solved.",

            "Tell me about a time you took ownership of a task."

        ];
    }


    return questionsList.map(
        question =>
            createQuestion(
                question,
                "behavioral",
                resumeText,
                projectText
            )
    );
}


// ==========================================
// GENERATE ALL QUESTIONS
// ==========================================

function generateQuestions(
    resumeText,
    jobText,
    projectText,
    type
) {

    const technicalData =
        generateTechnicalQuestions(
            resumeText,
            jobText,
            projectText,
            type
        );


    const resumeQuestions =
        generateResumeQuestions(
            resumeText,
            projectText
        );


    const projectQuestions =
        generateProjectQuestions(
            resumeText,
            projectText
        );


    const behavioralQuestions =
        generateBehavioralQuestions(
            resumeText,
            projectText,
            type
        );


    return {

        technical:
            technicalData.questions,

        resumeQuestions:
            resumeQuestions,

        projectQuestions:
            projectQuestions,

        behavioralQuestions:
            behavioralQuestions,

        matchingSkills:
            technicalData.matchingSkills,

        difficulty:
            getDifficulty(type)
    };
}


// ==========================================
// QUESTION CARD
// ==========================================

function questionCard(
    question,
    number
) {

    return `

        <div class="question-card">

            <div class="question-number">
                Question ${number}
            </div>


            <h3>
                ${escapeHTML(question.text)}
            </h3>


            <div class="answer-guide">

                <strong>
                    🎯 What the interviewer is testing
                </strong>

                <p>
                    ${escapeHTML(question.reason)}
                </p>

            </div>


            <div class="example-answer">

                <strong>
                    💡 Example Strong Answer
                </strong>

                <p>
                    ${escapeHTML(question.strongAnswer)}
                </p>

            </div>


            <div class="interviewer-wants">

                <strong>
                    🔍 Why This Answer Works
                </strong>

                <p>
                    ${escapeHTML(question.whyItWorks)}
                </p>

            </div>


            <div class="answer-guide">

                <strong>
                    🚫 What NOT to Say
                </strong>

                <p>
                    ${escapeHTML(question.avoid)}
                </p>

            </div>


            <div class="answer-guide">

                <strong>
                    ✏️ How to Personalize Your Answer
                </strong>

                <p>
                    ${escapeHTML(question.personalize)}
                </p>

            </div>


            <div class="answer-guide">

                <strong>
                    🧩 Recommended Structure
                </strong>

                <p>
                    ${escapeHTML(question.structure)}
                </p>

            </div>


            <div class="answer-warning">

                <strong>
                    ⚠️ Don't memorize the example.
                </strong>

                <p>
                    Use the structure and ideas as guidance.
                    Your answer should be based on your real experience.
                </p>

            </div>


            <div class="your-answer">

                <label>
                    📝 Practice Your Answer
                </label>

                <textarea
                    rows="6"
                    placeholder="Write your own answer using the coaching above..."
                ></textarea>

            </div>

        </div>

    `;
}


// ==========================================
// DISPLAY QUESTIONS
// ==========================================

function displayQuestions(
    data
) {

    let html = "";


    // TECHNICAL

    html += `

        <div class="question-section">

            <h2>
                Technical Questions
            </h2>

    `;


    data.technical
        .slice(0, 5)
        .forEach(
            (question, index) => {

                html +=
                    questionCard(
                        question,
                        index + 1
                    );
            }
        );


    html += "</div>";



    // RESUME

    html += `

        <div class="question-section">

            <h2>
                Resume-Based Questions
            </h2>

    `;


    data.resumeQuestions
        .forEach(
            (question, index) => {

                html +=
                    questionCard(
                        question,
                        index + 1
                    );
            }
        );


    html += "</div>";



    // PROJECT

    html += `

        <div class="question-section">

            <h2>
                Project Questions
            </h2>

    `;


    data.projectQuestions
        .forEach(
            (question, index) => {

                html +=
                    questionCard(
                        question,
                        index + 1
                    );
            }
        );


    html += "</div>";



    // BEHAVIORAL

    html += `

        <div class="question-section">

            <h2>
                Behavioral Questions
            </h2>

    `;


    data.behavioralQuestions
        .forEach(
            (question, index) => {

                html +=
                    questionCard(
                        question,
                        index + 1
                    );
            }
        );


    html += "</div>";


    questionContent.innerHTML =
        html;
}


// ==========================================
// ANALYZE BUTTON
// ==========================================

analyzeButton.addEventListener(
    "click",
    function () {

        const resumeText =
            resume.value.trim();

        const jobText =
            jobDescription.value.trim();

        const projectText =
            projects.value.trim();

        const type =
            interviewType.value;


        if (!resumeText) {

            result.textContent =
                "Please upload your resume.";

            return;
        }


        if (!jobText) {

            result.textContent =
                "Please enter the job description.";

            return;
        }


        if (!type) {

            result.textContent =
                "Please select an interview type.";

            return;
        }


        const data =
            generateQuestions(
                resumeText,
                jobText,
                projectText,
                type
            );


        generatedQuestions = [

            ...data.technical.slice(0, 3),

            ...data.resumeQuestions.slice(0, 2),

            ...data.projectQuestions.slice(0, 2),

            ...data.behavioralQuestions.slice(0, 3)

        ];


        // ANALYSIS

        analysis.classList.remove(
            "hidden"
        );


        analysisContent.innerHTML = `

            <div class="analysis-item">

                <strong>
                    Interview Type
                </strong>

                <p>
                    ${
                        type === "internship"
                        ? "Internship"
                        : type === "part-time"
                        ? "Part-Time Job"
                        : "Full-Time Job"
                    }
                </p>

            </div>


            <div class="analysis-item">

                <strong>
                    Difficulty
                </strong>

                <p>
                    ${escapeHTML(data.difficulty)}
                </p>

            </div>


            <div class="analysis-item">

                <strong>
                    Matching Skills
                </strong>

                <p>
                    ${
                        data.matchingSkills.length
                        ? data.matchingSkills
                            .map(skill =>
                                escapeHTML(skill)
                            )
                            .join(", ")
                        : "No direct matches detected."
                    }
                </p>

            </div>


            <div class="analysis-item">

                <strong>
                    Coaching Mode
                </strong>

                <p>
                    Local interview coaching is active.
                    No paid AI API is required for this milestone.
                </p>

            </div>

        `;


        // QUESTIONS

        questions.classList.remove(
            "hidden"
        );


        displayQuestions(
            data
        );


        // ANSWER GUIDE

        answers.classList.remove(
            "hidden"
        );


        answerContent.innerHTML = `

            <div class="answer-guide">

                <strong>
                    🧠 How to Use InterviewCoach
                </strong>

                <p>
                    Read the interviewer goal first.
                    Study the example for structure,
                    then create your own answer using
                    your real experience.
                </p>

            </div>


            <div class="answer-guide">

                <strong>
                    ⭐ Behavioral Questions
                </strong>

                <p>
                    Use STAR:
                    Situation → Task → Action → Result.
                    Spend most of your time explaining
                    what YOU did.
                </p>

            </div>


            <div class="answer-warning">

                <strong>
                    ⚠️ Important
                </strong>

                <p>
                    InterviewCoach is designed to coach you,
                    not give you scripts to memorize.
                    Authentic answers are stronger than
                    memorized answers.
                </p>

            </div>

        `;


        result.textContent =
            "Interview preparation generated successfully.";

    }
);


// ==========================================
// START MOCK INTERVIEW
// ==========================================

startMockButton.addEventListener(
    "click",
    function () {

        if (
            generatedQuestions.length === 0
        ) {

            alert(
                "Please analyze your interview first."
            );

            return;
        }


        currentQuestion = 0;

        interviewAnswers = [];


        mockStart.classList.add(
            "hidden"
        );

        mockComplete.classList.add(
            "hidden"
        );

        mockSession.classList.remove(
            "hidden"
        );


        showQuestion();
    }
);


// ==========================================
// SHOW MOCK QUESTION
// ==========================================

function showQuestion() {

    if (
        currentQuestion >=
        generatedQuestions.length
    ) {

        finishInterview();

        return;
    }


    const question =
        generatedQuestions[
            currentQuestion
        ];


    mockQuestionNumber.textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        generatedQuestions.length;


    mockQuestion.textContent =
        question.text;


    mockAnswer.value = "";


    resetRecording();
}


// ==========================================
// START RECORDING
// ==========================================

startRecordingButton.addEventListener(
    "click",
    async function () {

        if (!speechSupported) {

            recordingStatus.textContent =
                "Speech-to-text is not supported in this browser.";

            return;
        }


        try {

            recordingStream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            audioChunks = [];


            mediaRecorder =
                new MediaRecorder(
                    recordingStream
                );


            mediaRecorder.ondataavailable =
                function (event) {

                    if (
                        event.data.size > 0
                    ) {

                        audioChunks.push(
                            event.data
                        );
                    }
                };


            mediaRecorder.onstop =
                function () {

                    audioBlob =
                        new Blob(
                            audioChunks,
                            {
                                type:
                                    "audio/webm"
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            audioBlob
                        );


                    audioPreview.src =
                        url;


                    audioPreview.classList.remove(
                        "hidden"
                    );
                };


            mediaRecorder.start();


            finalTranscript = "";


            mockAnswer.value = "";


            speechRecognition.start();


            startRecordingButton.disabled =
                true;


            stopRecordingButton.disabled =
                false;


            recordingStatus.textContent =
                "🔴 Recording and converting speech to text...";

        }

        catch (error) {

            console.error(error);

            recordingStatus.textContent =
                "Microphone permission was denied or unavailable.";
        }
    }
);


// ==========================================
// STOP RECORDING
// ==========================================

stopRecordingButton.addEventListener(
    "click",
    function () {

        if (
            speechRecognition &&
            isSpeechRecognizing
        ) {

            speechRecognition.stop();
        }


        if (
            mediaRecorder &&
            mediaRecorder.state !==
            "inactive"
        ) {

            mediaRecorder.stop();
        }


        if (recordingStream) {

            recordingStream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );
        }


        startRecordingButton.disabled =
            false;


        stopRecordingButton.disabled =
            true;


        recordingStatus.textContent =
            "✅ Recording complete. Your transcript is ready.";
    }
);


// ==========================================
// RESET RECORDING
// ==========================================

function resetRecording() {

    if (
        speechRecognition &&
        isSpeechRecognizing
    ) {

        speechRecognition.stop();
    }


    if (recordingStream) {

        recordingStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );
    }


    audioChunks = [];

    audioBlob = null;

    finalTranscript = "";


    if (
        audioPreview.src
    ) {

        URL.revokeObjectURL(
            audioPreview.src
        );
    }


    audioPreview.src = "";


    audioPreview.classList.add(
        "hidden"
    );


    recordingStatus.textContent =
        speechSupported
        ? "Ready to record"
        : "Speech-to-text is unavailable in this browser.";


    startRecordingButton.disabled =
        false;


    stopRecordingButton.disabled =
        true;
}


// ==========================================
// ANSWER EVALUATION
// ==========================================

function evaluateAnswer(
    answer,
    question
) {

    const words =
        answer
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    const count =
        words.length;


    let score = 0;

    const strengths = [];

    const improvements = [];


    // LENGTH

    if (
        count >= 60
    ) {

        score += 3;

        strengths.push(
            "Good amount of detail."
        );
    }

    else if (
        count >= 30
    ) {

        score += 2;

        improvements.push(
            "Add a little more detail."
        );
    }

    else {

        score += 1;

        improvements.push(
            "Your answer is too short."
        );
    }


    const lower =
        answer.toLowerCase();


    // PERSONAL CONTRIBUTION

    if (
        /\bi\b/.test(lower) &&
        (
            lower.includes("i built") ||
            lower.includes("i used") ||
            lower.includes("i worked") ||
            lower.includes("i implemented") ||
            lower.includes("i created") ||
            lower.includes("i developed") ||
            lower.includes("i solved") ||
            lower.includes("i learned")
        )
    ) {

        score += 2;

        strengths.push(
            "You explained your personal contribution."
        );
    }

    else {

        improvements.push(
            "Explain what you personally did."
        );
    }


    // REASONING / EXAMPLE

    if (
        lower.includes("because") ||
        lower.includes("for example") ||
        lower.includes("problem") ||
        lower.includes("challenge") ||
        lower.includes("result") ||
        lower.includes("learned")
    ) {

        score += 2;

        strengths.push(
            "You included reasoning, an example, or learning."
        );
    }

    else {

        improvements.push(
            "Include a specific example or explain your reasoning."
        );
    }


    // EXPERIENCE

    if (
        lower.includes("project") ||
        lower.includes("course") ||
        lower.includes("class") ||
        lower.includes("team") ||
        lower.includes("experience")
    ) {

        score += 2;

        strengths.push(
            "You connected the answer to experience."
        );
    }

    else {

        improvements.push(
            "Connect your answer to a real experience."
        );
    }


    // BEHAVIORAL STAR CHECK

    if (
        question &&
        question.category ===
        "behavioral"
    ) {

        const starWords = [

            lower.includes("situation"),

            lower.includes("task"),

            lower.includes("action"),

            lower.includes("result")

        ];


        const starCount =
            starWords.filter(Boolean).length;


        if (
            starCount >= 3
        ) {

            strengths.push(
                "Your answer shows a strong STAR structure."
            );
        }

        else {

            improvements.push(
                "Use Situation → Task → Action → Result for a stronger behavioral answer."
            );
        }
    }


    return {

        score:
            Math.min(score, 10),

        strengths:
            strengths.length
            ? strengths
            : ["You attempted the question."],

        improvements:
            improvements.length
            ? improvements
            : ["Keep practicing to make your answer even stronger."]
    };
}


// ==========================================
// MOCK FEEDBACK
// ==========================================

function showFeedback(
    feedback,
    question
) {

    let box =
        document.getElementById(
            "mockFeedback"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "mockFeedback";


        mockAnswer.parentElement
            .after(box);
    }


    box.className =
        "mock-feedback";


    box.innerHTML = `

        <div class="feedback-score">

            <h3>
                Your Score: ${feedback.score}/10
            </h3>

        </div>


        <div class="feedback-section">

            <strong>
                ✅ Strengths
            </strong>

            <ul>

                ${
                    feedback.strengths
                        .map(
                            item =>
                                `<li>${escapeHTML(item)}</li>`
                        )
                        .join("")
                }

            </ul>

        </div>


        <div class="feedback-section">

            <strong>
                🔧 Improve
            </strong>

            <ul>

                ${
                    feedback.improvements
                        .map(
                            item =>
                                `<li>${escapeHTML(item)}</li>`
                        )
                        .join("")
                }

            </ul>

        </div>


        <div class="feedback-tip">

            <strong>
                💡 Coaching Tip
            </strong>

            <p>
                ${
                    question.category === "behavioral"
                    ? "Use STAR and focus most of your answer on the Action you personally took."
                    : "Be specific about what you did, why you did it, and what happened as a result."
                }
            </p>

        </div>


        <button
            id="nextQuestionButton"
            type="button"
        >
            Next Question
        </button>

    `;


    mockAnswer.disabled =
        true;


    submitMockAnswer.disabled =
        true;


    skipMockQuestion.disabled =
        true;


    startRecordingButton.disabled =
        true;


    document
        .getElementById(
            "nextQuestionButton"
        )
        .addEventListener(
            "click",
            function () {

                currentQuestion++;


                mockAnswer.disabled =
                    false;


                submitMockAnswer.disabled =
                    false;


                skipMockQuestion.disabled =
                    false;


                startRecordingButton.disabled =
                    false;


                box.remove();


                showQuestion();
            }
        );
}


// ==========================================
// SUBMIT MOCK ANSWER
// ==========================================

submitMockAnswer.addEventListener(
    "click",
    function () {

        const answer =
            mockAnswer.value.trim();


        if (!answer) {

            alert(
                "Please type or record an answer first."
            );

            return;
        }


        const question =
            generatedQuestions[
                currentQuestion
            ];


        const feedback =
            evaluateAnswer(
                answer,
                question
            );


        interviewAnswers.push({

            question:
                question.text,

            category:
                question.category,

            answer:
                answer,

            score:
                feedback.score,

            recorded:
                audioBlob !== null

        });


        showFeedback(
            feedback,
            question
        );
    }
);


// ==========================================
// SKIP QUESTION
// ==========================================

skipMockQuestion.addEventListener(
    "click",
    function () {

        const question =
            generatedQuestions[
                currentQuestion
            ];


        interviewAnswers.push({

            question:
                question.text,

            category:
                question.category,

            answer:
                "Skipped",

            score:
                0

        });


        currentQuestion++;


        showQuestion();
    }
);


// ==========================================
// FINISH INTERVIEW
// ==========================================

function finishInterview() {

    mockSession.classList.add(
        "hidden"
    );


    mockComplete.classList.remove(
        "hidden"
    );


    const answered =
        interviewAnswers.filter(
            item =>
                item.answer !==
                "Skipped"
        );


    let average = 0;


    if (
        answered.length > 0
    ) {

        const total =
            answered.reduce(
                (
                    sum,
                    item
                ) =>
                    sum + item.score,
                0
            );


        average =
            (
                total /
                answered.length
            ).toFixed(1);
    }


    mockScore.textContent =

        "You answered " +
        answered.length +
        " out of " +
        generatedQuestions.length +
        " questions. " +

        "Average practice score: " +
        average +
        "/10.";
}


// ==========================================
// RESTART MOCK INTERVIEW
// ==========================================

restartMockButton.addEventListener(
    "click",
    function () {

        currentQuestion = 0;

        interviewAnswers = [];


        mockComplete.classList.add(
            "hidden"
        );


        mockSession.classList.remove(
            "hidden"
        );


        showQuestion();
    }
);


// ============================================================
// VIDEO INTERVIEW — MILESTONE 6
// ============================================================

let videoStream = null;
let videoRecorder = null;
let videoChunks = [];
let videoRecordingStartTime = null;

const startVideoButton = document.getElementById("startVideoButton");
const videoStart = document.getElementById("videoStart");
const videoSession = document.getElementById("videoSession");
const videoPreview = document.getElementById("videoPreview");
const videoStatus = document.getElementById("videoStatus");

const startVideoRecordingButton =
  document.getElementById("startVideoRecordingButton");

const stopVideoRecordingButton =
  document.getElementById("stopVideoRecordingButton");

const recordedVideoArea =
  document.getElementById("recordedVideoArea");

const recordedVideo =
  document.getElementById("recordedVideo");

const stopVideoInterviewButton =
  document.getElementById("stopVideoInterviewButton");

async function startVideoInterview() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    videoStatus.textContent =
      "Camera access is not supported by this browser.";
    return;
  }

  try {
    videoStatus.textContent =
      "Requesting camera and microphone access...";

    videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    videoPreview.srcObject = videoStream;

    videoStart.classList.add("hidden");
    videoSession.classList.remove("hidden");

    videoStatus.textContent =
      "Camera and microphone are ready.";
  } catch (error) {
    console.error("Video interview error:", error);

    videoStatus.textContent =
      "Camera or microphone permission was denied. Please allow access and try again.";
  }
}

function startVideoRecording() {
  if (!videoStream) {
    videoStatus.textContent =
      "Please start the video interview first.";
    return;
  }

  videoChunks = [];

  try {
    videoRecorder = new MediaRecorder(videoStream);
  } catch (error) {
    console.error("MediaRecorder error:", error);

    videoStatus.textContent =
      "Video recording is not supported by this browser.";
    return;
  }

  videoRecorder.ondataavailable = function(event) {
    if (event.data && event.data.size > 0) {
      videoChunks.push(event.data);
    }
  };

  videoRecorder.onstop = function() {
    const videoBlob = new Blob(videoChunks, {
      type: videoRecorder.mimeType || "video/webm"
    });

    const videoURL = URL.createObjectURL(videoBlob);

    recordedVideo.src = videoURL;
    recordedVideoArea.classList.remove("hidden");

    videoStatus.textContent =
      "Recording complete. Review your video below.";
  };

  videoRecorder.start();
  videoRecordingStartTime = Date.now();

  startVideoRecordingButton.disabled = true;
  stopVideoRecordingButton.disabled = false;

  videoStatus.textContent = "🔴 Recording...";
}

function stopVideoRecording() {
  if (!videoRecorder || videoRecorder.state !== "recording") {
    return;
  }

  videoRecorder.stop();

  startVideoRecordingButton.disabled = false;
  stopVideoRecordingButton.disabled = true;
}

function endVideoInterview() {
  if (videoRecorder && videoRecorder.state === "recording") {
    videoRecorder.stop();
  }

  if (videoStream) {
    videoStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  videoStream = null;
  videoRecorder = null;

  videoPreview.srcObject = null;

  // Clear the previous recorded video
  if (recordedVideo) {
    if (recordedVideo.src) {
      URL.revokeObjectURL(recordedVideo.src);
    }
    recordedVideo.pause();
    recordedVideo.removeAttribute("src");
    recordedVideo.load();
  }

  if (recordedVideoArea) {
    recordedVideoArea.classList.add("hidden");
  }

  if (videoAnalysis) {
    videoAnalysis.classList.add("hidden");
  }

  if (videoAnalysisContent) {
    videoAnalysisContent.innerHTML = "";
  }

  videoChunks = [];
  videoRecordingStartTime = null;

  videoSession.classList.add("hidden");
  videoStart.classList.remove("hidden");

  startVideoRecordingButton.disabled = false;
  stopVideoRecordingButton.disabled = true;

  videoStatus.textContent = "Camera ready";
}

if (startVideoButton) {
  startVideoButton.addEventListener(
    "click",
    startVideoInterview
  );
}

if (startVideoRecordingButton) {
  startVideoRecordingButton.addEventListener(
    "click",
    startVideoRecording
  );
}

if (stopVideoRecordingButton) {
  stopVideoRecordingButton.addEventListener(
    "click",
    stopVideoRecording
  );
}

if (stopVideoInterviewButton) {
  stopVideoInterviewButton.addEventListener(
    "click",
    endVideoInterview
  );
}


// ============================================================
// VIDEO ANALYSIS — MILESTONE 6
// ============================================================

function analyzeVideoPresentation() {
  const analysis = document.getElementById("videoAnalysis");
  const content = document.getElementById("videoAnalysisContent");

  if (!analysis || !content) return;

  const durationSeconds = videoRecordingStartTime
    ? Math.max(1, Math.round((Date.now() - videoRecordingStartTime) / 1000))
    : 0;

  const minutes = durationSeconds / 60;

  const wordsPerMinute = minutes > 0
    ? Math.round((window.lastVoiceWordCount || 0) / minutes)
    : 0;

  let paceFeedback = "";

  if (wordsPerMinute === 0) {
    paceFeedback =
      "Your video recording was completed. Use the microphone transcript to get a more specific speaking-pace estimate.";
  } else if (wordsPerMinute < 110) {
    paceFeedback =
      "Your estimated speaking pace is relatively slow. Try maintaining a natural conversational pace.";
  } else if (wordsPerMinute <= 160) {
    paceFeedback =
      "Your estimated speaking pace is within a comfortable interview range.";
  } else {
    paceFeedback =
      "Your estimated speaking pace is relatively fast. Slow down slightly and allow important points to land.";
  }

  content.innerHTML = `
    <div class="feedback-card">
      <h4>📹 Recording</h4>
      <p>
        Your video recording was captured successfully.
      </p>
      <strong>Duration:</strong> ${durationSeconds} seconds
    </div>

    <div class="feedback-card">
      <h4>🎙️ Speaking Pace</h4>
      <p>${paceFeedback}</p>
      ${
        wordsPerMinute > 0
          ? `<strong>Estimated pace:</strong> ${wordsPerMinute} words/minute`
          : ""
      }
    </div>

    <div class="feedback-card">
      <h4>👀 Camera Presence</h4>
      <p>
        Keep your face comfortably visible in the camera frame.
        Look toward the camera regularly while speaking, but keep your
        behavior natural rather than forcing constant eye contact.
      </p>
    </div>

    <div class="feedback-card">
      <h4>🧍 Presentation</h4>
      <p>
        Sit upright, keep your camera stable, and make sure your
        surroundings are quiet and well organized.
      </p>
    </div>

    <div class="feedback-card">
      <h4>💡 Interview Tip</h4>
      <p>
        Focus on clear answers, specific examples, and a structured
        explanation. Do not try to memorize a perfect script.
      </p>
    </div>
  `;

  analysis.classList.remove("hidden");
}

const originalVideoRecorderStopHandler =
  typeof videoRecorder !== "undefined"
    ? null
    : null;

// Add analysis after a video recording finishes.
const originalStartVideoRecording =
  typeof startVideoRecording === "function"
    ? startVideoRecording
    : null;

if (typeof stopVideoRecording === "function") {
  const existingStopVideoRecording = stopVideoRecording;

  stopVideoRecording = function() {
    existingStopVideoRecording();

    setTimeout(function() {
      analyzeVideoPresentation();
    }, 500);
  };
}

// ============================================================
// ADAPTIVE INTERVIEWER — MILESTONE 7
// ============================================================

function getAdaptiveQuestion(answer, previousQuestion) {
  return generateAdaptiveFollowUp(answer, previousQuestion);
}

console.log("Adaptive Interviewer loaded.");


// ============================================================
// ADAPTIVE FOLLOW-UP CONNECTION — MILESTONE 7
// ============================================================

function createAdaptiveNextQuestion(answer, currentQuestion) {
  if (typeof generateAdaptiveFollowUp !== "function") {
    return "Can you give me a specific example that demonstrates your experience?";
  }

  return generateAdaptiveFollowUp(answer, currentQuestion);
}


// ============================================================
// FINAL ADAPTIVE INTERVIEWER — MILESTONE 7
// ============================================================

function buildAdaptiveQuestion(answer, previousQuestion) {

    const text = (answer || "").trim().toLowerCase();

    if (!text) {
        return {
            text: "Could you give me a specific example from your experience?",
            category: "adaptive"
        };
    }

    const words = text.split(/\s+/).filter(Boolean);

    // Very short answers
    if (words.length < 25) {
        return {
            text: "Could you explain that in more detail and give me a specific example?",
            category: "adaptive"
        };
    }

    // Project-related answers
    if (
        text.includes("project") ||
        text.includes("built") ||
        text.includes("developed") ||
        text.includes("created") ||
        text.includes("application") ||
        text.includes("website")
    ) {
        return {
            text: "What was the most challenging part of that project, and how did you solve it?",
            category: "technical"
        };
    }

    // Problem-solving answers
    if (
        text.includes("problem") ||
        text.includes("challenge") ||
        text.includes("bug") ||
        text.includes("error") ||
        text.includes("debug")
    ) {
        return {
            text: "What steps did you take to identify the root cause and solve the problem?",
            category: "technical"
        };
    }

    // Teamwork answers
    if (
        text.includes("team") ||
        text.includes("teammate") ||
        text.includes("collaborated") ||
        text.includes("group")
    ) {
        return {
            text: "What was your specific contribution to the team, and what was the final outcome?",
            category: "behavioral"
        };
    }

    // Learning answers
    if (
        text.includes("learned") ||
        text.includes("learn") ||
        text.includes("course") ||
        text.includes("class")
    ) {
        return {
            text: "How have you applied what you learned in a practical situation?",
            category: "behavioral"
        };
    }

    // Leadership answers
    if (
        text.includes("led") ||
        text.includes("leader") ||
        text.includes("leadership") ||
        text.includes("managed")
    ) {
        return {
            text: "What was the biggest challenge you faced in that situation, and what did you learn from it?",
            category: "behavioral"
        };
    }

    // Result-focused answers
    if (
        text.includes("result") ||
        text.includes("improved") ||
        text.includes("increased") ||
        text.includes("reduced") ||
        text.includes("success")
    ) {
        return {
            text: "How did you measure the success or impact of your work?",
            category: "behavioral"
        };
    }

    // General fallback
    return {
        text: "Can you give me a specific example that demonstrates what you described?",
        category: "adaptive"
    };
}


// ------------------------------------------------------------
// ADAPTIVE SUBMIT HANDLER
// Runs before the existing Submit Answer handler.
// ------------------------------------------------------------

if (
    typeof submitMockAnswer !== "undefined" &&
    typeof generatedQuestions !== "undefined"
) {

    submitMockAnswer.addEventListener(
        "click",
        function () {

            const answer =
                mockAnswer.value.trim();

            if (!answer) {
                return;
            }

            const current =
                generatedQuestions[currentQuestion];

            if (!current) {
                return;
            }

            const adaptiveQuestion =
                buildAdaptiveQuestion(
                    answer,
                    current.text
                );

            // Remove an old adaptive question immediately after
            // the current question if one exists.
            if (
                generatedQuestions[currentQuestion + 1] &&
                generatedQuestions[currentQuestion + 1].isAdaptive
            ) {
                generatedQuestions.splice(
                    currentQuestion + 1,
                    1
                );
            }

            // Insert the new adaptive question.
            generatedQuestions.splice(
                currentQuestion + 1,
                0,
                {
                    text: adaptiveQuestion.text,
                    category: adaptiveQuestion.category,
                    isAdaptive: true,
                    why:
                        "This question was selected based on your previous answer.",
                    strongAnswer:
                        "Give a specific and structured answer using your own experience.",
                    whyItWorks:
                        "Specific examples show the interviewer how you actually think and work.",
                    whatNotToSay:
                        "Avoid vague statements or answers that do not directly address the question.",
                    personalize:
                        "Use details from your own projects, coursework, work, or experience."
                }
            );

            console.log(
                "ADAPTIVE QUESTION:",
                adaptiveQuestion.text
            );
        },
        true
    );
}

console.log("Final Adaptive Interviewer loaded.");


// ============================================================
// FINAL INTERVIEW REPORT — MILESTONE 8
// ============================================================

function generateFinalInterviewReport() {

    const existing =
        document.getElementById("finalInterviewReport");

    if (existing) {
        existing.remove();
    }

    if (
        typeof interviewAnswers === "undefined" ||
        interviewAnswers.length === 0
    ) {
        return;
    }

    const answered =
        interviewAnswers.filter(
            item =>
                item.answer &&
                item.answer !== "Skipped"
        );

    const skipped =
        interviewAnswers.filter(
            item =>
                item.answer === "Skipped"
        );

    const scores =
        answered
            .map(item => Number(item.score) || 0);

    const average =
        scores.length
            ? scores.reduce(
                (sum, score) => sum + score,
                0
              ) / scores.length
            : 0;

    const overall =
        Math.round(average * 10) / 10;

    let performance = "";

    if (overall >= 8.5) {
        performance =
            "Excellent interview performance. You demonstrated strong preparation and clear communication.";
    } else if (overall >= 7) {
        performance =
            "Good interview performance. You have a solid foundation with some areas to strengthen.";
    } else if (overall >= 5) {
        performance =
            "Developing interview performance. Focus on adding specific examples and clearer structure.";
    } else {
        performance =
            "Your interview needs more preparation. Focus on structured answers and concrete examples.";
    }

    const strengths = [];

    if (average >= 7) {
        strengths.push(
            "Your answers generally demonstrated good interview readiness."
        );
    }

    const detailedAnswers =
        answered.filter(
            item =>
                item.answer.split(/\s+/).length >= 40
        );

    if (detailedAnswers.length > 0) {
        strengths.push(
            "You provided detailed answers rather than only short responses."
        );
    }

    const projectAnswers =
        answered.filter(
            item =>
                /project|built|developed|created/i
                    .test(item.answer)
        );

    if (projectAnswers.length > 0) {
        strengths.push(
            "You connected your answers to practical project experience."
        );
    }

    const behavioralAnswers =
        answered.filter(
            item =>
                item.category === "behavioral"
        );

    if (behavioralAnswers.length > 0) {
        strengths.push(
            "You practiced behavioral interview questions."
        );
    }

    if (strengths.length === 0) {
        strengths.push(
            "You completed the interview practice session."
        );
    }

    const improvements = [];

    const shortAnswers =
        answered.filter(
            item =>
                item.answer.split(/\s+/).length < 25
        );

    if (shortAnswers.length > 0) {
        improvements.push(
            "Give more detailed answers and include specific examples."
        );
    }

    if (skipped.length > 0) {
        improvements.push(
            "Try to answer every question instead of skipping questions."
        );
    }

    const lowScores =
        answered.filter(
            item =>
                Number(item.score) < 6
        );

    if (lowScores.length > 0) {
        improvements.push(
            "Review your lower-scoring answers and strengthen their structure."
        );
    }

    if (behavioralAnswers.length > 0) {
        improvements.push(
            "For behavioral questions, use STAR: Situation, Task, Action, Result."
        );
    }

    if (improvements.length === 0) {
        improvements.push(
            "Keep practicing and make your answers increasingly specific and concise."
        );
    }

    const recommendations = [
        "Use specific examples from your projects and experience.",
        "Explain what YOU personally did rather than only describing the team.",
        "For technical questions, explain your reasoning before giving the final solution.",
        "For behavioral questions, finish with a clear result or lesson learned.",
        "Practice speaking naturally instead of memorizing complete answers."
    ];

    const report =
        document.createElement("section");

    report.id =
        "finalInterviewReport";

    report.className =
        "card";

    report.innerHTML = `
        <h2>
            <span class="step-index">07</span>
            Final Interview Report
        </h2>

        <div class="final-report-score">
            <div class="final-score-number">
                ${overall}/10
            </div>

            <h3>Overall Interview Score</h3>

            <p>
                ${performance}
            </p>
        </div>

        <div class="final-report-grid">

            <div class="feedback-card">
                <h4>📊 Performance</h4>
                <p>
                    <strong>Average Score:</strong>
                    ${overall}/10
                </p>
                <p>
                    <strong>Answered:</strong>
                    ${answered.length}
                </p>
                <p>
                    <strong>Skipped:</strong>
                    ${skipped.length}
                </p>
            </div>

            <div class="feedback-card">
                <h4>✅ Strengths</h4>
                <ul>
                    ${strengths
                        .map(
                            item =>
                                `<li>${item}</li>`
                        )
                        .join("")}
                </ul>
            </div>

            <div class="feedback-card">
                <h4>⚠️ Areas to Improve</h4>
                <ul>
                    ${improvements
                        .map(
                            item =>
                                `<li>${item}</li>`
                        )
                        .join("")}
                </ul>
            </div>

            <div class="feedback-card">
                <h4>💡 Personalized Recommendations</h4>
                <ul>
                    ${recommendations
                        .map(
                            item =>
                                `<li>${item}</li>`
                        )
                        .join("")}
                </ul>
            </div>

        </div>

        <div class="feedback-card">
            <h4>📋 Question-by-Question Results</h4>

            ${answered.length
                ? answered
                    .map(
                        (item, index) => `
                            <div class="report-question">
                                <strong>
                                    ${index + 1}.
                                    ${item.question}
                                </strong>

                                <p>
                                    Category:
                                    ${item.category || "General"}
                                </p>

                                <p>
                                    Score:
                                    <strong>
                                        ${item.score}/10
                                    </strong>
                                </p>
                            </div>
                        `
                    )
                    .join("")
                : "<p>No answered questions were recorded.</p>"
            }

        </div>

        <div class="feedback-card">
            <h4>🎯 Next Practice Goal</h4>

            <p>
                Complete another mock interview and try to improve
                your overall score while making each answer specific,
                structured, and supported by a real example.
            </p>
        </div>
    `;

    const mockInterview =
        document.getElementById(
            "mockInterview"
        );

    if (mockInterview) {
        mockInterview.after(report);
    }
}


// ------------------------------------------------------------
// Automatically create the report when the interview completes.
// ------------------------------------------------------------

function watchForInterviewCompletion() {

    const complete =
        document.getElementById(
            "mockComplete"
        );

    if (!complete) {
        return;
    }

    const observer =
        new MutationObserver(
            function () {

                if (
                    !complete.classList.contains(
                        "hidden"
                    )
                ) {
                    generateFinalInterviewReport();
                }

            }
        );

    observer.observe(
        complete,
        {
            attributes: true,
            attributeFilter: ["class"]
        }
    );
}

watchForInterviewCompletion();

console.log(
    "Final Interview Report loaded."
);
