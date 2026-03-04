// ============================================
// SISTEMA DE TEMA CLARO / OSCURO
// ============================================

(function() {
  'use strict';
  
  const THEME_KEY = 'portfolio-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  
  // Inicializar el sistema de temas
  function initTheme() {
    // Obtener tema guardado o usar preferencia del sistema
    const savedTheme = getSavedTheme();
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    
    applyTheme(initialTheme, false);
    setupThemeToggle();
    watchSystemTheme();
  }
  
  // Obtener tema guardado
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }
  
  // Obtener preferencia de tema del sistema
  function getSystemTheme() {
    if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  }
  
  // Aplicar tema al documento
  function applyTheme(theme, animate = true) {
    const root = document.documentElement;
    
    if (!animate) {
      root.style.transition = 'none';
    }
    
    root.dataset.theme = theme;
    
    // Guardar preferencia
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error guardando tema en localStorage:', error);
    }
    
    // Reactivar transiciones
    if (!animate) {
      // Forzar reflow
      root.offsetHeight;
      root.style.transition = '';
    }
    
    updateToggleButton(theme);
    globalThis.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }
  
  // Configurar botón de cambio de tema
  function setupThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    
    if (!toggleButton) return;
    
    toggleButton.addEventListener('click', () => {
      toggleTheme();
    });
    
    // Permitir usar teclado para cambiar tema
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  
  // Alternar entre tema claro y oscuro
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    
    
    applyTheme(newTheme, true);
    announceThemeChange(newTheme);
  }
  
  // Obtener tema actual del documento
  function getCurrentTheme() {
    const theme = document.documentElement.dataset.theme;
    return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  }
  
  // Actualizar icono y labels del botón
  function updateToggleButton(theme) {
    const toggleButton = document.querySelector('.theme-toggle');
    
    if (!toggleButton) return;
    
    const isDark = theme === THEME_DARK;
    const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    
    toggleButton.setAttribute('aria-label', label);
    toggleButton.setAttribute('title', label);
    toggleButton.classList.add('theme-toggle-active');
    setTimeout(() => {
      toggleButton.classList.remove('theme-toggle-active');
    }, 300);
  }
  
  // Detectar cambios en preferencia del sistema
  function watchSystemTheme() {
    if (!globalThis.matchMedia) return;
    
    const darkModeQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
      const savedTheme = getSavedTheme();
      if (!savedTheme) {
        const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme, true);
      }
    });
  }
  
  // Anunciar cambios para lectores de pantalla
  function announceThemeChange(theme) {
    const message = theme === THEME_DARK ? 'Modo oscuro activado' : 'Modo claro activado';
    
    let announcer = document.getElementById('theme-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'theme-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
  
  // API pública para usar desde otros scripts
  globalThis.themeManager = {
    toggle: toggleTheme,
    set: applyTheme,
    get: getCurrentTheme,
    isLight: () => getCurrentTheme() === THEME_LIGHT,
    isDark: () => getCurrentTheme() === THEME_DARK
  };
  
  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
})();

// Aplicar tema antes de que cargue la página para evitar parpadeo
(function() {
  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    } else {
      const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
    }
  } catch (error) {
    console.error('Error applying theme:', error);
    document.documentElement.dataset.theme = 'light';
  }
})();
