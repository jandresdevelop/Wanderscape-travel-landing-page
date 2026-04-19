const SELECTORS = {
  topbar: ".topbar",
  navToggle: ".nav-toggle",
  siteNav: ".site-nav",
  navOverlay: ".nav-overlay",
  navLinks: ".site-nav a",
  navActiveLinks: "[data-nav-link]",
  mainSections: "main section[id]",
  progressBar: ".scroll-progress-bar",
  revealElements: ".reveal",
  contactForm: "#contact-form",
  formStatus: "#form-status",
  submitButton: "#submit-button",
  messageField: "#message",
  messageCount: "#message-count",
  countTargets: "[data-count]",
};

const BREAKPOINTS = {
  mobileNav: 768,
};

function getFocusableElements(container) {
  if (!container) return [];

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return [...container.querySelectorAll(focusableSelector)].filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      !element.getAttribute("aria-hidden") &&
      element.offsetParent !== null,
  );
}

function setupMobileNav() {
  const navToggle = document.querySelector(SELECTORS.navToggle);
  const siteNav = document.querySelector(SELECTORS.siteNav);
  const navOverlay = document.querySelector(SELECTORS.navOverlay);
  const navLinks = [...document.querySelectorAll(SELECTORS.navLinks)];

  if (!navToggle || !siteNav || !navOverlay || !navLinks.length) return;

  let isMenuOpen = false;
  let lastFocusedElement = null;

  const syncMenuState = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );

    navToggle.classList.toggle("is-active", open);
    siteNav.classList.toggle("is-open", open);
    navOverlay.classList.toggle("is-visible", open);
    navOverlay.hidden = !open;
    navOverlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-open", open);
  };

  const openMenu = () => {
    if (isMenuOpen) return;

    isMenuOpen = true;
    lastFocusedElement = document.activeElement;
    syncMenuState(true);

    const focusableItems = getFocusableElements(siteNav);
    focusableItems[0]?.focus();
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    if (!isMenuOpen) return;

    isMenuOpen = false;
    syncMenuState(false);

    if (returnFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const trapFocus = (event) => {
    if (!isMenuOpen || event.key !== "Tab") return;

    const focusableItems = getFocusableElements(siteNav);
    if (!focusableItems.length) return;

    const firstElement = focusableItems[0];
    const lastElement = focusableItems[focusableItems.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  navToggle.addEventListener("click", () => {
    if (isMenuOpen) {
      closeMenu({ returnFocus: true });
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener("click", () => {
    closeMenu({ returnFocus: true });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!isMenuOpen) return;

    if (event.key === "Escape") {
      closeMenu({ returnFocus: true });
      return;
    }

    trapFocus(event);
  });

  document.addEventListener("click", (event) => {
    if (!isMenuOpen) return;

    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > BREAKPOINTS.mobileNav && isMenuOpen) {
      closeMenu();
    }
  });

  syncMenuState(false);
}

function setupHeaderScrollState() {
  const topbar = document.querySelector(SELECTORS.topbar);
  if (!topbar) return;

  const updateHeaderState = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function setupActiveNavLinks() {
  const sections = [...document.querySelectorAll(SELECTORS.mainSections)];
  const navLinks = [...document.querySelectorAll(SELECTORS.navActiveLinks)];

  if (!sections.length || !navLinks.length) return;

  const linksMap = new Map();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    linksMap.set(href.slice(1), link);
  });

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });

    const activeLink = linksMap.get(sectionId);
    if (!activeLink) return;

    activeLink.classList.add("is-active");
    activeLink.setAttribute("aria-current", "true");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleEntries.length) return;

      const currentSection = visibleEntries[0].target.id;
      if (currentSection) {
        setActiveLink(currentSection);
      }
    },
    {
      root: null,
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.2, 0.35, 0.5, 0.7],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupScrollProgress() {
  const progressBar = document.querySelector(SELECTORS.progressBar);
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupMessageCounter() {
  const messageField = document.querySelector(SELECTORS.messageField);
  const messageCount = document.querySelector(SELECTORS.messageCount);

  if (!messageField || !messageCount) return;

  const maxLength = Number(messageField.getAttribute("maxlength")) || 600;

  const updateCounter = () => {
    const currentLength = messageField.value.length;
    messageCount.textContent = `${currentLength} / ${maxLength}`;
  };

  updateCounter();
  messageField.addEventListener("input", updateCounter);
}

function setupFormValidation() {
  const form = document.querySelector(SELECTORS.contactForm);
  const formStatus = document.querySelector(SELECTORS.formStatus);
  const submitButton = document.querySelector(SELECTORS.submitButton);
  const submitButtonText = submitButton?.querySelector(".btn-text");

  if (!form || !formStatus || !submitButton || !submitButtonText) return;

  const validators = {
    required(value, message) {
      return value.trim() ? "" : message;
    },
    minLength(value, min, message) {
      return value.trim().length >= min ? "" : message;
    },
    maxLength(value, max, message) {
      return value.trim().length <= max ? "" : message;
    },
    email(value, message) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim()) ? "" : message;
    },
    numericRange(value, min, max, message) {
      if (!value.trim()) return "";
      const number = Number(value);

      if (Number.isNaN(number) || number < min || number > max) {
        return message;
      }

      return "";
    },
  };

  const fields = {
    name: {
      input: document.querySelector("#name"),
      error: document.querySelector("#name-error"),
      validate: (value) => {
        const requiredError = validators.required(
          value,
          "Please enter your full name.",
        );
        if (requiredError) return requiredError;

        const minError = validators.minLength(
          value,
          2,
          "Name must be at least 2 characters.",
        );
        if (minError) return minError;

        return validators.maxLength(
          value,
          80,
          "Name must be 80 characters or fewer.",
        );
      },
    },
    email: {
      input: document.querySelector("#email"),
      error: document.querySelector("#email-error"),
      validate: (value) => {
        const requiredError = validators.required(
          value,
          "Please enter your email address.",
        );
        if (requiredError) return requiredError;

        return validators.email(value, "Please enter a valid email address.");
      },
    },
    package: {
      input: document.querySelector("#package"),
      error: document.querySelector("#package-error"),
      validate: (value) => {
        return value ? "" : "Please select a preferred package.";
      },
    },
    travelers: {
      input: document.querySelector("#travelers"),
      error: document.querySelector("#travelers-error"),
      validate: (value) =>
        validators.numericRange(
          value,
          1,
          20,
          "Travelers must be a number between 1 and 20.",
        ),
    },
    destination: {
      input: document.querySelector("#destination"),
      error: document.querySelector("#destination-error"),
      validate: (value) => {
        if (!value.trim()) return "";

        return validators.maxLength(
          value,
          100,
          "Destination must be 100 characters or fewer.",
        );
      },
    },
    budget: {
      input: document.querySelector("#budget"),
      error: document.querySelector("#budget-error"),
      validate: () => "",
    },
    message: {
      input: document.querySelector("#message"),
      error: document.querySelector("#message-error"),
      validate: (value) => {
        const requiredError = validators.required(
          value,
          "Please share some trip details.",
        );
        if (requiredError) return requiredError;

        const minError = validators.minLength(
          value,
          20,
          "Please provide at least 20 characters for trip details.",
        );
        if (minError) return minError;

        return validators.maxLength(
          value,
          600,
          "Trip details must be 600 characters or fewer.",
        );
      },
    },
  };

  const fieldEntries = Object.entries(fields).filter(
    ([, field]) => field.input && field.error,
  );

  const clearFormStatus = () => {
    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");
  };

  const setFieldState = (fieldName) => {
    const field = fields[fieldName];
    if (!field?.input || !field?.error) return true;

    const value = field.input.value;
    const errorMessage = field.validate(value);

    field.error.textContent = errorMessage;
    field.input.classList.remove("input-error", "input-valid");
    field.input.removeAttribute("aria-invalid");

    if (errorMessage) {
      field.input.classList.add("input-error");
      field.input.setAttribute("aria-invalid", "true");
      return false;
    }

    if (value.trim()) {
      field.input.classList.add("input-valid");
    }

    return true;
  };

  const resetFieldsState = () => {
    fieldEntries.forEach(([, field]) => {
      field.input.classList.remove("input-error", "input-valid");
      field.input.removeAttribute("aria-invalid");
      field.error.textContent = "";
    });
  };

  fieldEntries.forEach(([fieldName, field]) => {
    field.input.addEventListener("input", () => {
      setFieldState(fieldName);
      if (formStatus.textContent) {
        clearFormStatus();
      }
    });

    field.input.addEventListener("blur", () => {
      setFieldState(fieldName);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;

    fieldEntries.forEach(([fieldName, field]) => {
      const isFieldValid = setFieldState(fieldName);

      if (!isFieldValid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field.input;
        }
      }
    });

    if (!isFormValid) {
      formStatus.textContent =
        "Please fix the highlighted fields and try again.";
      formStatus.classList.remove("success");
      formStatus.classList.add("error");
      firstInvalidField?.focus();
      return;
    }

    submitButton.disabled = true;
    submitButtonText.textContent = "Sending...";
    clearFormStatus();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      formStatus.textContent =
        "Your travel inquiry has been sent successfully.";
      formStatus.classList.remove("error");
      formStatus.classList.add("success");

      form.reset();
      resetFieldsState();

      const messageCount = document.querySelector(SELECTORS.messageCount);
      if (messageCount) {
        messageCount.textContent = "0 / 600";
      }
    } catch {
      formStatus.textContent =
        "Something went wrong while sending your inquiry. Please try again.";
      formStatus.classList.remove("success");
      formStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButtonText.textContent = "Send Inquiry";
    }
  });
}

