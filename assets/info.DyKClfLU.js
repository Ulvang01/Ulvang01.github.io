import"./modulepreload-polyfill.B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{fetch("../../assets/cv/education.json").then(e=>e.json()).then(e=>u(e)).catch(e=>console.error("Error loading education data:",e)),fetch("../../assets/cv/experience.json").then(e=>e.json()).then(e=>h(e)).catch(e=>console.error("Error loading experience data:",e)),fetch("../../assets/cv/skills.json").then(e=>e.json()).then(e=>m(e)).catch(e=>console.error("Error loading skills data:",e)),fetch("../../assets/projects/projects.json").then(e=>e.json()).then(e=>p(e)).catch(e=>console.error("Error loading projects data:",e));const s=document.querySelectorAll("section"),o=document.querySelectorAll(".nav-link"),t={root:null,rootMargin:"0px",threshold:.5},n=new IntersectionObserver(e=>{e.forEach(a=>{const r=a.target.getAttribute("id"),l=document.querySelector(`.nav-link[data-section="${r}"]`);a.isIntersecting&&(o.forEach(d=>d.classList.remove("active")),l.classList.add("active"))})},t);s.forEach(e=>n.observe(e));let c=window.scrollY;const i=document.querySelector("header");window.addEventListener("scroll",()=>{window.scrollY===0?i.style.top="0":window.scrollY>c?i.style.top="-80px":i.style.top="0",c=window.scrollY})});document.querySelectorAll(".nav-link").forEach(s=>{s.addEventListener("click",function(o){o.preventDefault();const t=this.getAttribute("href").substring(1),n=document.getElementById(t);window.scrollTo({top:n.offsetTop,behavior:"smooth"})})});function p(s){const o=document.getElementById("featured-projects").querySelector(".project-list"),t=document.getElementById("unity-projects").querySelector(".project-list"),n=document.getElementById("other-projects").querySelector(".project-list");s.forEach(c=>{const i=document.createElement("div");i.classList.add("project-item"),i.innerHTML=`
        <div class="project-header">
          <h4>${c.title}</h4>
          <a href="${c.link}" target="_blank" class="project-icon" title="View Project">
            <img src="../../assets/images/external-link-symbol.png" alt="View Project">
          </a>
        </div>
        <p>${c.description}</p>
        <div class="languages">Languages: ${c.languages.join(", ")}</div>
      `,c.category==="featured"?o.appendChild(i):c.category==="unity"?t.appendChild(i):c.category==="other"&&n.appendChild(i)})}function u(s){const o=document.getElementById("education-list");s.forEach(t=>{const n=document.createElement("li");n.classList.add("education-item"),n.innerHTML=`
        <div class="education-header">
            <span class="education-title">${t.title}</span>
            <span class="education-year">${t.year}</span>
        </div>
        <span class="education-location">${t.location}</span>
        <p class="education-description">${t.description}</p>
        `,o.appendChild(n)})}function h(s){const o=document.getElementById("experience-list");s.forEach(t=>{const n=document.createElement("li");n.classList.add("experience-item"),n.innerHTML=`
        <div class="experience-header">
            <span class="experience-title">${t.title}</span>
            <span class="experience-year">${t.year}</span>
        </div>
        <span class="experience-location">${t.location}</span>
        <p class="experience-description">${t.description}</p>
        `,o.appendChild(n)})}function m(s){const o=document.getElementById("skills-list");s.forEach(t=>{const n=document.createElement("div");n.classList.add("skill"),n.innerHTML=`
        <span>${t.name}</span>
        <div class="progress-bar">
          <div class="progress" style="width: ${t.level}%;"></div>
        </div>
        `,o.appendChild(n)})}
