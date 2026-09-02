function generateAdaptiveFollowUp(answer, previousQuestion) {
  const text = (answer || "").trim().toLowerCase();
  const question = (previousQuestion || "").toLowerCase();

  if (!text) {
    return "Could you give me a specific example from your experience?";
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 25) {
    return "Could you tell me a little more about that and explain your reasoning?";
  }

  if (
    text.includes("project") ||
    text.includes("built") ||
    text.includes("developed") ||
    text.includes("created")
  ) {
    return "What was the most challenging part of that project, and how did you solve it?";
  }

  if (
    text.includes("problem") ||
    text.includes("challenge") ||
    text.includes("bug") ||
    text.includes("error")
  ) {
    return "What steps did you take to identify the problem and arrive at your solution?";
  }

  if (
    text.includes("team") ||
    text.includes("teammate") ||
    text.includes("collaborated")
  ) {
    return "What was your specific contribution to the team, and what was the outcome?";
  }

  if (
    text.includes("learned") ||
    text.includes("learn")
  ) {
    return "How did you apply what you learned in a real project or situation?";
  }

  if (
    text.includes("result") ||
    text.includes("improved") ||
    text.includes("increased") ||
    text.includes("reduced")
  ) {
    return "How did you measure the impact or success of that result?";
  }

  if (
    question.includes("tell me about yourself") ||
    question.includes("introduce yourself")
  ) {
    return "Which experience on your resume best demonstrates that strength?";
  }

  return "Can you give me a specific example that demonstrates what you described?";
}