function setupRevealAnimations() {
  const revealElements = [
    ...document.querySelectorAll(SELECTORS.revealElements),
  ];
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function setupStatsCounter() {
  const statNumbers = [...document.querySelectorAll(SELECTORS.countTargets)];
  if (!statNumbers.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const formatValue = (target) => {
    if (target >= 1000) return `${Math.floor(target / 1000)}k+`;
    if (target === 12) return "12 yrs";
    if (target === 40) return "40+";
    if (target === 98) return "98%";
    return `${target}+`;
  };

  const animateValue = (element, target) => {
    if (prefersReducedMotion) {
      element.textContent = formatValue(target);
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easedProgress);

      element.textContent = formatValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatValue(target);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, statsObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.getAttribute("data-count"));

        if (!Number.isNaN(target)) {
          animateValue(element, target);
        }

        statsObserver.unobserve(element);
      });
    },
    {
      threshold: 0.5,
    },
  );

  statNumbers.forEach((element) => observer.observe(element));
}

function init() {
  setupMobileNav();
  setupHeaderScrollState();
  setupActiveNavLinks();
  setupScrollProgress();
  setupMessageCounter();
  setupFormValidation();
  setupRevealAnimations();
  setupStatsCounter();
}

document.addEventListener("DOMContentLoaded", init);
