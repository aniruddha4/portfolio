# Personal Portfolio – Aniruddha Mukhopadhyay

Plain HTML5, CSS and JavaScript. No build step: open `index.html` in a browser.

## Run locally (Windows)
Double-click `run-website.bat`, or in the VS Code terminal run `.\run-website.ps1`, or press Ctrl+Shift+B in VS Code. It opens http://localhost:5500 in Chrome.

## Upload to GitHub
Double-click `upload-to-github.bat` (or run `.\upload-to-github.ps1`). Run it again whenever you add or change files. Then enable GitHub Pages in the repo Settings > Pages.

## Before publishing
1. Photo is at `images/profile.jpg` and CV at `documents/resume.pdf` (replace the files to update them).
2. In `js/script.js`, replace the `gh` / `live` values (`"#"`) in the `projects` array with your real GitHub and live-demo links.
3. The CV is publicly downloadable: remove the ID number and date of birth from it first.

## Contact form
The form posts to FormSubmit (https://formsubmit.co), a trusted form service, which forwards each message to your email. No API key is stored in the code.
The first submission after publishing sends an activation email to your inbox: click the confirm link once, then messages arrive normally. The form only works from a hosted site (not `file://`).

## Publishing
Upload the folder to GitHub Pages, Netlify or Vercel.

## JavaScript features
Mobile menu, dark/light toggle (saved in localStorage), typing animation (setTimeout), project filter (Array.filter), form validation (submit/blur events), back-to-top (scroll event), smooth scrolling (CSS scroll-behavior), footer year (Date).
