const authShell = document.getElementById('authShell');
const appShell = document.getElementById('appShell');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginStatus = document.getElementById('loginStatus');
const registerStatus = document.getElementById('registerStatus');
const registerCard = document.getElementById('registerCard');
const appStatus = document.getElementById('appStatus');
const appContent = document.getElementById('appContent');
const routeButtons = document.querySelectorAll('[data-route]');
const toggleButtons = document.querySelectorAll('[data-toggle]');
const adminButton = document.querySelector('.admin-btn');

const ACCOUNTS_KEY = 'ai-platform-albania-accounts';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getStoredAccounts = () => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredAccounts = (accounts) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const findAccountByEmail = (email) => {
  const normalized = normalizeEmail(email);
  return getStoredAccounts().find((account) => account.email === normalized);
};

const createAccountRecord = ({ name, email, role, password, isAdmin = false }) => ({
  name,
  email: normalizeEmail(email),
  role: role || 'Pilot learner',
  password,
  isAdmin: Boolean(isAdmin)
});

const mapAccountToUser = (account) => ({
  name: account.name,
  email: account.email,
  role: account.role || 'Pilot learner',
  isAdmin: Boolean(account.isAdmin)
});

const updateAdminButton = () => {
  if (adminButton) adminButton.hidden = !currentUser?.isAdmin;
};

const setActiveNav = (route) => {
  routeButtons.forEach((button) => {
    const isLogout = button.dataset.route === 'logout';
    button.classList.toggle('active', !isLogout && button.dataset.route === route);
  });
};

let currentUser = null;

const scanQuestions = [
  { block: 'Familiarity', text: 'How familiar are you with the idea of artificial intelligence?' },
  { block: 'Familiarity', text: 'How confident do you feel when people talk about AI tools?' },
  { block: 'Familiarity', text: 'How well do you understand what AI can and cannot do?' },
  { block: 'Current behavior', text: 'How often do you currently use AI tools in your work, study, or daily tasks?' },
  { block: 'Current behavior', text: 'How comfortable are you trying a new AI tool on your own?' },
  { block: 'Current behavior', text: 'How often do you use digital tools to save time or improve your work?' },
  { block: 'Goals', text: 'How interested are you in using AI more practically?' },
  { block: 'Goals', text: 'How useful do you think AI could be for your personal or professional goals?' },
  { block: 'Goals', text: 'How motivated are you to improve your AI skills in the next few months?' },
  { block: 'Readiness', text: 'How ready are you to start learning AI step by step?' },
  { block: 'Readiness', text: 'How open are you to changing the way you work or study with the help of AI?' },
  { block: 'Readiness', text: 'How likely are you to apply what you learn after this module?' }
];

const moduleQuizQuestions = [
  {
    question: 'What is AI best described as?',
    options: [
      'A set of rules written by developers for every case',
      'Systems that learn patterns from data and improve with use',
      'Guessing randomly until something works'
    ],
    answer: 'Systems that learn patterns from data and improve with use'
  },
  {
    question: 'Which example shows AI helping with work?',
    options: [
      'Copying the same text over and over manually',
      'Setting reminders automatically after reading your calendar',
      'Doing nothing and waiting for inspiration'
    ],
    answer: 'Setting reminders automatically after reading your calendar'
  },
  {
    question: 'Why is an AI readiness scan useful?',
    options: [
      'To delay training until the product is perfect',
      'To understand where to focus learning and reduce risk',
      'To prove you already know everything'
    ],
    answer: 'To understand where to focus learning and reduce risk'
  },
  {
    question: 'What is a safe way to use AI?',
    options: [
      'Share sensitive data with every tool',
      'Double-check suggestions and protect private information',
      'Blindly trust every answer'
    ],
    answer: 'Double-check suggestions and protect private information'
  },
  {
    question: 'What does applied AI focus on?',
    options: [
      'Theoretical research only',
      'Bringing practical tools to real problems',
      'Selling expensive hardware'
    ],
    answer: 'Bringing practical tools to real problems'
  },
  {
    question: 'What is a good first practical AI use?',
    options: [
      'Organizing notes with short summaries',
      'Replacing every human in the organization',
      'Starting a new AI team without a goal'
    ],
    answer: 'Organizing notes with short summaries'
  }
];

const QUIZ_PASS_MESSAGE =
  'Well done.\n\nYou completed the quiz successfully and finished the learning part of Module 1.';
