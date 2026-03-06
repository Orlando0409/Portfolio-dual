// Inicializar EmailJS si está configurado
if (typeof emailjs !== 'undefined' && globalThis.EMAILJS_CONFIG) {
  emailjs.init(globalThis.EMAILJS_CONFIG.PUBLIC_KEY);
}

// Cuando la página carga, inicializar todas las funcionalidades
document.addEventListener('DOMContentLoaded', () => {
  initSelectorPage();
  initPortfolioPage();
  initScrollAnimations();
  initSmoothScroll();
  initMobileMenu();
  initContactForm();
  initProjectModal();
});

// === PÁGINA DE SELECCIÓN ===
function initSelectorPage() {
  const selectorCards = document.querySelectorAll('.selector-card');
  
  if (selectorCards.length === 0) return;
  
  selectorCards.forEach(card => {
    card.addEventListener('click', () => {
      handlePortfolioSelection(card);
    });
    
    // Permitir selección con teclado
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePortfolioSelection(card);
      }
    });
  });
}

// Guardar selección y navegar al portafolio
function handlePortfolioSelection(card) {
  const personId = card.dataset.person;
  
  if (!personId) {
    console.error('No se encontró el ID de la persona');
    return;
  }
  
  // Efecto visual al hacer clic
  card.style.transform = 'scale(0.95)';
  
  localStorage.setItem('selectedPortfolio', personId);
  
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.setAttribute('aria-busy', 'true');
  }
  
  // Navegar después de un momento para que se vea el efecto
  setTimeout(() => {
    globalThis.location.href = 'portfolio.html';
  }, 300);
}

// === PÁGINA DEL PORTAFOLIO ===
function initPortfolioPage() {
  const portfolioPage = document.querySelector('.portfolio-page');
  if (!portfolioPage) return;
  
  const selectedPortfolio = localStorage.getItem('selectedPortfolio');
  
  // Si no hay portafolio seleccionado, volver al selector
  if (!selectedPortfolio) {
    globalThis.location.href = 'index.html';
  }
}

// === ANIMACIONES AL SCROLL ===
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  if (animatedElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Si es la sección de habilidades, animar las barras
        if (entry.target.classList.contains('habilidades-tecnicas')) {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Animar barras de habilidades una por una
function animateSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate');
    }, index * 100);
  });
}

// === SCROLL SUAVE ENTRE SECCIONES ===
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#' || !href) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Cerrar menú móvil si está abierto
        const mobileMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu?.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Calcular posición considerando la altura del nav
        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        history.pushState(null, '', href);
        
        // Foco en la sección para lectores de pantalla
        targetSection.setAttribute('tabindex', '-1');
        targetSection.focus();
      }
    });
  });
}

// === MENÚ MÓVIL ===
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (isExpanded) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      if (navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
  
  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  });
}

//  FORMULARIO DE CONTACTO 

function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea');
  
  // Validar cuando el usuario sale del campo
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    // Limpiar error cuando empieza a escribir
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errorSpan = input.parentElement.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = '';
      }
    });
  });
  
  // Manejar envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) return;
    
    // Preparar UI para envío
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      // Verificar si EmailJS está configurado
      if (typeof emailjs === 'undefined') {
        throw new TypeError('EmailJS no está cargado');
      }
      
    else {
        // Envío con EmailJS
        await sendEmailWithEmailJS(form);
      }
      
      // Mostrar mensaje de éxito
      showSuccessMessage(form);
      
      // Reset formulario
      form.reset();
      
    } catch (error) {
      console.error('❌ Error:', error);
      showErrorMessage(form, error.message || 'Error al enviar el mensaje');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// Enviar email usando EmailJS
async function sendEmailWithEmailJS(form) {
  const formData = new FormData(form);
   //obtiene datos del formulario
  // Preparar datos para EmailJS con los nombres de variables de la plantilla
  const templateParams = {
    from_name: formData.get('name'),
    reply_to: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    time: new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  
  // Enviar con EmailJS
  const response = await emailjs.send(
    globalThis.EMAILJS_CONFIG.SERVICE_ID,
    globalThis.EMAILJS_CONFIG.TEMPLATE_ID,
    templateParams
  );
  
  return response;
}



// Mostrar mensaje de error en el formulario
function showErrorMessage(form, message) {
  let errorDiv = form.querySelector('.form-error-message');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.style.cssText = `
      padding: 15px;
      margin-top: 15px;
      background-color: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      color: #c33;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    form.appendChild(errorDiv);
  }
  
  errorDiv.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>${message}</span>
  `;
  errorDiv.style.display = 'flex';
  
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Validar un campo del formulario
function validateField(field) {
  const errorSpan = field.parentElement.querySelector('.form-error');
  let errorMessage = '';
  
  // Campo obligatorio
  if (field.hasAttribute('required') && !field.value.trim()) {
    errorMessage = 'Este campo es obligatorio';
  }
  
  // Validar formato de email
  if (field.type === 'email' && field.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value.trim())) {
      errorMessage = 'Ingresa un correo electrónico válido';
    }
  }
  
  // Validar longitud mínima del mensaje
  if (field.name === 'message' && field.value.trim() && field.value.trim().length < 10) {
    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
  }
  
  if (errorMessage) {
    field.classList.add('error');
    if (errorSpan) errorSpan.textContent = errorMessage;
    return false;
  } else {
    field.classList.remove('error');
    if (errorSpan) errorSpan.textContent = '';
    return true;
  }
}

// === MODAL DE PROYECTOS ===

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (!modal) return;
  
  // Cerrar modal
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeModal(modal);
    });
  });
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal(modal);
    }
  });
}

// Abrir modal con info del proyecto
function openProjectModal(project) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  const techList = project.tecnologias.map(tech => 
    `<span class="tech-tag">${tech}</span>`
  ).join('');
  
  const content = `
    <div class="proyecto-image-wrapper">
      <img src="${project.imagen}" alt="${project.titulo}" class="proyecto-image">
      ${project.destacado ? '<div class="proyecto-badge">Destacado</div>' : ''}
    </div>
    <div style="padding: var(--spacing-xl) 0;">
      <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md);">${project.titulo}</h2>
      <div style="margin-bottom: var(--spacing-xl);">
        ${techList}
      </div>
      <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: var(--spacing-xl);">
        ${project.descripcion}
      </p>
      ${project.enlace ? `
        <a href="${project.enlace}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Ver Proyecto
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L16 9M16 9L10 15M16 9H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      ` : ''}
    </div>
  `;
  
  modalBody.innerHTML = content;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modal.focus();
}

// Cerrar modal
function closeModal(modal) {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// === NAV ACTIVO SEGÚN SCROLL ===

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

updateActiveNavLink();

// Hacer disponible globalmente para portfolioLoader.js
globalThis.openProjectModal = openProjectModal;
