# Ganesh Mahata — Personal Portfolio Website

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://MahataG.github.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A complete, modern, and fully responsive personal portfolio website built with pure HTML, CSS, and JavaScript — hosted on GitHub Pages.

---

## 🌐 Live Site

**[https://MahataG.github.io](https://MahataG.github.io)**

---

## 👤 About

**Ganesh Mahata**  
B.Tech Biotechnology — Indian Institute of Technology Delhi (IIT Delhi)

Passionate about Biotechnology, Artificial Intelligence, Embedded Systems, IoT, and Full Stack Web Development.

---

## ✨ Features

- 🌙 **Dark / Light Mode** — Persistent theme with system preference detection
- 📱 **Fully Responsive** — Mobile-first design for all screen sizes
- ✨ **Smooth Animations** — Scroll reveal, typed text, particle canvas, tilt effect
- 🚀 **Fast Loading** — No frameworks, pure vanilla HTML/CSS/JS
- 🔍 **SEO Friendly** — Meta tags, Open Graph, structured data (JSON-LD)
- ♿ **Accessible** — ARIA labels, keyboard navigation, semantic HTML
- 🖨️ **Print Ready** — Clean print stylesheet for the resume page

---

## 📁 Folder Structure

```
MahataG.github.io/
│
├── index.html              ← Home page
├── README.md
├── LICENSE
├── .gitignore
├── favicon.ico
│
├── css/
│   ├── style.css           ← Main styles (tokens, layout, components)
│   ├── dark.css            ← Dark mode overrides
│   └── responsive.css      ← Responsive breakpoints
│
├── js/
│   ├── main.js             ← Core utilities (navbar, mobile nav, forms)
│   ├── theme.js            ← Dark/light mode manager (runs first)
│   └── animation.js        ← Scroll reveal, typed text, particles
│
├── pages/
│   ├── about.html          ← About + Education + Skills + Research + Certs
│   ├── projects.html       ← All projects with filter
│   ├── resume.html         ← Full resume view with PDF download
│   └── contact.html        ← Contact form + FAQ
│
└── assets/
    ├── images/             ← Profile photos, OG image
    ├── icons/              ← Favicons, Apple touch icon
    ├── fonts/              ← Self-hosted fonts (optional)
    ├── certificates/       ← Certificate PDFs / images
    ├── projects/           ← Project screenshots
    ├── documents/          ← Additional documents
    └── resume/
        └── Ganesh_Mahata_CV.pdf
```

---

## 📄 Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `index.html` | Hero, about preview, skills, projects preview, research, CTA |
| About | `pages/about.html` | Full about, education timeline, tabbed skills, research, certs, hobbies |
| Projects | `pages/projects.html` | All 10 projects with category filter |
| Resume | `pages/resume.html` | Full CV with PDF download |
| Contact | `pages/contact.html` | Contact form, FAQ, social links |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure & semantics |
| CSS3 | Styling, animations, dark mode |
| JavaScript (ES6+) | Interactivity, animations |
| GitHub Pages | Hosting |
| Formspree (optional) | Contact form backend |

---

## 🚀 Deployment — GitHub Pages

### Step 1 — Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: Complete portfolio website"
```

### Step 2 — Create GitHub Repository
Create a new repository at [github.com/new](https://github.com/new) named exactly:
```
MahataG.github.io
```

### Step 3 — Push to GitHub
```bash
git remote add origin https://github.com/MahataG/MahataG.github.io.git
git branch -M main
git push -u origin main
```

### Step 4 — Enable GitHub Pages
Go to: **Repository → Settings → Pages → Source: Deploy from a branch → Branch: main → / (root)**

Your site will be live at: **https://MahataG.github.io** (within ~5 minutes)

---

## ⚙️ Contact Form Setup (Formspree)

To make the contact form actually send emails:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy your Form ID (e.g., `xpzgqkjb`)
3. Open `js/main.js` and replace:
   ```js
   const FORMSPREE_ID = 'YOUR_FORM_ID';
   ```
   with:
   ```js
   const FORMSPREE_ID = 'xpzgqkjb'; // your actual ID
   ```

---

## 📝 Customization

### Update Personal Info
- Email: Search for `your@email.com` in all files and replace
- GitHub: Replace `MahataG` with your GitHub username
- LinkedIn: Replace `https://linkedin.com/in/` with your full LinkedIn URL
- Resume: Place your PDF at `assets/resume/Ganesh_Mahata_CV.pdf`

### Add Your Photo
Place a square profile photo at `assets/images/profile.jpg` and update the avatar sections in the HTML files.

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Google Fonts](https://fonts.google.com/) — Inter, Fira Code, Space Grotesk
- [Formspree](https://formspree.io/) — Contact form backend
- Built with ❤️ by **Ganesh Mahata**

---

*Made with pure HTML, CSS & JavaScript — no frameworks needed!*
