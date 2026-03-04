# Portfolio Dual - Laboratorio 01

**Curso:** Fundamentos de Programación Web

**Fecha:** Marzo 2026

**Proyecto:** Sitio Web Académico de Currículum y Portafolio Dual

## Descripción del Proyecto

Portfolio Dual es una plataforma académica diseñada para gestionar y visualizar dos perfiles profesionales distintos de manera dinámica. El sitio permite alternar entre currículos, proyectos y habilidades mediante la carga de datos externos, garantizando una experiencia de usuario fluida y personalizada.

El desarrollo se realizó exclusivamente con tecnologías nativas (HTML5, CSS3 y JavaScript Vanilla), priorizando el rendimiento, la accesibilidad WCAG AA y la implementación de heurísticas de usabilidad.

## Arquitectura del Sistema

La estructura del proyecto sigue una organización modular para facilitar el mantenimiento y la escalabilidad de los perfiles:

* **Directorio Raíz:** Contiene el acceso principal (index.html) y la vista de portafolio (portfolio.html).
* **Carpeta CSS:** División lógica en estilos base, componentes de layout y adaptaciones responsive.
* **Carpeta JS:** Controladores para la lógica general, el motor de carga dinámica mediante archivos JSON y el gestor de temas.
* **Carpeta Data:** Repositorio de información en formato JSON para cada perfil profesional.

## Fundamentos de Diseño y UX

El proyecto integra principios de diseño centrado en el usuario para optimizar la navegación:

* **Optimización de Carga Cognitiva:** Aplicación de la Ley de Hick en la selección de perfiles y la Ley de Miller para organizar la navegación en grupos de información manejables.
* **Jerarquía y Lectura:** Implementación de patrones de lectura en "F" y leyes de proximidad de la Gestalt para guiar la vista hacia los elementos clave.
* **Interacción Profesional:** Áreas de contacto optimizadas según la Ley de Fitts y feedback constante sobre el estado del sistema mediante estados de carga y validaciones en tiempo real.
* **Sistema de Temas:** Soporte nativo para modo claro y oscuro que detecta la preferencia del sistema operativo y permite la persistencia de la elección del usuario.

## Especificaciones Técnicas

Para asegurar la calidad del software y una arquitectura robusta, se implementaron las siguientes soluciones:

* **Gestión Dinámica de Datos:** Uso de la Fetch API para cargar perfiles de forma asíncrona, permitiendo actualizar la información de los usuarios sin modificar el código fuente del sitio.
* **Diseño Adaptativo (Mobile-First):** Sistema de breakpoints estratégicos que aseguran la correcta visualización desde dispositivos móviles de 320px hasta pantallas de gran formato.
* **Accesibilidad Integral:** Cumplimiento de estándares WCAG AA, incluyendo contrastes validados, navegación completa por teclado, etiquetas ARIA para lectores de pantalla y respeto a las preferencias de reducción de movimiento.
* **Rendimiento Optimizado:** Ausencia de dependencias externas o frameworks, logrando un tiempo de carga mínimo y un peso total de recursos inferior a 100KB.

## Instalación y Despliegue

### Configuración Local

1. Clonar el repositorio desde la fuente oficial.
2. Acceder al directorio del proyecto.
3. Ejecutar mediante un servidor local (por ejemplo, Live Server en VS Code o el módulo http.server de Python) para permitir las peticiones asíncronas de los archivos JSON.

### Acceso a la Demo

El proyecto se encuentra desplegado y funcional en el siguiente enlace:
[Ver sitio en vivo](https://orlando0409.github.io/index.html)


## Autoría y Licencia

Este proyecto ha sido desarrollado como parte del programa académico de Fundamentos de Programación Web. La distribución y uso de este código está bajo la Licencia MIT.