const QUIZ_FAIL_MESSAGE = 'Almost there.\n\nReview the lessons and try again. The goal is understanding, not perfection.';

const moduleSteps = [
  {
    id: 'welcome',
    title: 'Welcome / Intro',
    description: 'Get ready for a guided module that keeps things simple and practical.',
    type: 'content',
    content:
      'Module 1 focuses on AI readiness, practical ideas, and a structured path so you feel confident moving forward.'
  },
  {
    id: 'scan',
    title: 'AI Readiness Scan',
    description:
      'Before you begin, take this short scan to understand your current starting point with AI. There are no right or wrong answers. This is simply a quick way to see where you are today and what kind of learning path may suit you best.',
    type: 'scan'
  },
  {
    id: 'result',
    title: 'Result screen',
    description: 'See your score, level, and a clear recommendation.',
    type: 'result'
  },
  {
    id: 'lesson1',
    title: 'Lesson 1 – What AI is',
    description: 'Understand what AI means for everyday work.',
    type: 'lesson',
    content: `Artificial intelligence, or AI, refers to digital systems that can help with tasks that normally require human thinking.

AI can help with things like:
- writing
- summarizing
- organizing ideas
- answering questions
- generating content
- supporting decision-making

AI is not magic, and it is not always correct.
It works best when people use it carefully and review the output.`,
    takeaway: 'AI is best understood as a support tool, not a replacement for human judgment.'
  },
  {
    id: 'lesson2',
    title: 'Lesson 2 – Where AI helps',
    description: 'Find practical moments to introduce AI.',
    type: 'lesson',
    content: `AI is most useful when it helps you save time, improve clarity, or get started faster.

It can support:
- students and young professionals
- small businesses
- teachers and trainers
- people who want to work more efficiently

Examples of practical use:
- summarizing a long text
- improving an email
- brainstorming ideas
- organizing notes
- drafting simple content`,
    takeaway: 'AI creates the most value when it helps with real tasks, not when it is used without purpose.'
  },
  {
    id: 'lesson3',
    title: 'Lesson 3 – Safe and smart use',
    description: 'Learn how to partner with AI safely.',
    type: 'lesson',
    content: `Using AI well also means using it responsibly.

A few simple rules:
- do not share sensitive or confidential information
- always review the output before using it
- give clear instructions
- use AI as support, not as autopilot

AI can be fast and helpful, but it still needs your judgment.`,
    takeaway: 'Good AI use is not just about speed. It is about using the tool carefully and wisely.'
  },
  {
    id: 'lesson4',
    title: 'Lesson 4 – First practical uses',
    description: 'Try new prompts and toolkits.',
    type: 'lesson',
    content: `You do not need advanced knowledge to start using AI in useful ways.

Simple first uses include:
- summarizing information
- rewriting text more clearly
- brainstorming ideas
- turning rough notes into structure

These are strong starting points because they are:
- simple
- practical
- low risk
- easy to repeat`,
    takeaway: 'Your first experience with AI should be simple, useful, and easy to apply again.'
  },
  {
    id: 'quiz',
    title: 'Final Quiz',
    description: 'Answer a short quiz to confirm what you learned.',
    type: 'quiz'
  },
  {
    id: 'completion',
    title: 'Completion screen',
    description: 'Celebrate the finish and mark the module complete.',
    type: 'completion'
  }
];

const moduleFlowState = createEmptyModuleState();

const lessonOneIndex = moduleSteps.findIndex((step) => step.id === 'lesson1');
const quizStepIndex = moduleSteps.findIndex((step) => step.id === 'quiz');
const completionIndex = moduleSteps.findIndex((step) => step.type === 'completion');
let lastRenderedStepId = null;

const goToLessonOne = () => {
  moduleFlowState.stepIndex = lessonOneIndex;
  renderModuleFlow();
};

const PROGRESS_KEY = 'ai-platform-albania-progress';
const SESSION_KEY = 'ai-platform-albania-session';

const createEmptyModuleState = () => ({
  stepIndex: 0,
  scanResponses: Array(scanQuestions.length).fill(3),
  scanScore: null,
  scanLevel: null,
  quizAnswers: {},
  quizScore: null,
  quizPassed: false,
  completed: false
});

const getStoredProgressMap = () => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStoredProgressMap = (map) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
};

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (email) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizeEmail(email) }));
};

const clearStoredSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const getUserProgress = (email) => {
  const map = getStoredProgressMap();
  return map[normalizeEmail(email)];
};

const saveUserProgress = (email, state) => {
  if (!email) return;
  const map = getStoredProgressMap();
  map[normalizeEmail(email)] = {
    stepIndex: state.stepIndex,
    scanResponses: Array.isArray(state.scanResponses) ? [...state.scanResponses] : createEmptyModuleState().scanResponses,
    scanScore: state.scanScore,
    scanLevel: state.scanLevel,
    quizAnswers: state.quizAnswers ? { ...state.quizAnswers } : {},
    quizScore: state.quizScore,
    quizPassed: state.quizPassed,
    completed: state.completed
  };
  saveStoredProgressMap(map);
};

const applyModuleStateSnapshot = (snapshot) => {
  const base = createEmptyModuleState();
  const state = { ...base, ...(snapshot || {}) };
  moduleFlowState.stepIndex = state.stepIndex;
  moduleFlowState.scanResponses = Array.isArray(state.scanResponses)
    ? [...state.scanResponses]
    : [...base.scanResponses];
  moduleFlowState.scanScore = state.scanScore;
  moduleFlowState.scanLevel = state.scanLevel;
  moduleFlowState.quizAnswers = state.quizAnswers ? { ...state.quizAnswers } : {};
  moduleFlowState.quizScore = state.quizScore;
  moduleFlowState.quizPassed = state.quizPassed;
  moduleFlowState.completed = state.completed;
};

const persistState = () => {
  if (!currentUser) return;
  saveUserProgress(currentUser.email, moduleFlowState);
};

const setStatus = (element, message = '', type = '') => {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('success', 'error');
  if (type) element.classList.add(type);
};

const calculateScanScore = () =>
  moduleFlowState.scanResponses.reduce((total, value) => total + Number(value || 0), 0);

const evaluateScanLevel = (score) => {
  if (score <= 24) {
    return {
      label: 'Beginner',
      description: 'You are at the beginning of your AI journey.',
      direction:
        'Start with the foundations, focus on simple examples, and build comfort one step at a time.'
    };
  }
  if (score <= 40) {
    return {
      label: 'Explorer',
      description:
        'You already have some awareness of AI and may have tried a few tools. You are ready to move from curiosity into more practical and consistent use.',
      direction:
        'Continue through the lessons and start identifying a few real situations where AI can help you.'
    };
  }
  return {
    label: 'Ready to Apply',
    description:
      'You already show strong readiness to use AI in practical ways. You are comfortable enough to move beyond basic understanding and start applying AI more intentionally.',
    direction:
      'Use this module as your foundation, then begin applying AI in your work, study, or everyday routines.'
  };
};

const renderDashboard = () => {
  const userName = currentUser?.name || 'Pilot learner';
  const statusLabel = getModuleStatusLabel(moduleFlowState);
  const ctaText =
    statusLabel === 'Not started' ? 'Start Module 1' : statusLabel === 'In progress' ? 'Continue Module 1' : 'Review Module 1';
  const nextStepText =
    statusLabel === 'Not started'
      ? 'Begin the AI Readiness Scan'
      : statusLabel === 'In progress'
      ? 'Continue your lessons and complete the quiz'
      : 'Review your result and wait for the next module';
  const readinessLabel = moduleFlowState.scanLevel?.label || 'Not assessed yet';
  const readinessScoreText =
    moduleFlowState.scanScore !== null ? `${moduleFlowState.scanScore}/60` : 'Ready for your first scan';
  const readinessTip =
    moduleFlowState.scanLevel?.description || 'Complete the readiness scan to get a recommended direction.';
  const quizSummary =
    moduleFlowState.quizScore !== null
      ? `${moduleFlowState.quizScore}/6 (${moduleFlowState.quizPassed ? 'Passed' : 'Pending review'})`
      : 'Not taken yet';

  appContent.innerHTML = `
    <section class="dashboard-welcome">
      <h2>Welcome back, ${userName.split(' ')[0] || userName}</h2>
      <p class="module-description">
        This is your pilot learning space. Start with Module 1 and build your AI readiness step by step.
      </p>
      <p class="pilot-note">
        Only Module 1 is live in this pilot phase. More modules will be added later.
      </p>
      <button id="dashboardCTA" class="primary-btn dashboard-cta" type="button">${ctaText}</button>
    </section>
    <div class="card-grid dashboard-cards">
      <article class="info-card">
        <h3>Module 1 status</h3>
        <p>${statusLabel}</p>
      </article>
      <article class="info-card">
        <h3>Quiz score</h3>
        <p>${quizSummary}</p>
      </article>
      <article class="info-card">
        <h3>Readiness level</h3>
        <p>${readinessLabel}</p>
        <p>${readinessScoreText}</p>
        <p>${readinessTip}</p>
      </article>
      <article class="info-card">
        <h3>Next step</h3>
        <p>${nextStepText}</p>
      </article>
    </div>
  `;

  const ctaButton = document.getElementById('dashboardCTA');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => handleRoute('module1'));
  }
};

