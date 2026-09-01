/* ============================
   EMAILJS INITIALIZATION & DIAGNOSTICS
   ============================ */
(function () {
    console.log('🔍 Iniciando diagnóstico de EmailJS...');

    // Verificar si EmailJS está disponible
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS no está cargado. Verifica que el script esté en el HTML.');
        return;
    }

    // Verificar configuración
    if (typeof EMAILJS_CONFIG === 'undefined') {
        console.error('❌ config.js no está cargado o EMAILJS_CONFIG no está definido.');
        console.log('📝 Asegúrate de que config.js esté antes de main.js en el HTML.');
        return;
    }

    const config = EMAILJS_CONFIG;

    // Validar que todos los valores estén configurados (valores reales, no placeholders)
    const missingConfig = [];
    if (!config.PUBLIC_KEY || config.PUBLIC_KEY.includes('YOUR_') || config.PUBLIC_KEY.length < 10) {
        missingConfig.push('PUBLIC_KEY');
    }
    if (!config.SERVICE_ID || config.SERVICE_ID.includes('XXXXX') || config.SERVICE_ID.length < 10) {
        missingConfig.push('SERVICE_ID');
    }
    if (!config.TEMPLATE_ID || config.TEMPLATE_ID.includes('XXXXX') || config.TEMPLATE_ID.length < 10) {
        missingConfig.push('TEMPLATE_ID');
    }

    if (missingConfig.length > 0) {
        console.warn(`⚠️ Configuración incompleta en config.js. Falta: ${missingConfig.join(', ')}`);
        console.log('📝 Actualiza estos valores en config.js con tus credenciales de EmailJS');
        showDiagnosticAlert(missingConfig);
        return;
    }

    // Inicializar EmailJS
    try {
        emailjs.init(config.PUBLIC_KEY);
        console.log('✅ EmailJS inicializado correctamente');
        console.log('📊 Configuración:');
        console.log(`   - Service ID: ${config.SERVICE_ID.substring(0, 20)}...`);
        console.log(`   - Template ID: ${config.TEMPLATE_ID.substring(0, 20)}...`);
        console.log(`   - Receiver Email: ${config.RECEIVER_EMAIL}`);
    } catch (error) {
        console.error('❌ Error al inicializar EmailJS:', error);
    }
})();

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

    /* --------- CONTACT FORM - EMAILJS INTEGRATION --------- */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validación HTML5
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Verificar configuración de EmailJS
            if (typeof EMAILJS_CONFIG === 'undefined') {
                showAlert('error', '❌ Error: Configuración de EmailJS no encontrada. Verifica config.js');
                console.error('EMAILJS_CONFIG no está definido');
                return;
            }

            // Validar que los valores sean válidos (no placeholders)
            const requiredFields = {
                'PUBLIC_KEY': EMAILJS_CONFIG.PUBLIC_KEY,
                'SERVICE_ID': EMAILJS_CONFIG.SERVICE_ID,
                'TEMPLATE_ID': EMAILJS_CONFIG.TEMPLATE_ID
            };

            for (const [field, value] of Object.entries(requiredFields)) {
                if (!value || value.includes('YOUR_') || value.includes('XXXXX')) {
                    showAlert('error', `❌ Error: Debes configurar tu ${field} en config.js`);
                    return;
                }
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const originalClass = btn.className;

            // Obtener datos del formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validaciones adicionales
            if (!name || !email || !message) {
                showAlert('error', '✗ Por favor completa todos los campos.');
                return;
            }

            // Validar email (cualquier email válido, no necesariamente el tuyo)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('error', '✗ Por favor ingresa un email válido (ej: pepe@gmail.com).');
                return;
            }

            // Validar que el nombre tenga al menos 3 caracteres
            if (name.length < 3) {
                showAlert('error', '✗ El nombre debe tener al menos 3 caracteres.');
                return;
            }

            // Validar que el mensaje tenga al menos 10 caracteres
            if (message.length < 10) {
                showAlert('error', '✗ El mensaje debe tener al menos 10 caracteres.');
                return;
            }

            // Cambiar estado del botón a "enviando"
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Enviando...';

            console.log('📨 Intentando enviar email...');
            console.log('   Nombre:', name);
            console.log('   De:', email);
            console.log('   Mensaje:', message.substring(0, 50) + '...');

            try {
                // Enviar email usando EmailJS
                // El email se enviará A TU CORREO (RECEIVER_EMAIL) 
                // pero el remitente será quien completó el formulario
                const response = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    {
                        from_name: name,           // Nombre del visitante
                        from_email: email,         // Email del visitante (pepe@gmail.com, etc)
                        message: message,          // Mensaje del visitante
                        to_email: EMAILJS_CONFIG.RECEIVER_EMAIL,  // Tu email (fedeferessin2001@gmail.com)
                        reply_to: email,            // Responder al email del visitante
                        timestamp: new Date().toLocaleString() // <-- agrega esto si quieres fecha en el email
                    }
                );

                if (response.status === 200) {
                    // Éxito
                    console.log('✅ Email enviado exitosamente', response);
                    btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>¡Mensaje enviado!';
                    btn.style.background = 'var(--color-success)';
                    btn.style.borderColor = 'var(--color-success)';

                    // Limpiar formulario
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');

                    // Mostrar alerta de éxito
                    showAlert('success', '✅ ¡Mensaje enviado correctamente! Me pondré en contacto pronto.');

                    // Reset del botón después de 4 segundos
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                    }, 4000);
                }
            } catch (error) {
                console.error('❌ Error al enviar email:', error);
                console.error('Error details:', {
                    message: error.message,
                    status: error.status,
                    text: error.text
                });

                // Mostrar mensaje de error específico
                let errorMsg = '✗ Error al enviar. Intenta nuevamente o usa: fedeferessin2001@gmail.com';

                if (error.text && error.text.includes('AccessDenied')) {
                    errorMsg = '✗ Error: SERVICE_ID o TEMPLATE_ID incorrectos. Verifica config.js';
                } else if (error.text && error.text.includes('Bad Request')) {
                    errorMsg = '✗ Error: Los datos no coinciden con tu plantilla. Verifica los campos en config.js';
                } else if (error.status === 401) {
                    errorMsg = '✗ Error de autenticación. Verifica tu PUBLIC_KEY en config.js';
                } else if (error.status === 429) {
                    errorMsg = '✗ Demasiadas solicitudes. Intenta en unos minutos.';
                }

                btn.innerHTML = '<i class="fa-solid fa-exclamation-triangle me-2"></i>Error al enviar';
                btn.style.background = 'var(--color-danger)';
                btn.style.borderColor = 'var(--color-danger)';

                showAlert('error', errorMsg);

                // Reset del botón después de 3 segundos
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
   DIAGNOSTIC ALERT
   ============================ */
function showDiagnosticAlert(missingFields) {
    const message = `
        <strong>⚠️ EmailJS no está configurado correctamente</strong><br>
        Faltan los siguientes campos en <code>config.js</code>:<br>
        <ul style="text-align: left; margin: 0.5rem 0;">
            ${missingFields.map(field => `<li><code>${field}</code></li>`).join('')}
        </ul>
        Abre la consola (F12) para más detalles.
    `;
    
    console.log('%cEmailJS Configuration Required:', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('Missing fields:', missingFields);
}

/* ============================
   PAGE LOAD COMPLETE
   ============================ */
window.addEventListener('load', () => {
    console.log('✅ Portfolio cargado correctamente!');
    console.log('💡 Si tienes problemas, abre la consola (F12) para ver los mensajes de diagnóstico.');
});
