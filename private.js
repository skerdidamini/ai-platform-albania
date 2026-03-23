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

let currentUser = null;

const normalizeEmail = (email) => email.split('@')[0].replace(/[^a-z]/gi, '').toUpperCase() || 'Pilot learner';

const createUserRecord = ({ name, email, role }) => ({
  name,
  email,
  role,
  isAdmin: /admin/i.test(email || '')
});

const scanQuestions = [
  { block: 'Familiarity', text: 'How familiar are you with basic AI terminology?' },
  { block: 'Familiarity', text: 'How often do you hear about AI solutions in your field?' },
  { block: 'Familiarity', text: 'How comfortable are you explaining what AI can do?' },
  { block: 'Current behavior', text: 'How often do you use AI tools in your daily tasks?' },
  { block: 'Current behavior', text: 'Do you rely on templates or automations that feel like AI?' },
  { block: 'Current behavior', text: 'How confident are you describing your current workflow to identify gaps?' },
  { block: 'Goals', text: 'How important is learning AI for your current goals?' },
  { block: 'Goals', text: 'How motivated are you to try new AI tools soon?' },
  { block: 'Goals', text: 'How clear are you on the outcomes you want from AI?' },
  { block: 'Readiness', text: 'How ready are you to spend dedicated time on learning AI?' },
  { block: 'Readiness', text: 'How confident are you to apply AI suggestions after training?' },
  { block: 'Readiness', text: 'How supported do you feel to experiment with AI in your context?' }
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
    description: 'Answer 12 quick questions to map your starting level.',
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
    content:
      'AI is any tool that learns from patterns and helps make better decisions. It is already inside basic search, maps, or reminder features.'
  },
  {
    id: 'lesson2',
    title: 'Lesson 2 – Where AI helps',
    description: 'Find practical moments to introduce AI.',
    type: 'lesson',
    content:
      'AI shows up when you automate emails, summarize reports, or create visuals quickly. Spot the steps in your work that feel repetitive.'
  },
  {
    id: 'lesson3',
    title: 'Lesson 3 – Safe and smart use',
    description: 'Learn how to partner with AI safely.',
    type: 'lesson',
    content:
      'Be clear about what you share and always double-check the output. Treat AI suggestions as helpers, not final answers.'
  },
  {
    id: 'lesson4',
    title: 'Lesson 4 – First practical uses',
    description: 'Try new prompts and toolkits.',
    type: 'lesson',
    content:
      'Start with short prompts for scheduling, note-taking, or idea shaping. Keep each exercise under 10 minutes to stay focused.'
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

const moduleFlowState = {
  stepIndex: 0,
  scanResponses: Array(scanQuestions.length).fill(3),
  scanScore: null,
  scanLevel: null,
  quizAnswers: {},
  quizScore: null,
  quizPassed: false,
  completed: false
};

const STORAGE_KEY = 'ai-platform-albania-private';

const loadStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistState = () => {
  if (!currentUser) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const payload = {
    user: currentUser,
    module: {
      stepIndex: moduleFlowState.stepIndex,
      scanResponses: moduleFlowState.scanResponses,
      scanScore: moduleFlowState.scanScore,
      scanLevel: moduleFlowState.scanLevel,
      quizAnswers: moduleFlowState.quizAnswers,
      quizScore: moduleFlowState.quizScore,
      quizPassed: moduleFlowState.quizPassed,
      completed: moduleFlowState.completed
    }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const applyStoredModuleState = (saved = {}) => {
  if (typeof saved.stepIndex !== 'undefined') {
    const storedStep = Number(saved.stepIndex);
    if (!Number.isNaN(storedStep)) {
      moduleFlowState.stepIndex = storedStep;
    }
  }
  moduleFlowState.scanResponses = Array.isArray(saved.scanResponses)
    ? saved.scanResponses.map((value) => Number(value ?? 3))
    : moduleFlowState.scanResponses;
  moduleFlowState.scanScore =
    typeof saved.scanScore !== 'undefined' ? Number(saved.scanScore) : moduleFlowState.scanScore;
  moduleFlowState.scanLevel = saved.scanLevel ?? moduleFlowState.scanLevel;
  moduleFlowState.quizAnswers = saved.quizAnswers ?? moduleFlowState.quizAnswers;
  moduleFlowState.quizScore =
    typeof saved.quizScore !== 'undefined' ? Number(saved.quizScore) : moduleFlowState.quizScore;
  moduleFlowState.quizPassed =
    typeof saved.quizPassed !== 'undefined' ? Boolean(saved.quizPassed) : moduleFlowState.quizPassed;
  moduleFlowState.completed =
    typeof saved.completed !== 'undefined' ? Boolean(saved.completed) : moduleFlowState.completed;
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
      description: 'Focus on basic ideas and confidence-building activities.',
      direction: 'Start with short introductions, awareness labs, and practical checklists.'
    };
  }
  if (score <= 40) {
    return {
      label: 'Explorer',
      description: 'You are discovering what tools can do—keep experimenting.',
      direction: 'Pair assessments with guided lessons and try small tool experiments.'
    };
  }
  return {
    label: 'Ready to Apply',
    description: 'You have a practical mindset and are ready to build real applications.',
    direction: 'Move into guided projects, connect with mentors, and pilot real use cases.'
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
    <h2>Welcome, ${userName.split(' ')[0] || userName}</h2>
    <p class="module-description">
      This is your pilot learning space. Start with Module 1 and complete your AI readiness journey.
    </p>
    <div class="card-grid">
      <article class="info-card">
        <h3>Module 1 status</h3>
        <p>${statusLabel}</p>
        <button id="dashboardCTA" class="primary-btn" type="button">${ctaText}</button>
      </article>
      <article class="info-card">
        <h3>Quiz score</h3>
        <p>${quizSummary}</p>
      </article>
      <article class="info-card">
        <h3>Readiness snapshot</h3>
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
      return `<p class="module-copy">${step.content}</p>`;
    case 'scan': {
      return `
        <div class="module-scan-grid">
          ${scanQuestions
            .map(
              (question, index) => `
                <article class="scan-card">
                  <small class="scan-block">${question.block}</small>
                  <p>${question.text}</p>
                  <div class="scale-input">
                    <input
                      class="scan-range"
                      type="range"
                      min="1"
                      max="5"
                      value="${moduleFlowState.scanResponses[index]}"
                      data-index="${index}"
                    />
                    <span class="scale-value" id="scanValue-${index}">${moduleFlowState.scanResponses[index]}</span>
                  </div>
                  <div class="scale-labels">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      `;
    }
    case 'result': {
      const score = moduleFlowState.scanScore ?? calculateScanScore();
      const level = moduleFlowState.scanLevel ?? evaluateScanLevel(score);
      return `
        <article class="result-card">
          <div class="result-row">
            <span>Score</span>
            <strong>${score}/60</strong>
          </div>
          <div class="result-row">
            <span>Level</span>
            <strong>${level.label}</strong>
          </div>
          <p>${level.description}</p>
          <p class="direction">Recommended direction: ${level.direction}</p>
        </article>
      `;
    }
    case 'lesson':
      return `
        <article class="lesson-card">
          <p>${step.content}</p>
        </article>
      `;
    case 'quiz': {
      return `
        <div class="quiz-grid">
          ${moduleQuizQuestions
            .map(
              (question, index) => `
                <article class="quiz-card">
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
        <p id="quizFeedback" class="form-status" aria-live="polite"></p>
      `;
    }
    case 'completion': {
      const score = moduleFlowState.quizScore ?? 0;
      const passed = moduleFlowState.quizPassed;
      return `
        <article class="completion-card">
          <h3>Completion screen</h3>
          <p>You finished Module 1 · AI Readiness & Foundations.</p>
          <p>Quiz score: ${score}/6 (${passed ? 'Passed' : 'Pending review'})</p>
          <div class="certificate-card">
            <p>Certificate available</p>
            <small>Coming soon inside the pilot workspace.</small>
          </div>
          <p class="module-complete-note">Module marked as completed.</p>
        </article>
      `;
    }
    default:
      return '<p>Choose a step to continue.</p>';
  }
};

const renderModuleFlow = () => {
  const step = moduleSteps[moduleFlowState.stepIndex];
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
};

const handleModuleNext = () => {
  const step = moduleSteps[moduleFlowState.stepIndex];
  if (step.type === 'quiz') {
    const quizFeedback = document.getElementById('quizFeedback');
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
      quizFeedback.textContent = `You scored ${score}/6.`;
      quizFeedback.classList.add('success');
    }
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
    nextButton.hidden = isCompletion;
    if (!isCompletion) {
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
  const stored = loadStoredState();
  const savedUser = stored?.user
    ? {
        name: stored.user.name || 'Pilot learner',
        email: stored.user.email,
        readiness: stored.module?.scanLevel?.label || 'Not assessed yet',
        status: getModuleStatusLabel({
          completed: stored.module?.completed,
          stepIndex: stored.module?.stepIndex,
          scanScore: stored.module?.scanScore
        }),
        quiz:
          typeof stored.module?.quizScore !== 'undefined'
            ? `${stored.module.quizScore}/6`
            : 'Not taken'
      }
    : null;

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

  const overviewUsers = [savedUser, ...demoUsers].filter(Boolean);

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
  updateAdminButton();
};

const authenticate = (user) => {
  currentUser = user;
  authShell.hidden = true;
  appShell.hidden = false;
  registerCard.hidden = true;
  setActiveNav('dashboard');
  appStatus.textContent = `${user.name || 'Pilot learner'} · Pilot access`;
  if (adminButton) adminButton.hidden = !user.isAdmin;
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
  const stored = loadStoredState();
  if (!stored) return;
  applyStoredModuleState(stored.module ?? {});
  if (stored.user) {
    currentUser = stored.user;
    authShell.hidden = true;
    appShell.hidden = false;
    registerCard.hidden = true;
    setActiveNav('dashboard');
    appStatus.textContent = `${currentUser.name || 'Pilot learner'} · Pilot access`;
    handleRoute('dashboard');
    updateAdminButton();
  }
};

restoreSession();
