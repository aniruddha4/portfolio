"use strict";
/* ---- Data (arrays drive the project filter and experience list) ---- */
const projects = [
  {title:"Task & Expense Tracker API",cat:"api",gh:"#",live:"#",
   text:"RESTful API for personal task and expense management with JWT authentication and PostgreSQL persistence via Entity Framework Core. Deployed with Docker on Railway, documented with Swagger/OpenAPI.",
   tags:["ASP.NET Core","Entity Framework Core","PostgreSQL","JWT Auth","Docker"]},
  {title:"E-Commerce Microservices Platform",cat:"microservices",gh:"#",live:null,
   text:"Distributed e-commerce system with independently deployable Product, Order and Notification services talking asynchronously via RabbitMQ (MassTransit). MongoDB and PostgreSQL storage, Redis caching, all services containerised on Railway.",
   tags:["ASP.NET Core","MassTransit/RabbitMQ","MongoDB","PostgreSQL","Redis","Docker"]},
  {title:"Clean Architecture Bookstore API",cat:"api",gh:"#",live:"#",
   text:"Bookstore management API with strict layer separation (Domain, Application, Infrastructure, API). CQRS with MediatR, domain-driven entities, a Result pattern for error handling and JWT authentication.",
   tags:["ASP.NET Core","Clean Architecture","CQRS/MediatR","Entity Framework Core","PostgreSQL"]},
  {title:"AI-Powered CV Analyser",cat:"ai",gh:"#",live:"#",
   text:"API that parses uploaded PDF resumes and scores them against job descriptions using OpenAI GPT-4o-mini. Returns match scores, skill gaps and actionable feedback as consistent JSON.",
   tags:["ASP.NET Core","OpenAI API","PdfPig","Prompt Engineering"]}
];
const jobs = [
  {role:"Assistant Manager",org:"MedNxt Medical Eservices, Kolkata",when:"July 2016 – July 2018",
   text:"Full-time IT Manager role: design and development of websites using MVC, jQuery, JavaScript and SQL Server with Entity Framework. Added and maintained 9 modules on the company website. Responsibilities: coding and testing, adding records to the database, new functionality and maintenance."},
  {role:"ASP.NET Developer",org:"SKC Infotech Pvt. Ltd., Kolkata",when:"May 2013 – May 2015",
   text:"Full-time developer of web and desktop applications using ASP.NET MVC, C#, CSS, jQuery, Crystal Reports and SQL Server. Full-stack work covering UI design, database integration, reporting and deployment. Delivered 15 ASP.NET websites and .NET applications."},
  {role:"Associate IT Engineer",org:"CMC Ltd / DS Infotech, Kolkata",when:"December 2012 – March 2013",
   text:"Contract role from 10 Dec 2012: maintenance of insurance websites and insurance packages/products on the Microsoft .NET platform, including Silverlight."},
  {role:"Data Entry Operator (part-time, remote)",org:"Stradigi Corp Pvt. Ltd., Saudi Arabia",when:"July 2016 – January 2022",
   text:"Part-time remote data entry for a Saudi Arabia based start-up."}
];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---- Mobile navigation ---- */
const menu = $("#menu"), menuBtn = $("#menuBtn");
function setMenu(open){menu.classList.toggle("open", open);menuBtn.setAttribute("aria-expanded", open);menuBtn.textContent = open ? "✕" : "☰";}
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => {if (e.target.closest("a")) setMenu(false);});
document.addEventListener("keydown", e => {if (e.key === "Escape") setMenu(false);});

/* ---- Dark / light mode ---- */
const root = document.documentElement;
$("#themeBtn").addEventListener("click", () => {
  const isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const next = isDark ? "light" : "dark";
  root.dataset.theme = next;
  try {localStorage.setItem("theme", next);} catch (e) {}
});

/* ---- Typing animation ---- */
const titles = ["ASP.NET Core Developer", "Backend Engineer", "Microservices Builder", "Cloud-Ready Applications"];
const typed = $("#typed");
let ti = 0, ci = 0, deleting = false;
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {typed.textContent = titles[0];}
else (function tick(){
  const word = titles[ti];
  ci += deleting ? -1 : 1;
  typed.textContent = word.slice(0, ci);
  let delay = deleting ? 40 : 90;
  if (!deleting && ci === word.length) {deleting = true; delay = 1400;}
  else if (deleting && ci === 0) {deleting = false; ti = (ti + 1) % titles.length; delay = 400;}
  setTimeout(tick, delay);
})();

/* ---- Project filtering (array methods) ---- */
const grid = $("#projectGrid");
function renderProjects(filter){
  const list = filter === "all" ? projects : projects.filter(p => p.cat === filter);
  grid.innerHTML = list.map(p => `
    <article class="card proj">
      <div class="thumb">${esc(p.title)}</div>
      <div class="body">
        <h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
        <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="plinks"><a href="${p.gh}" target="_blank" rel="noopener">GitHub</a>${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : ""}</div>
      </div>
    </article>`).join("");
}
$(".filters").addEventListener("click", e => {
  const b = e.target.closest("[data-filter]"); if (!b) return;
  $$(".chip-btn").forEach(x => x.classList.toggle("active", x === b));
  renderProjects(b.dataset.filter);
});
renderProjects("all");

/* ---- Experience ---- */
$("#jobList").innerHTML = jobs.map(j => `<li><h3>${esc(j.role)}</h3><p class="meta">${esc(j.org)} · ${esc(j.when)}</p><p>${esc(j.text)}</p></li>`).join("");

/* ---- Contact form: validation + sending via FormSubmit (no secret keys needed) ---- */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/aniruddha.mukhopadhyay4@gmail.com";
const form = $("#contactForm"), status = $("#formStatus");
const rules = {
  name: v => v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com.",
  message: v => v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."
};
function check(field){
  const msg = rules[field.name](field.value);
  field.classList.toggle("invalid", !!msg);
  field.setAttribute("aria-invalid", !!msg);
  field.parentElement.querySelector(".err").textContent = msg;
  return !msg;
}
Object.keys(rules).forEach(n => form.elements[n].addEventListener("blur", e => check(e.target)));
form.addEventListener("submit", async e => {
  e.preventDefault();
  status.className = ""; status.textContent = "";
  const valid = Object.keys(rules).map(n => check(form.elements[n])).every(Boolean);
  if (!valid) {form.querySelector(".invalid").focus(); return;}
  const btn = form.querySelector("button"); btn.disabled = true; btn.textContent = "Sending…";
  try {
    const res = await fetch(FORM_ENDPOINT, {method:"POST", headers:{"Accept":"application/json"}, body:new FormData(form)});
    if (!res.ok) throw new Error();
    form.reset(); status.className = "ok"; status.textContent = "Message sent. I will reply by email soon.";
  } catch (err) {
    status.className = "bad"; status.textContent = "The message was not sent. Check your connection and try again, or email me directly.";
  } finally {btn.disabled = false; btn.textContent = "Send message";}
});

/* ---- Back to top (scroll events) ---- */
const toTop = $("#toTop");
addEventListener("scroll", () => {toTop.hidden = scrollY < 500;}, {passive:true});
toTop.addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));

/* ---- Current year (Date object) ---- */
$("#year").textContent = new Date().getFullYear();
