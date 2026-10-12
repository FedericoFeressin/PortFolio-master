# Federico Feressin — Portfolio Web Full-Stack

Portfolio personal de **Federico Feressin**, desarrollador web full-stack. Un sitio estático, rápido y responsive que reúne mi perfil profesional, mis habilidades técnicas y mis proyectos destacados, con un formulario de contacto funcional gestionado por **Formspree**.

> Diseño limpio y minimalista, pensado para presentar mi trabajo y facilitar que clientes o reclutadores me contacten en pocos clics.

---

## 📑 Índice

- [Vista general](#-vista-general)
- [Características principales](#-características-principales)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación y uso local](#-instalación-y-uso-local)
- [Configuración del formulario (Formspree)](#-configuración-del-formulario-formspree)
- [Personalización](#-personalización)
- [Despliegue](#-despliegue)
- [Responsive y rendimiento](#-responsive-y-rendimiento)
- [Accesibilidad y SEO](#-accesibilidad-y-seo)
- [Autor y contacto](#-autor-y-contacto)
- [Licencia](#-licencia)

---

## 🔎 Vista general

El sitio está compuesto por una _one page_ con navegación por anclas y scroll suave. Cada sección responde a tres preguntas clave de UX:

- **¿Qué hago?** → Hero + sección *Sobre mí*.
- **¿Por qué confiar?** → *Habilidades* + proyectos reales publicados.
- **¿Qué acción sigue?** → Formulario de contacto + redes sociales.

Las secciones incluidas son:

1. **Inicio (Hero):** presentación, stack principal y llamados a la acción.
2. **Sobre mí:** descripción profesional, estadísticas y pilares de trabajo (código limpio, responsive, performance).
3. **Habilidades:** barras animadas de progreso por área (Frontend, Backend, Herramientas).
4. **Proyectos destacados:** grilla de proyectos con tecnologías y enlaces a demo/código.
5. **Contacto:** formulario validado que envía el mensaje vía Formspree.
6. **Footer:** redes sociales y créditos.

---

## ✨ Características principales

- **Header fijo** que cambia de estilo al hacer scroll (transparente → con fondo).
- **Scroll suave** entre secciones, compensando la altura del navbar y marcando el enlace activo.
- **Menú responsive** con Bootstrap (colapsable en mobile).
- **Animaciones al hacer scroll** con `IntersectionObserver` (aparición de secciones, tarjetas y features).
- **Barras de habilidades animadas** que se completan al entrar en pantalla.
- **Formulario de contacto funcional** gestionado por Formspree:
  - Validación HTML5 + validaciones personalizadas (nombre, email válido, longitud del mensaje).
  - Envío por AJAX (`fetch`), sin recargar la página.
  - Estado del botón "Enviando…" → "¡Mensaje enviado!" y alertas de éxito/error con auto-cierre.
  - Protección antispam con honeypot (`_gotcha`) y filtrado del lado del servidor.
- **Botón para volver arriba** que aparece tras hacer scroll.
- **Botón para copiar el email** al portapapeles.
- **Accesibilidad:** foco navegable en tarjetas, `aria-label` en íconos, enlace "saltar al contenido".

---

## 🛠 Stack tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura y contenido |
| **CSS3** | Estilos propios, variables, Flexbox y Grid, responsive |
| **JavaScript (Vanilla)** | Interactividad, animaciones y lógica del formulario |
| **Bootstrap 5.3** (CDN) | Grilla y utilidades de layout |
| **Bootstrap Icons 1.13** (CDN) | Íconos de navegación |
| **Font Awesome 6.4** (CDN) | Íconos de proyectos y contacto |
| **Google Fonts** | Tipografías *Inter* y *Syne* |
| **Formspree** | Backend del formulario de contacto (sin servidor propio) |
| **IntersectionObserver API** | Animaciones y contador al hacer scroll |

> No se utiliza ningún framework JS (React/Next). El objetivo es un sitio liviano y fácil de mantener.

---

## 📁 Estructura del proyecto

```
PortFolio-master/
├── index.html            # Estructura y contenido del sitio
├── style.css             # Estilos personalizados
├── main.js               # Interactividad y lógica del formulario
├── .gitignore            # Archivos que no se versionan
├── .github/
│   └── workflows/        # Deploy automático a GitHub Pages
├── Resources/
│   └── img/              # Imágenes de proyectos y perfil
└── README.md
```

> 📦 **Legado:** `config.example.js` y `email-template.html` pertenecen a la integración anterior con EmailJS. Ya no se usan y pueden eliminarse sin afectar el sitio.

---

## 🚀 Instalación y uso local

No requiere dependencias ni proceso de build. Al ser un sitio estático, basta con clonar y abrir.

### 1. Clonar el repositorio

```bash
git clone https://github.com/FedericoFeressin-Dev/PortFolio-master.git
cd PortFolio-master
```

### 2. Configurar el formulario (Formspree)

No hace falta crear ningún archivo de configuración: el endpoint vive en el atributo `action` del `<form>` en `index.html`. Seguí la [sección de Formspree](#-configuración-del-formulario-formspree) para obtener el tuyo y pegarlo.

### 3. Abrir el sitio

Podés abrir `index.html` directamente en el navegador. Para un entorno más realista (recomendado), usá un servidor local:

```bash
# Opción con Python
python -m http.server 5500

# Opción con Node
npx serve .
```

Y visitá `http://localhost:5500`.

---

## 📧 Configuración del formulario (Formspree)

El formulario usa **[Formspree](https://formspree.io/)**, un servicio que actúa como backend del formulario: recibe el POST, valida los datos, filtra spam, guarda la submission y reenvía el mensaje por email. No requiere servidor propio ni claves expuestas en el cliente.

### ¿Qué es el endpoint?

Un **endpoint** es simplemente una URL a la que se le envían los datos. Formspree te da una con este formato:

```
https://formspree.io/f/XXXXXXXX
```

Ese `XXXXXXXX` es tu **Form ID**. El endpoint es público por diseño (a diferencia de una API key, **no es un secreto**), por eso va directamente en el HTML.

### Obtener tu endpoint

1. Creá una cuenta en [formspree.io](https://formspree.io/) e ingresá.
2. Andá a **+ Add New → New Form** y nombralo (ej. *Portfolio*).
3. Copiá el endpoint generado (`https://formspree.io/f/XXXXXXXX`).
4. Pegalo en el atributo `action` del formulario, en `index.html`:

```html
<form id="contactForm" action="https://formspree.io/f/XXXXXXXX" method="POST" novalidate>
```

> `main.js` lee el endpoint desde ese `action`, así que **es el único lugar donde hay que configurarlo**.

### Cómo viajan los datos

1. El usuario completa `name`, `email` y `message` (por eso los campos llevan atributo `name`).
2. `main.js` hace un `POST` con `fetch` y el header `Accept: application/json`, que permite recibir la respuesta en JSON y **no recargar la página**.
3. Formspree valida, filtra el spam y guarda la submission en tu panel.
4. Te llega un email de notificación con el mensaje.

### Extras incluidos

- Un **honeypot** (`_gotcha`, campo oculto) que bloquea bots, y `_subject` para el asunto del correo.
- Desde el panel de Formspree podés conectar **Slack, WhatsApp, Google Sheets** y más.
- El plan gratuito incluye 50 envíos/mes, filtrado de spam y guardado de submissions por 30 días.

---

## 🎨 Personalización

### Colores

Los colores principales se definen con variables CSS en `style.css`. Modificá la paleta en un solo lugar:

```css
:root {
    --color-accent: #00d9ff;   /* Color de acento principal */
    --color-primary: #7c3aed;  /* Acento secundario */
    /* ...resto de variables */
}
```

### Tipografías

Las fuentes se cargan desde Google Fonts en `index.html` (*Inter* + *Syne*). Para cambiarlas, reemplazá el `<link>` y actualizá las familias en `style.css`.

### Contenido

Todo el texto (nombre, descripción, proyectos, contacto) está en `index.html`, en HTML semántico y fácil de editar. Las imágenes se encuentran en `Resources/img/`.

---

## 🌐 Despliegue

Al ser un sitio estático, se puede publicar gratis en varios servicios. La opción más simple es **GitHub Pages**:

1. Subí el proyecto a GitHub.
2. Entrá a **Settings → Pages**.
3. En *Source*, elegí la rama `main` y la carpeta `/ (root)`.
4. Guardá y esperá unos segundos: el sitio quedará en `https://<usuario>.github.io/PortFolio-master/`.

Alternativas: **Vercel**, **Netlify** o **Cloudflare Pages** (arrastrar la carpeta o conectar el repo).

> 🚀 El repo incluye un workflow en `.github/workflows/deploy-pages.yml` que despliega automáticamente a GitHub Pages en cada push a `main`. Como el endpoint de Formspree va en `index.html`, **no se necesitan secrets ni pasos extra**.

---

## 📱 Responsive y rendimiento

- Diseño **Mobile First**, verificado en 320, 375, 390, 414, 768, 1024, 1280, 1440 y 1920 px.
- Sin scroll horizontal: uso de Flexbox/Grid y contenedores fluidos.
- Imágenes con **`loading="lazy"`** y atributos `alt` descriptivos.
- Animaciones con `IntersectionObserver` (se ejecutan solo cuando el elemento entra en pantalla).
- Fuentes con `preconnect` para mejorar la carga.

---

## ♿ Accesibilidad y SEO

- HTML semántico con jerarquía correcta de encabezados (H1–H6).
- Meta `title`, `description`, `keywords` y **Open Graph** básico.
- Enlace "saltar al contenido principal" para navegación por teclado.
- `aria-label` en enlaces e íconos interactivos.
- Estados de foco visibles en tarjetas y controles.
- Contraste cuidado en textos sobre imágenes (overlay).

---

## 👤 Autor y contacto

**Federico Feressin** — Desarrollador Web Full-Stack

- 📧 Email: [fedeferessin2001@gmail.com](mailto:fedeferessin2001@gmail.com)
- 💻 GitHub: [@FedericoFeressin-Dev](https://github.com/FedericoFeressin-Dev)
- 🔗 LinkedIn: [federico-feressin](https://www.linkedin.com/in/federico-feressin-45704331b/)
- 📸 Instagram: [@el_fedexs](https://www.instagram.com/el_fedexs/)

¿Te gustó el proyecto o querés uno similar? Escribime por el formulario del sitio o por cualquiera de mis redes.

---

## 📄 Licencia

Proyecto de uso personal y de portafolio. Podés inspirarte en el código para aprender, pero te pido **no reutilizarlo como si fuera tuyo**. Si tenés dudas sobre el uso, escribime.

---

<p align="center">
  Hecho con ❤️ por <strong>Federico Feressin</strong>
</p>
