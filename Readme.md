# WanderScape Travel

A premium travel landing page built as a portfolio-grade frontend project, focused on polished UI, responsive layout, accessibility, and modern user experience patterns.

## Overview

WanderScape Travel is a fictional travel brand landing page designed to showcase a professional approach to frontend development.  
The project highlights:

- semantic HTML structure,
- modern responsive CSS,
- accessible interaction patterns,
- scroll-based enhancements,
- client-side form validation,
- reusable design tokens,
- premium visual presentation.

The goal of this project is not only to create an attractive landing page, but also to demonstrate thoughtful implementation decisions aligned with real-world frontend standards.

---

## Live Demo

> **Demo:** [https://jandresdevelop.github.io/Wanderscape-travel-landing-page/](https://jandresdevelop.github.io/Wanderscape-travel-landing-page/)

---

## Repository

> **Repository:** [https://github.com/jandresdevelop/Wanderscape-travel-landing-page](https://github.com/jandresdevelop/Wanderscape-travel-landing-page)

---

## Features

- Premium hero section with trust signals and featured travel card
- Sticky responsive navigation
- Mobile navigation with accessible toggle behavior
- Active section highlighting while scrolling
- Scroll progress indicator
- Animated reveal-on-scroll effects
- Animated trust metrics
- Responsive card-based layout
- FAQ section using semantic `details` and `summary`
- Enhanced contact form with client-side validation
- Character counter for textarea
- Accessible focus states and skip link
- Basic SEO and social metadata
- Structured data with JSON-LD

---

## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

No frameworks or libraries were used for the core implementation.

---

## Project Structure

```bash
WanderScape-Travel/
│
├── index.html
├── README.md
│
├── css/
│   └── styles.css
│
├── js/
│   └── script.js
│
└── assets/
    ├── favi.ico
    ├── images/
    │   ├── hero-beach.webp
    │   ├── colosseo.webp
    │   ├── alps.webp
    │   └── sea.webp
    └── screenshots/
        └── preview-cover.png
```

## Design and Development Goals

Key goals included:

- creating a strong visual identity,
- improving perceived product quality,
- making the interface feel more realistic and conversion-oriented,
- reinforcing accessibility and semantic structure,
- keeping the codebase readable and maintainable.

---

## Accessibility Considerations

Accessibility was considered throughout the project, including:

- semantic landmarks (`header`, `main`, `section`, `footer`, `nav`)
- skip link for keyboard users
- visible `:focus-visible` states
- descriptive labels for form controls
- `aria-live` regions for validation feedback
- `aria-expanded` and `aria-controls` for mobile navigation
- reduced-motion support with `prefers-reduced-motion`
- meaningful alt text for content images
- keyboard support for menu closing with `Escape`

---

## SEO Considerations

The project includes foundational SEO improvements such as:

- descriptive page title
- meta description
- Open Graph metadata
- Twitter card metadata
- canonical URL
- theme color
- structured data using JSON-LD (`TravelAgency`)

---

## JavaScript Functionality

The JavaScript layer is organized by responsibility and includes:

- mobile navigation behavior
- sticky header scroll state
- active navigation link tracking
- scroll progress bar updates
- textarea character counter
- client-side form validation
- reveal-on-scroll animation logic
- animated trust bar counters

---

## Form Validation

The contact form includes client-side validation for:

- full name
- email address
- preferred package
- number of travelers
- destination field length
- message minimum and maximum length

Validation feedback is shown inline and announced through accessible status messaging.

> **Note:** this project currently simulates form submission on the frontend. .

---

## Performance Notes

Some performance-conscious choices included:

- optimized `.webp` image usage
- `loading="lazy"` on below-the-fold images
- preloading of the hero image
- lightweight JavaScript without external dependencies
- reduced-motion handling for animation-sensitive users

Further production optimizations could include:

- self-hosted fonts
- AVIF image formats
- CSS/JS minification
- backend-powered form handling

---

## How to Run Locally

Because this is a static frontend project, you can run it locally very easily.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Use a local server

Using VS Code with Live Server is recommended.

#### Example

1. Clone the repository
2. Open the project folder in VS Code
3. Run with Live Server

---

## Installation

```bash
git clone https://github.com/jandresdevelop/Wanderscape-travel-landing-page
cd wanderscape-travel
```

Then open the project in your browser or local development server.

---

## Author

**Jose Andres Hernandez**

- GitHub: [https://github.com/jandresdevelop](https://github.com/jandresdevelop)
- Email: [jandresdevelop@gmail.com](jandresdevelop@gmail.com)

---

## License

This project is for educational and portfolio purposes.

If you want, you can use the [MIT License](https://opensource.org/licenses/MIT) for open-source publication.

## Screenshot

![Main View](assets/screenshots/preview-cover.png)

```

```
