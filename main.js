/* ============================
   ARQUITECTURA DEL FORMULARIO (FORMSPREE)
   ============================
   El envío del formulario lo maneja Formspree, un "backend de formularios":
   en lugar de mandar el correo desde el navegador con claves (como hacía
   EmailJS), hacemos un POST a un único endpoint y Formspree se encarga de
   validar, filtrar spam, guardar la submission y reenviarla por email.

   El endpoint vive en el atributo `action` del <form> en index.html, así que
   ése es el ÚNICO lugar donde hay que configurarlo. Más abajo, en el handler
   de envío, lo leemos con `contactForm.getAttribute('action')`.

   👉 Reemplazá el ID de ejemplo por el de tu formulario:
      action="https://formspree.io/f/TU_FORM_ID"
   ============================ */

/* ============================
   DOM READY - MAIN INITIALIZATION
   ============================ */
document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const contactForm = document.getElementById('contactForm');
    const navHeight = navbar ? navbar.offsetHeight : 80;

    /* --------- NAVBAR SCROLL EFFECT --------- */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --------- SMOOTH SCROLL & ACTIVE NAV LINK --------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            // Calcular posición considerando navbar fijo
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
            window.scrollTo({ top, behavior: 'smooth' });

            // Actualizar enlace activo
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* --------- SKILL BARS ANIMATION --------- */
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width') || bar.style.width || '0';
                if (/^\d+$/.test(width)) {
                    bar.style.width = width + '%';
                } else {
                    bar.style.width = width;
                }
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.45 });

    skillBars.forEach(b => skillObserver.observe(b));

    /* --------- SCROLL REVEAL FOR SECTIONS & CARDS --------- */
    const revealItems = document.querySelectorAll('.reveal, .card-reveal, .project-card, .feature-item, .skill-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.18 });

    revealItems.forEach(i => revealObserver.observe(i));

    /* --------- CONTACT FORM - ENVÍO CON FORMSPREE --------- */
    // Flujo: validar (HTML5 + reglas propias) → POST AJAX al endpoint → feedback visual.
    if (contactForm) {
        // El endpoint se toma del atributo `action` del propio <form> (única fuente de verdad).
        const formEndpoint = contactForm.getAttribute('action');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1) Validación nativa de HTML5 (required, type="email", etc.)
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // 2) Reglas de negocio más estrictas que HTML5
            if (name.length < 3) {
                showAlert('error', '✗ El nombre debe tener al menos 3 caracteres.');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('error', '✗ Por favor ingresa un email válido (ej: pepe@gmail.com).');
                return;
            }
            if (message.length < 10) {
                showAlert('error', '✗ El mensaje debe tener al menos 10 caracteres.');
                return;
            }

            // 3) Evitar enviar si el endpoint todavía no fue configurado
            if (!formEndpoint || formEndpoint.includes('XXXXXXXX')) {
                console.error('Configurá el atributo action del form en index.html con tu URL de Formspree.');
                showAlert('error', '✗ Falta configurar el endpoint de Formspree (ver consola).');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // 4) Estado "enviando"
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Enviando...';
            console.log('📨 Enviando formulario a Formspree...');

            try {
                // FormData recoge automáticamente todos los campos con atributo `name`.
                // El header Accept: application/json le pide a Formspree una respuesta JSON
                // en vez de redirigir a su "Thank You page".
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // 200/OK → éxito
                    console.log('✅ Formulario enviado correctamente');
                    btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>¡Mensaje enviado!';
                    btn.style.background = 'var(--color-success)';
                    btn.style.borderColor = 'var(--color-success)';

                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                    showAlert('success', '✅ ¡Mensaje enviado correctamente! Me pondré en contacto pronto.');
                } else {
                    // Formspree devuelve los errores de validación en JSON (ej: un campo mal formado)
                    const data = await response.json().catch(() => ({}));
                    const detail = (data.errors || []).map(err => err.message).join(' ');
                    throw new Error(detail || `Error ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Error al enviar el formulario:', error);
                showAlert('error', '✗ No se pudo enviar. Intentá de nuevo o escribime a fedeferessin2001@gmail.com');
                btn.innerHTML = '<i class="fa-solid fa-exclamation-triangle me-2"></i>Error al enviar';
                btn.style.background = 'var(--color-danger)';
                btn.style.borderColor = 'var(--color-danger)';
            } finally {
                // Restaurar el botón siempre (éxito o error) luego de un breve lapso
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                }, 3000);
            }
        });
    }

    /* --------- NOTIFICATION BUTTON --------- */
    document.querySelectorAll('.notify-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const project = btn.dataset.project || 'Proyecto';
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.disabled = true;

            showAlert('info', `✓ Te notificaremos cuando "${project}" esté disponible.`);

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);

            console.log(`Notificación solicitada para: ${project}`);
        });
    });

    /* --------- COPY EMAIL BUTTON --------- */
    const copyBtn = document.getElementById('copyEmail');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = 'fedeferessin2001@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="d-none d-sm-inline">¡Copiado!</span>';
                copyBtn.style.background = 'var(--color-success)';
                
                setTimeout(() => {
                    copyBtn.innerHTML = original;
                    copyBtn.style.background = '';
                }, 2000);
            } catch (err) {
                showAlert('error', '✗ No se pudo copiar el email.');
            }
        });
    }

    /* --------- SCROLL TOP BUTTON --------- */
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Volver al inicio');
    document.body.appendChild(scrollBtn);
    scrollBtn.style.display = 'none';

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* --------- ACCESSIBILITY: focus styles for project cards --------- */
    document.querySelectorAll('.project-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('focus', () => card.classList.add('in-view'));
    });

}); // DOMContentLoaded end

/* ============================
   ALERT HELPER FUNCTION
   ============================ */
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    const alertType = type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info';
    
    alertDiv.className = `alert alert-${alertType} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.style.margin = '0 0 1rem 0';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insertar alerta en el contacto
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        const contactForm = contactSection.querySelector('.contact-form');
        if (contactForm && contactForm.parentElement) {
            const existingAlert = contactForm.parentElement.querySelector('.alert');
            if (existingAlert) existingAlert.remove();
            contactForm.parentElement.insertBefore(alertDiv, contactForm);
        }
    }

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

/* ============================
   PAGE LOAD COMPLETE
   ============================ */
window.addEventListener('load', () => {
    console.log('✅ Portfolio cargado correctamente!');
    console.log('💡 Si tienes problemas, abre la consola (F12) para ver los mensajes de diagnóstico.');
});