const renderProfile = () => {
  const { name, email, role } = currentUser || {};
  appContent.innerHTML = `
    <h2>My Profile</h2>
    <div class="card-grid">
      <article class="info-card">
        <h3>${name || 'Pilot participant'}</h3>
        <p>${email || 'No email provided'}</p>
        <p>${role || 'Pilot learner'}</p>
      </article>
      <article class="info-card">
        <h3>Pilot journey</h3>
        <p>Ready for readiness scan · start Module 1 · unlock certificate.</p>
      </article>
      <article class="info-card">
        <h3>Next sync</h3>
        <p>Watch the weekly stand-up recap for Module 1 by Friday.</p>
      </article>
    </div>
  `;
};

const renderStepContent = (step) => {
  switch (step.type) {
    case 'content':
      return `
        <article class="module-step-card">
          <p class="module-step-intro">${step.content}</p>
        </article>
      `;
    case 'scan': {
      const blocks = scanQuestions.reduce((acc, question, index) => {
        acc[question.block] = acc[question.block] || [];
        acc[question.block].push({ ...question, index });
        return acc;
      }, {});
      return `
        <article class="module-step-card scan-card">
          <p class="module-step-intro">
            Answer these short questions to understand your current AI readiness level.
          </p>
          <p class="scan-helper">There are no right or wrong answers. 1 = Not at all · 5 = Very much.</p>
          ${Object.entries(blocks)
            .map(
              ([blockName, questions]) => `
                <div class="scan-block-section">
                  <h3>${blockName}</h3>
                  <div class="module-scan-grid">
                    ${questions
                      .map(
                        (question) => `
                          <article class="scan-card">
                            <p class="scan-question">${question.text}</p>
                            <div class="scale-input">
                              <input
                                class="scan-range"
                                type="range"
                                min="1"
                                max="5"
                                value="${moduleFlowState.scanResponses[question.index]}"
                                data-index="${question.index}"
                              />
                              <span class="scale-value" id="scanValue-${question.index}">
                                ${moduleFlowState.scanResponses[question.index]}
                              </span>
                            </div>
                            <div class="scale-labels">
                              <span>1 – Not at all</span>
                              <span>5 – Very much</span>
                            </div>
                          </article>
                        `
                      )
                      .join('')}
                  </div>
                </div>
              `
            )
            .join('')}
        </article>
      `;
    }
    case 'result': {
      const score = moduleFlowState.scanScore ?? calculateScanScore();
      const level = moduleFlowState.scanLevel ?? evaluateScanLevel(score);
      return `
        <article class="result-card module-step-card">
          <h3>Your AI Readiness Result</h3>
          <p class="result-score">Score: ${score}/60</p>
          <p class="result-level">Level: ${level.label}</p>
          <p>${level.description}</p>
          <p class="direction">Recommended next step: ${level.direction}</p>
          <button class="primary-btn" id="resultCTA" type="button">Continue to Lesson 1</button>
        </article>
      `;
    }
    case 'lesson':
      return `
        <article class="lesson-card module-step-card">
          <h3>${step.title}</h3>
          <p>${step.content}</p>
          <div class="key-takeaway">
            <span>Key takeaway</span>
            <p>${step.takeaway}</p>
          </div>
        </article>
      `;
    case 'quiz':
      return `
        <article class="quiz-card module-step-card">
          <h3>Module 1 Quiz</h3>
          <p class="module-step-intro">Answer these short questions to check your understanding of the basics covered in this module.</p>
          <div class="quiz-grid">
            ${moduleQuizQuestions
              .map(
                (question, index) => `
                  <article class="quiz-question-card">
                    <h3>Question ${index + 1}</h3>
                    <p>${question.question}</p>
                    <div class="quiz-options">
                      ${question.options
                        .map(
                          (option) => `
                            <label>
                              <input
                                type="radio"
                                name="quiz-${index}"
                                value="${option}"
                                data-question="${index}"
                                ${moduleFlowState.quizAnswers[index] === option ? 'checked' : ''}
                              />
                              ${option}
                            </label>
                          `
                        )
                        .join('')}
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
          <p id="quizFeedback" class="quiz-feedback" aria-live="polite"></p>
        </article>
      `;
    case 'completion': {
      const score = moduleFlowState.quizScore ?? 0;
      const passed = moduleFlowState.quizPassed;
      const readinessLabel = moduleFlowState.scanLevel?.label || 'Not assessed yet';
      return `
        <article class="completion-card module-step-card">
          <h3>Module Completed</h3>
          <p>You completed Module 1: AI Readiness & Foundations.</p>
          <section class="result-summary">
            <h4>Your current result</h4>
            <ul>
              <li><strong>AI Readiness Level:</strong> ${readinessLabel}</li>
              <li><strong>Quiz Score:</strong> ${score}/6 (${passed ? 'Passed' : 'Try again'})</li>
              <li><strong>Module Status:</strong> Completed</li>
              <li><strong>Module Progress:</strong> 1 of 1 live module completed</li>
            </ul>
          </section>
          <p>You now have:</p>
          <ul>
            <li>a clearer understanding of what AI is</li>
            <li>a better sense of where AI can help</li>
            <li>a safer approach to using AI tools</li>
            <li>a clearer view of your current readiness level</li>
          </ul>
          <p>This is your starting point for using AI more confidently and more practically.</p>
          <div class="certificate-card">
            <p>Certificate available in the pilot version</p>
          </div>
          <p>More modules and learning paths will be added in future phases.</p>
          <button class="primary-btn" id="completionDashboard" type="button">Return to Dashboard</button>
        </article>
      `;
    }
    default:
      return '<p>Choose a step to continue.</p>';
  }
};

const renderModuleFlow = () => {
  const step = moduleSteps[moduleFlowState.stepIndex];
  if (step.id === 'quiz' && lastRenderedStepId !== 'quiz') {
    moduleFlowState.quizScore = null;
    moduleFlowState.quizPassed = false;
  }
  const progressPercent = Math.round(((moduleFlowState.stepIndex + 1) / moduleSteps.length) * 100);
  moduleFlowState.completed = moduleFlowState.stepIndex === moduleSteps.length - 1;
  appContent.innerHTML = `
    <div class="module-shell">
      <header class="module-header">
        <p class="eyebrow">Module 1 · AI Readiness & Foundations</p>
        <h2>${step.title}</h2>
        <p class="module-description">${step.description}</p>
      </header>
      <div class="module-progress">
        <div class="progress-track">
          <span style="width: ${progressPercent}%;"></span>
        </div>
        <p>${progressPercent}% complete · Step ${moduleFlowState.stepIndex + 1} of ${moduleSteps.length}</p>
      </div>
      <div class="module-step">${renderStepContent(step)}</div>
      <div class="module-nav">
        <button type="button" class="ghost-btn" id="moduleBack">Back</button>
        <div class="module-nav-actions">
          <button type="button" class="primary-btn" id="moduleNext">Next</button>
          <button type="button" class="ghost-btn" id="moduleDashboard" hidden>Return to Dashboard</button>
        </div>
      </div>
    </div>
  `;
  setupModuleInteractivity(step);
  persistState();
  lastRenderedStepId = step.id;
};

const handleModuleNext = () => {
  const step = moduleSteps[moduleFlowState.stepIndex];
  if (step.type === 'quiz') {
    const quizFeedback = document.getElementById('quizFeedback');
    if (moduleFlowState.quizScore === null) {
      const allAnswered = moduleQuizQuestions.every((_, index) => !!moduleFlowState.quizAnswers[index]);
      if (!allAnswered) {
        if (quizFeedback) quizFeedback.textContent = 'Please answer every question before continuing.';
        return;
      }
      const score = moduleQuizQuestions.reduce(
        (total, question, index) =>
          total + (moduleFlowState.quizAnswers[index] === question.answer ? 1 : 0),
        0
      );
      moduleFlowState.quizScore = score;
      moduleFlowState.quizPassed = score >= 4;
      if (quizFeedback) {
        const message = moduleFlowState.quizPassed ? QUIZ_PASS_MESSAGE : QUIZ_FAIL_MESSAGE;
        quizFeedback.textContent = `You scored ${score}/6. ${message}`;
        quizFeedback.classList.add('success');
      }
      renderModuleFlow();
      return;
    }
    if (moduleFlowState.quizPassed) {
      moduleFlowState.stepIndex = completionIndex;
    } else {
      moduleFlowState.stepIndex = lessonOneIndex;
    }
    renderModuleFlow();
    return;
  }

  if (step.type === 'scan') {
    const score = calculateScanScore();
    moduleFlowState.scanScore = score;
    moduleFlowState.scanLevel = evaluateScanLevel(score);
  }

  if (moduleFlowState.stepIndex < moduleSteps.length - 1) {
    moduleFlowState.stepIndex += 1;
  }
  renderModuleFlow();
};

const setupModuleInteractivity = (step) => {
  const backButton = document.getElementById('moduleBack');
  const nextButton = document.getElementById('moduleNext');
  const dashboardButton = document.getElementById('moduleDashboard');

  if (backButton) {
    backButton.disabled = moduleFlowState.stepIndex === 0;
    backButton.addEventListener('click', () => {
      if (moduleFlowState.stepIndex > 0) {
        moduleFlowState.stepIndex -= 1;
        renderModuleFlow();
      }
    });
  }

  if (nextButton) {
    const isCompletion = moduleFlowState.stepIndex === moduleSteps.length - 1;
    nextButton.hidden = isCompletion || step.type === 'result';
    if (step.type === 'quiz') {
      nextButton.textContent =
        moduleFlowState.quizScore === null
          ? 'Submit quiz'
          : moduleFlowState.quizPassed
          ? 'Complete Module'
          : 'Review Lessons';
    } else {
      nextButton.textContent = 'Next';
    }
    if (!nextButton.hidden) {
      nextButton.addEventListener('click', handleModuleNext);
    }
  }

  if (dashboardButton) {
    dashboardButton.hidden = moduleFlowState.stepIndex !== moduleSteps.length - 1;
    dashboardButton.addEventListener('click', () => handleRoute('dashboard'));
  }

  if (step.type === 'scan') {
    document.querySelectorAll('.scan-range').forEach((input) => {
      input.addEventListener('input', (event) => {
        const target = event.target;
        const index = Number(target.dataset.index);
        const value = Number(target.value);
        moduleFlowState.scanResponses[index] = value;
        document.getElementById(`scanValue-${index}`).textContent = value;
        persistState();
      });
    });
  }

  if (step.type === 'quiz') {
    document.querySelectorAll('.quiz-options input').forEach((input) => {
      input.addEventListener('change', (event) => {
        const target = event.target;
        const questionIndex = Number(target.dataset.question);
        moduleFlowState.quizAnswers[questionIndex] = target.value;
        const quizFeedback = document.getElementById('quizFeedback');
        if (quizFeedback) {
          quizFeedback.textContent = '';
          quizFeedback.classList.remove('success', 'error');
        }
        persistState();
      });
    });
  }
  const resultCTA = document.getElementById('resultCTA');
  if (resultCTA) {
    resultCTA.addEventListener('click', goToLessonOne);
  }
  const completionButton = document.getElementById('completionDashboard');
  if (completionButton) {
    completionButton.addEventListener('click', () => handleRoute('dashboard'));
  }
};

const getModuleStatusLabel = (state) => {
  if (state.completed) return 'Completed';
  if (state.stepIndex > 0 || state.scanScore !== null) return 'In progress';
  return 'Not started';
};

const renderModuleOne = () => {
  if (moduleFlowState.stepIndex > moduleSteps.length - 1) {
    moduleFlowState.stepIndex = moduleSteps.length - 1;
  }
  renderModuleFlow();
};

const renderAdminOverview = () => {
  const progressMap = getStoredProgressMap();
  const fromProgress = Object.entries(progressMap).map(([email, progress]) => ({
    name: currentUser && normalizeEmail(currentUser.email) === email ? currentUser.name || 'Pilot learner' : email,
    email,
    readiness: progress.scanLevel?.label || 'Not assessed yet',
    status: getModuleStatusLabel(progress),
    quiz:
      typeof progress.quizScore !== 'undefined'
        ? `${progress.quizScore}/6`
        : 'Not taken'
  }));

  const demoUsers = [
    {
      name: 'Liri Gashi',
      email: 'liri@demo.al',
      readiness: 'Explorer',
      status: 'In progress',
      quiz: '5/6'
    },
    {
      name: 'Enea Kola',
      email: 'enea@demo.al',
      readiness: 'Ready to Apply',
      status: 'Completed',
      quiz: '6/6'
    }
  ];

  const overviewUsers = [...fromProgress, ...demoUsers];

  appContent.innerHTML = `
    <h2>Admin overview</h2>
    <p class="module-description">Internal testing view of participants and progress.</p>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Readiness level</th>
            <th>Module status</th>
            <th>Quiz score</th>
          </tr>
        </thead>
        <tbody>
          ${overviewUsers
            .map(
              (user) => `
                <tr>
                  <td>${user.name}</td>
                  <td>${user.email || '—'}</td>
                  <td>${user.readiness}</td>
                  <td>${user.status}</td>
                  <td>${user.quiz}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
};

const handleRoute = (route) => {
  if (route === 'logout') {
    handleLogout();
    return;
  }

  if (!currentUser) return;

  setActiveNav(route);

  switch (route) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'profile':
      renderProfile();
      break;
    case 'module1':
      renderModuleOne();
      break;
    case 'admin':
      renderAdminOverview();
      break;
    default:
      appContent.innerHTML = '<p>Choose a section from the navigation.</p>';
  }
};

const handleLogout = () => {
  currentUser = null;
  authShell.hidden = false;
  appShell.hidden = true;
  loginForm.reset();
  registerForm.reset();
  registerCard.hidden = true;
  setStatus(loginStatus, '', '');
  setStatus(registerStatus, '', '');
  appContent.innerHTML = '';
  persistState();
  applyModuleStateSnapshot(null);
  clearStoredSession();
  updateAdminButton();
};

const authenticate = (user) => {
  currentUser = user;
  authShell.hidden = true;
  appShell.hidden = false;
  registerCard.hidden = true;
  setActiveNav('dashboard');
  appStatus.textContent = `${user.name || 'Pilot learner'} · Pilot access`;
  updateAdminButton();
  saveStoredSession(user.email);
  const savedProgress = getUserProgress(user.email);
  applyModuleStateSnapshot(savedProgress);
  persistState();
  handleRoute('dashboard');
};

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.toggle;
    registerCard.hidden = target !== 'register';
    if (target === 'register') {
      registerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    setStatus(loginStatus, 'Enter your email and password.', 'error');
    return;
  }

  const account = findAccountByEmail(email);
  if (!account) {
    setStatus(loginStatus, 'No account found for this email. Please register first.', 'error');
    return;
  }

  if (account.password !== password) {
    setStatus(loginStatus, 'Incorrect password. Please try again.', 'error');
    return;
  }

  setStatus(loginStatus, 'Welcome back. Loading your pilot workspace...', 'success');

  setTimeout(() => {
    authenticate(mapAccountToUser(account));
  }, 600);
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = registerForm.name.value.trim();
  const email = registerForm.email.value.trim();
  const role = registerForm.role.value.trim() || 'Pilot learner';
  const password = registerForm.password.value.trim();

  if (!name || !email || !password) {
    setStatus(registerStatus, 'Complete all required fields.', 'error');
    return;
  }

  if (findAccountByEmail(email)) {
    setStatus(registerStatus, 'An account with that email already exists.', 'error');
    return;
  }

  const account = createAccountRecord({
    name,
    email,
    role,
    password,
    isAdmin: false
  });
  const accounts = getStoredAccounts();
  saveStoredAccounts([...accounts, account]);

  setStatus(registerStatus, 'Account created. Welcome to the pilot workspace.', 'success');
  registerForm.reset();

  setTimeout(() => {
    authenticate(mapAccountToUser(account));
  }, 600);
});

routeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const route = button.dataset.route;
    if (route) {
      handleRoute(route);
    }
  });
});

const restoreSession = () => {
  const session = getStoredSession();
  if (!session?.email) return;
  const account = findAccountByEmail(session.email);
  if (!account) {
    clearStoredSession();
    return;
  }
  authenticate(mapAccountToUser(account));
};

restoreSession();
