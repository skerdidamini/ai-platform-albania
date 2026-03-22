const featureGrid = document.getElementById('feature-grid');
const flowGrid = document.getElementById('flow-grid');
const moduleGrid = document.getElementById('module-grid');
const demoGrid = document.getElementById('demo-grid');
const blogGrid = document.getElementById('blog-grid');
const blogEmpty = document.getElementById('blog-empty');
const faqAccordion = document.getElementById('faq-accordion');
const navToggle = document.querySelector('.nav-toggle');
const navBackdrop = document.querySelector('[data-nav-close]');
const navLinks = document.querySelectorAll('.nav-links a, [data-menu-link]');

const keyFeatures = [
  { title: 'AI Readiness Scan', description: 'Understand your current level and identify the right starting point for your AI journey.' },
  { title: 'Personalized Learning Paths', description: 'Paths adapt to each profile, offering structured content for different roles and use cases.' },
  { title: 'Practical Toolkits', description: 'Templates, prompts, guides, and resources that help turn knowledge into action.' }
];

const flowSteps = [
  { title: 'Register', detail: 'Create your account and tell us a bit about who you are.' },
  { title: 'Complete the AI Readiness Scan', detail: 'Answer a short assessment to identify your current level and needs.' },
  { title: 'Get your recommended path', detail: 'Receive a learning path based on your profile and readiness level.' },
  { title: 'Learn through modules and tools', detail: 'Access lessons, quizzes, and practical toolkits designed for your use case.' },
  { title: 'Track progress and earn recognition', detail: 'Follow your progress, complete activities, and unlock your certificate.' }
];

const modules = [
  {
    title: 'AI Readiness & Foundations',
    description: 'Start with the basics, understand core concepts, and identify your next steps.',
    target: 'All users',
    outcomes: 'A clear starting point and foundational AI understanding',
    level: 'Beginner'
  },
  {
    title: 'AI for Youth, Work & Freelancing',
    description: 'Learn how to use AI for productivity, communication, research, and work-related tasks.',
    target: 'Youth and early professionals',
    outcomes: 'Practical AI skills for work and professional growth',
    level: 'Intermediate'
  },
  {
    title: 'AI for SMEs, Tourism & Small Business',
    description: 'Explore practical uses of AI for small business workflows, communication, marketing, and operations.',
    target: 'SMEs and business users',
    outcomes: 'Better efficiency and smarter digital support',
    level: 'Intermediate'
  },
  {
    title: 'AI for Schools & VET',
    description: 'A pilot module designed to support structured AI use in educational and vocational settings.',
    target: 'Schools, VET centers, educators',
    outcomes: 'More practical and modern AI learning support',
    level: 'Advanced'
  }
];

const demoPreviews = [
  { title: 'Learner Dashboard', badge: 'Dashboard', detail: 'Track your progress, view your active module, and access your next recommended step.' },
  { title: 'AI Readiness Results', badge: 'Assessment', detail: 'Receive a simple overview of your readiness level and a suggested learning path.' },
  { title: 'Module Experience', badge: 'Lesson', detail: 'Follow structured lessons, quizzes, and downloadable resources in one place.' },
  { title: 'Progress & Certificate', badge: 'Certificate', detail: 'Complete activities, monitor progress, and unlock recognition at the end of your path.' }
];

const blogPosts = [
  {
    title: 'Building the first MVP of AI Platform Albania',
    category: 'Platform Updates',
    summary: 'We are currently structuring the first version of the platform, focused on readiness assessment, practical learning paths, and early pilot use.'
  },
  {
    title: 'Why practical AI skills matter more than ever',
    category: 'AI Skills',
    summary: 'AI is becoming more visible across education and business, but practical skills remain the real gap for most users.'
  },
  {
    title: 'How small businesses can start using AI in simple ways',
    category: 'SME Use Cases',
    summary: 'From communication to workflow support, SMEs can begin using AI with small, realistic steps that create immediate value.'
  }
];

const faqItems = [
  { question: 'What is AI Platform Albania?', answer: 'AI Platform Albania is a practical AI learning and readiness platform designed for youth, SMEs, and educational users in Albania.' },
  { question: 'Who is it for?', answer: 'It is designed for individuals, businesses, and institutions that want to understand and apply AI in a practical way.' },
  { question: 'Is this just a course platform?', answer: 'No. The platform goes beyond traditional training by combining readiness assessment, learning paths, practical resources, and progress tracking.' },
  { question: 'Do I need prior AI knowledge?', answer: 'No. The platform is being designed for different starting levels, including beginners.' },
  { question: 'Will there be certificates?', answer: 'Yes. The platform is planned to include completion-based certificates for selected learning paths.' },
  { question: 'Is the platform already live?', answer: 'The MVP is currently in development. We are collecting early interest and pilot applications.' },
  { question: 'Can institutions or SMEs join as pilot users?', answer: 'Yes. We welcome interest from schools, VET centers, SMEs, and potential partners.' },
  { question: 'How can I join the waitlist?', answer: 'You can register through the waitlist form on this website.' }
];

const contactForm = document.getElementById('contact-form');
const applyForm = document.getElementById('apply-form');
const contactSuccess = document.getElementById('contact-success');
const applySuccess = document.getElementById('apply-success');
const submissions = [];

const createCard = (container, contentHTML) => {
  const card = document.createElement('article');
  card.innerHTML = contentHTML;
  container.appendChild(card);
};

