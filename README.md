# Portafolio de Ana Alvarado

Sitio profesional de Ana Alvarado: educadora tech y desarrolladora Full Stack enfocada en Backend Java e inteligencia artificial aplicada.

## Arquitectura

El proyecto es un sitio estático sin dependencias de ejecución:

- `index.html`: contenido semántico, SEO, datos estructurados y formulario.
- `style.css`: sistema visual, componentes y responsive.
- `app.js`: menú móvil, indicador de lectura, navegación activa y mejoras progresivas.
- `gracias.html` y `404.html`: estados de éxito y error.
- `netlify.toml`: publicación, caché y cabeceras de seguridad.
- `scripts/validate.mjs`: validaciones automáticas sin paquetes externos.

No existe un backend propio porque el portafolio no lo necesita. El formulario usa **Netlify Forms**, que recibe los mensajes en el panel del sitio sin exponer credenciales en el navegador.

## Desarrollo local

Puedes servir la carpeta con cualquier servidor estático. Por ejemplo:

```bash
python -m http.server 4173
```

Luego abre `http://localhost:4173`.

## Validación

Requiere Node.js 18 o superior y no instala dependencias:

```bash
npm test
```

La validación revisa archivos esenciales, metadatos SEO, enlaces internos, ids duplicados, etiquetas de formulario, recursos locales y JSON-LD.

## Despliegue

Netlify publica directamente la raíz del repositorio. Al desplegar, detecta automáticamente el formulario llamado `contacto`.

## Contenido profesional

Los proyectos enlazados se basan en repositorios públicos verificables del perfil de GitHub de Ana:

- VetCare: backend en Java/Spring Boot y frontend en Angular.
- Smart Academic API: laboratorio de APIs y desarrollo asistido por IA.
- Java Backend + IA: ruta modular de formación y proyectos integradores.
