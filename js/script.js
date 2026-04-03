function setupMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!navToggle || !siteNav) return;

  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  };

  const openMenu = () => {
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("is-open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });
}

function setupFormValidation() {
  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const submitButton = document.querySelector("#submit-button");
  const submitButtonText = submitButton?.querySelector(".btn-text");

  if (!form || !formStatus || !submitButton || !submitButtonText) return;

  const fields = {
    name: {
      input: document.querySelector("#name"),
      error: document.querySelector("#name-error"),
      validate: (value) => {
        if (!value.trim()) return "Please enter your full name.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      input: document.querySelector("#email"),
      error: document.querySelector("#email-error"),
      validate: (value) => {
        if (!value.trim()) return "Please enter your email address.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim()))
          return "Please enter a valid email address.";
        return "";
      },
    },
    package: {
      input: document.querySelector("#package"),
      error: document.querySelector("#package-error"),
      validate: (value) => {
        if (!value) return "Please select a preferred package.";
        return "";
      },
    },
    travelers: {
      input: document.querySelector("#travelers"),
      error: document.querySelector("#travelers-error"),
      validate: (value) => {
        if (!value.trim()) return "";
        const number = Number(value);
        if (Number.isNaN(number) || number < 1 || number > 20) {
          return "Travelers must be a number between 1 and 20.";
        }
        return "";
      },
    },
    message: {
      input: document.querySelector("#message"),
      error: document.querySelector("#message-error"),
      validate: (value) => {
        if (!value.trim()) return "Please share some trip details.";
        if (value.trim().length < 20) {
          return "Please provide at least 20 characters for trip details.";
        }
        return "";
      },
    },
  };

  const setFieldState = (fieldName) => {
    const field = fields[fieldName];
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

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];

    field.input.addEventListener("input", () => {
      setFieldState(fieldName);
    });

    field.input.addEventListener("blur", () => {
      setFieldState(fieldName);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;

    Object.keys(fields).forEach((fieldName) => {
      const isFieldValid = setFieldState(fieldName);

      if (!isFieldValid && !firstInvalidField) {
        firstInvalidField = fields[fieldName].input;
      }

      if (!isFieldValid) {
        isFormValid = false;
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
    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    formStatus.textContent = "Your travel inquiry has been sent successfully.";
    formStatus.classList.remove("error");
    formStatus.classList.add("success");

    form.reset();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      field.input.classList.remove("input-error", "input-valid");
      field.input.removeAttribute("aria-invalid");
      field.error.textContent = "";
    });

    submitButton.disabled = false;
    submitButtonText.textContent = "Send Inquiry";
  });
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || revealElements.length === 0) {
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
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

setupMobileNav();
setupFormValidation();
setupRevealAnimations();