keyFeatures.forEach((feature) => {
  createCard(featureGrid, `
    <p class="icon">AI</p>
    <h3>${feature.title}</h3>
    <p>${feature.description}</p>
  `);
});

flowSteps.forEach((step, index) => {
  createCard(flowGrid, `
    <span class="step-index">${String(index + 1).padStart(2, '0')}</span>
    <h3>${step.title}</h3>
    <p>${step.detail}</p>
  `);
});

modules.forEach((module) => {
  createCard(moduleGrid, `
    <div class="badge">${module.level}</div>
    <h3>${module.title}</h3>
    <p>${module.description}</p>
    <p><strong>Audience:</strong> ${module.target}</p>
    <p><strong>Outcome:</strong> ${module.outcomes}</p>
    <button type="button" class="ghost-btn" data-menu-link data-target="#apply">Join Waitlist</button>
  `);
});

demoPreviews.forEach((demo) => {
  createCard(demoGrid, `
    <div class="demo-card">
      <span class="badge">${demo.badge}</span>
      <h3>${demo.title}</h3>
      <p>${demo.detail}</p>
    </div>
  `);
});

blogPosts.forEach((post) => {
  createCard(blogGrid, `
    <p class="eyebrow">${post.category}</p>
    <h3>${post.title}</h3>
    <p>${post.summary}</p>
  `);
});

if (blogPosts.length === 0 && blogEmpty) {
  blogEmpty.hidden = false;
}

faqItems.forEach((item) => {
  const card = document.createElement('div');
  card.className = 'faq-card';
  card.innerHTML = `
    <h3>${item.question}</h3>
    <p>${item.answer}</p>
  `;
  card.addEventListener('click', () => card.classList.toggle('active'));
  faqAccordion.appendChild(card);
});

const attachFieldMessages = (form) => {
  form.querySelectorAll('label').forEach((label) => {
    if (!label.querySelector('.field-error')) {
      const span = document.createElement('span');
      span.className = 'field-error';
      span.setAttribute('aria-live', 'polite');
      label.appendChild(span);
    }
  });
};

const showFieldError = (field, message) => {
  const label = field.closest('label');
  if (!label) return;
  label.classList.add('invalid');
  const span = label.querySelector('.field-error');
  if (span) span.textContent = message;
};

const clearFieldError = (field) => {
  const label = field.closest('label');
  if (!label) return;
  label.classList.remove('invalid');
  const span = label.querySelector('.field-error');
  if (span) span.textContent = '';
};

const buttonLoading = (button, text) => {
  button.dataset.label = button.textContent;
  button.disabled = true;
  button.classList.add('loading');
  button.textContent = text;
};

const buttonReset = (button) => {
  button.disabled = false;
  button.classList.remove('loading');
  if (button.dataset.label) {
    button.textContent = button.dataset.label;
  }
};

const handleFormSubmit = (form, successEl, successText, errorText) => {
  const button = form.querySelector('button[type="submit"]');
  const fields = Array.from(form.elements).filter((el) => el.willValidate);
  let valid = true;

  fields.forEach((field) => {
    clearFieldError(field);
    if (!field.checkValidity()) {
      showFieldError(field, field.validationMessage);
      valid = false;
    }
  });

  if (!valid) {
    successEl.textContent = errorText;
    successEl.classList.remove('success');
    successEl.classList.add('error');
    return false;
  }

  if (button) buttonLoading(button, 'Sending...');
  successEl.textContent = '';

  setTimeout(() => {
    if (button) buttonReset(button);
    successEl.textContent = successText;
    successEl.classList.remove('error');
    successEl.classList.add('success');
  }, 900);

  return true;
};

if (contactForm) {
  attachFieldMessages(contactForm);
  const inputs = contactForm.querySelectorAll('input, textarea, select');
  inputs.forEach((field) =>
    field.addEventListener('input', () => clearFieldError(field))
  );

  contactForm.addEventListener('submit', (event) => {
    // event.preventDefault();

    const isValid = handleFormSubmit(
      contactForm,
      contactSuccess,
      'Thank you. Your message has been sent successfully.',
      'Please check the highlighted fields and try again.'
    );

    if (!isValid) {
  event.preventDefault();
  return;


    setTimeout(() => {
      contactForm.reset();
    }, 950);
  });
}

if (applyForm) {
  attachFieldMessages(applyForm);
  const inputs = applyForm.querySelectorAll('input, textarea, select');
  inputs.forEach((field) =>
    field.addEventListener('input', () => clearFieldError(field))
  );

  applyForm.addEventListener('submit', (event) => {
    // event.preventDefault();

    const isValid = handleFormSubmit(
      applyForm,
      applySuccess,
      'Thank you for joining the waitlist. We’ll keep you updated.',
      'Please complete all required fields before submitting.'
    );

    if (!isValid) {
  event.preventDefault();
  return;

    const data = Object.fromEntries(new FormData(applyForm));
    submissions.push(data);
    console.log('Apply submissions', submissions);

    setTimeout(() => {
      applyForm.reset();
    }, 950);
  });
}

const closeMenu = () => {
  document.body.classList.remove('nav-open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
  if (document.body.classList.contains('nav-open')) {
    navToggle.setAttribute('aria-expanded', 'true');
  } else {
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

navBackdrop?.addEventListener('click', closeMenu);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = link.getAttribute('data-target');
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  });
});
