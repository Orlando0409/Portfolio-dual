// ============================================
// CARGA DINÁMICA DE DATOS DEL PORTAFOLIO
// ============================================

(function() {
  'use strict';
  
  // Solo ejecutar en la página de portafolio
  if (!document.querySelector('.portfolio-page')) {
    return;
  }
  
  const selectedPortfolio = localStorage.getItem('selectedPortfolio');
  
  if (!selectedPortfolio) {
    globalThis.location.href = 'index.html';
    return;
  }
  
  loadPortfolioData(selectedPortfolio);
  
  // Cargar datos desde el JSON
  async function loadPortfolioData(personId) {
    const loadingScreen = document.querySelector('.loading-screen');
    
    try {
      if (loadingScreen) {
        loadingScreen.setAttribute('aria-busy', 'true');
      }
      
      const response = await fetch(`data/${personId}.json`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data?.personalInfo) {
        throw new Error('Datos inválidos');
      }
      
      // Renderizar todas las secciones
      renderPersonalInfo(data.personalInfo);
      renderEducation(data.educacion);
      renderExperience(data.experiencia);
      renderSkills(data.habilidades);
      renderLanguages(data.idiomas);
      renderProjects(data.proyectos);
      renderContactInfo(data.personalInfo);
      renderSocialLinks(data.redesSociales);
      updatePageTitle(data.personalInfo.nombre);
      
      // Esperar un poco antes de ocultar la pantalla de carga
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          loadingScreen.setAttribute('aria-busy', 'false');
        }
      }, 500);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      showErrorMessage(error.message);
      
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }
  }
  
  // Renderizar info personal en la sección hero
  function renderPersonalInfo(personalInfo) {
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
      heroImage.src = personalInfo.foto;
      heroImage.alt = `${personalInfo.nombre} - ${personalInfo.rol}`;
    }
    
    const heroName = document.getElementById('hero-name');
    if (heroName) {
      heroName.textContent = personalInfo.nombre;
    }
    
    const heroRole = document.getElementById('hero-role');
    if (heroRole) {
      heroRole.textContent = personalInfo.rol;
    }
    
    const heroDescription = document.getElementById('hero-description');
    if (heroDescription) {
      heroDescription.textContent = personalInfo.descripcion;
    }
    
    const footerName = document.getElementById('footer-name');
    if (footerName) {
      footerName.textContent = personalInfo.nombre;
    }
  }
  
  // Renderizar timeline de educación
  function renderEducation(educacion) {
    const timeline = document.getElementById('educacion-timeline');
    if (!timeline || !educacion || educacion.length === 0) return;
    
    timeline.innerHTML = educacion.map(edu => `
      <div class="timeline-item">
        <div class="timeline-content">
          <h3 class="timeline-title">${edu.titulo}</h3>
          <p class="timeline-subtitle">${edu.institucion}</p>
          <p class="timeline-period">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 4V8L10.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            ${edu.periodo}
          </p>
          <p class="timeline-description">${edu.descripcion}</p>
        </div>
      </div>
    `).join('');
  }
  
  // Renderizar timeline de experiencia laboral
  function renderExperience(experiencia) {
    const timeline = document.getElementById('experiencia-timeline');
    if (!timeline || !experiencia || experiencia.length === 0) return;
    
    timeline.innerHTML = experiencia.map(exp => `
      <div class="timeline-item">
        <div class="timeline-content">
          <h3 class="timeline-title">${exp.puesto}</h3>
          <p class="timeline-subtitle">${exp.empresa}</p>
          <p class="timeline-period">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 4V8L10.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            ${exp.periodo}
          </p>
          <p class="timeline-description">${exp.descripcion}</p>
          ${exp.logros && exp.logros.length > 0 ? `
            <ul class="timeline-achievements">
              ${exp.logros.map(logro => `<li>${logro}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  // Renderizar habilidades técnicas y blandas
  function renderSkills(habilidades) {
    if (!habilidades) return;
    
    // Habilidades técnicas con barra de progreso
    const tecnicasList = document.getElementById('habilidades-tecnicas-list');
    if (tecnicasList && habilidades.tecnicas) {
      tecnicasList.innerHTML = habilidades.tecnicas.map(skill => `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${skill.nombre}</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="--skill-width: ${skill.nivel}%"></div>
          </div>
        </div>
      `).join('');
    }
    
    // Lista de habilidades blandas
    const blandasList = document.getElementById('habilidades-blandas-list');
    if (blandasList && habilidades.blandas) {
      blandasList.innerHTML = habilidades.blandas.map(skill => `
        <li>${skill}</li>
      `).join('');
    }
  }
  
  // Renderizar idiomas
  function renderLanguages(idiomas) {
    const idiomasGrid = document.getElementById('idiomas-grid');
    if (!idiomasGrid || !idiomas || idiomas.length === 0) return;
    
    idiomasGrid.innerHTML = idiomas.map(idioma => `
      <div class="idioma-card">
        <h3 class="idioma-name">${idioma.idioma}</h3>
        <p class="idioma-level">${idioma.nivel}</p>
      </div>
    `).join('');
  }
  
  // Renderizar grid de proyectos
  function renderProjects(proyectos) {
    const proyectosGrid = document.getElementById('proyectos-grid');
    if (!proyectosGrid || !proyectos || proyectos.length === 0) return;
    
    proyectosGrid.innerHTML = proyectos.map(proyecto => `
      <article class="proyecto-card">
        <div class="proyecto-image-wrapper">
          <img 
            src="${proyecto.imagen}" 
            alt="${proyecto.titulo}"
            class="proyecto-image"
            loading="lazy"
          >
          ${proyecto.destacado ? '<div class="proyecto-badge">Destacado</div>' : ''}
        </div>
        <div class="proyecto-content">
          <h3 class="proyecto-title">${proyecto.titulo}</h3>
          <p class="proyecto-description">${truncateText(proyecto.descripcion, 150)}</p>
          <div class="proyecto-tech">
            ${proyecto.tecnologias.slice(0, 3).map(tech => 
              `<span class="tech-tag">${tech}</span>`
            ).join('')}
            ${proyecto.tecnologias.length > 3 ? 
              `<span class="tech-tag">+${proyecto.tecnologias.length - 3}</span>` : ''
            }
          </div>
          <div class="proyecto-actions">
            <button 
              class="btn btn-secondary" 
              onclick="openProjectModal(${JSON.stringify(proyecto).replaceAll('"', '&quot;')})"
              aria-label="Ver detalles de ${proyecto.titulo}"
            >
              Ver Detalles
            </button>
            ${proyecto.enlace ? `
              <a 
                href="${proyecto.enlace}" 
                class="btn btn-primary" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Abrir proyecto ${proyecto.titulo}"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('');
  }
  
  // Renderizar info de contacto
  function renderContactInfo(personalInfo) {
    const email = document.getElementById('contact-email');
    if (email) {
      email.textContent = personalInfo.email;
    }
    
    const phone = document.getElementById('contact-phone');
    if (phone) {
      phone.textContent = personalInfo.telefono;
    }
    
    const location = document.getElementById('contact-location');
    if (location) {
      location.textContent = personalInfo.ubicacion;
    }
  }
  
  // Renderizar enlaces de redes sociales
  function renderSocialLinks(redesSociales) {
    const socialContainer = document.getElementById('hero-social');
    if (!socialContainer || !redesSociales) return;
    
    const socialIcons = {
      github: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>`,
      linkedin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`,
    };
    
    const links = Object.entries(redesSociales).map(([platform, url]) => {
      const icon = socialIcons[platform] || '';
      return `
        <a 
          href="${url}" 
          class="social-link" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="${platform}"
          title="${platform}"
        >
          ${icon}
        </a>
      `;
    }).join('');
    
    socialContainer.innerHTML = links;
  }
  
  // Actualizar el título de la página
  function updatePageTitle(nombre) {
    document.title = `${nombre} | Portafolio`;
  }
  
  // Truncar texto largo
  function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  }
  
  // Mostrar pantalla de error
  function showErrorMessage(message) {
    const errorHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-surface);
        padding: var(--spacing-2xl);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        max-width: 500px;
        text-align: center;
        z-index: 10000;
      ">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto var(--spacing-lg);">
          <circle cx="32" cy="32" r="30" stroke="var(--color-error)" stroke-width="4"/>
          <path d="M32 20V36M32 44V44.1" stroke="var(--color-error)" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <h2 style="color: var(--color-error); margin-bottom: var(--spacing-md);">Error al cargar el portafolio</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">${message}</p>
        <a href="index.html" class="btn btn-primary">Volver al selector</a>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHTML);
  }
  
})();
