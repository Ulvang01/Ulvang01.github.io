document.addEventListener('DOMContentLoaded', () => {
  // Load education data
  fetch('../../assets/cv/education.json')
    .then((response) => response.json())
    .then((data) => displayEducation(data))
    .catch((error) => console.error('Error loading education data:', error))

  // Load experience data
  fetch('../../assets/cv/experience.json')
    .then((response) => response.json())
    .then((data) => displayExperience(data))
    .catch((error) => console.error('Error loading experience data:', error))

  // Load skills data
  fetch('../../assets/cv/skills.json')
    .then((response) => response.json())
    .then((data) => displaySkills(data))
    .catch((error) => console.error('Error loading skills data:', error))

  // Load projects data
  fetch('../../assets/projects/projects.json')
    .then((response) => response.json())
    .then((data) => displayProjects(data))
    .catch((error) => console.error('Error loading projects data:', error))

  const sections = document.querySelectorAll('section')
  const navLinks = document.querySelectorAll('.nav-link')

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.getAttribute('id')
      const navLink = document.querySelector(
        `.nav-link[data-section="${sectionId}"]`
      )

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'))
        navLink.classList.add('active')
      }
    })
  }, observerOptions)

  sections.forEach((section) => observer.observe(section))

  let lastScrollY = window.scrollY
  const header = document.querySelector('header')

  window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
      header.style.top = '0'
    } else if (window.scrollY > lastScrollY) {
      header.style.top = '-80px'
    } else {
      header.style.top = '0'
    }
    lastScrollY = window.scrollY
  })
})

document.querySelectorAll('.nav-link').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    const targetId = this.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)

    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth', // Smooth scroll
    })
  })
})

function displayProjects(projects) {
  const featuredContainer = document
    .getElementById('featured-projects')
    .querySelector('.project-list')
  const unityContainer = document
    .getElementById('unity-projects')
    .querySelector('.project-list')
  const otherContainer = document
    .getElementById('other-projects')
    .querySelector('.project-list')

  projects.forEach((project) => {
    const projectElement = document.createElement('div')
    projectElement.classList.add('project-item')

    projectElement.innerHTML = `
        <div class="project-header">
          <h4>${project.title}</h4>
          <a href="${
            project.link
          }" target="_blank" class="project-icon" title="View Project">
            <img src="../../assets/images/external-link-symbol.png" alt="View Project">
          </a>
        </div>
        <p>${project.description}</p>
        <div class="languages">Languages: ${project.languages.join(', ')}</div>
      `

    if (project.category === 'featured') {
      featuredContainer.appendChild(projectElement)
    } else if (project.category === 'unity') {
      unityContainer.appendChild(projectElement)
    } else if (project.category === 'other') {
      otherContainer.appendChild(projectElement)
    }
  })
}

function displayEducation(educationData) {
  const educationList = document.getElementById('education-list')

  educationData.forEach((edu) => {
    const educationItem = document.createElement('li')
    educationItem.classList.add('education-item')

    educationItem.innerHTML = `
        <div class="education-header">
            <span class="education-title">${edu.title}</span>
            <span class="education-year">${edu.year}</span>
        </div>
        <span class="education-location">${edu.location}</span>
        <p class="education-description">${edu.description}</p>
        `

    educationList.appendChild(educationItem)
  })
}

function displayExperience(experienceData) {
  const experienceList = document.getElementById('experience-list')

  experienceData.forEach((exp) => {
    const experienceItem = document.createElement('li')
    experienceItem.classList.add('experience-item')

    experienceItem.innerHTML = `
        <div class="experience-header">
            <span class="experience-title">${exp.title}</span>
            <span class="experience-year">${exp.year}</span>
        </div>
        <span class="experience-location">${exp.location}</span>
        <p class="experience-description">${exp.description}</p>
        `

    experienceList.appendChild(experienceItem)
  })
}

function displaySkills(skillsData) {
  const skillsList = document.getElementById('skills-list')

  skillsData.forEach((skill) => {
    const skillItem = document.createElement('div')
    skillItem.classList.add('skill')

    skillItem.innerHTML = `
        <span>${skill.name}</span>
        <div class="progress-bar">
          <div class="progress" style="width: ${skill.level}%;"></div>
        </div>
        `

    skillsList.appendChild(skillItem)
  })
}

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links')
  const navGameMode = document.querySelector('.nav-game-mode')
  navLinks.classList.toggle('open')
  navGameMode.classList.toggle('open')
}
