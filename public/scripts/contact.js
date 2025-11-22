document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('#contact-form');
    if (contactForm && window.emailjs) {
        try {
            emailjs.init('abVGTM5SPduJoXhYL');
        } catch (err) {

        }

        const SERVICE_ID = 'service_imfd129';
        const TEMPLATE_ID = 'template_292fh4n';

        const submitBtn = contactForm.querySelector('.submit-btn');
        const msgEl = document.querySelector('#form-message');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const honeypot = contactForm.querySelector('[name="honeypot"]');
            if (honeypot && honeypot.value) return;

                const nameVal = contactForm.name.value || '';
                const emailVal = contactForm.email.value || '';
                const projectVal = contactForm.project.value || '';
                const refVal = contactForm.ref.value || '';

                const composed = `Name: ${nameVal}\nEmail: ${emailVal}\n\nProject description:\n${projectVal}\n\nHeard about us via: ${refVal}`;

                const templateParams = {
                    from_name: nameVal,
                    from_email: emailVal,
                    project: projectVal,
                    ref: refVal,
                    message: composed
                };

            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            if (msgEl) {
                msgEl.classList.remove('hidden');
                msgEl.textContent = 'Sending…';
                msgEl.setAttribute('aria-hidden', 'false');
            }

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(function(response) {
                    if (msgEl) msgEl.textContent = 'Message sent. Thank you!';
                    contactForm.reset();
                }, function(error) {
                    if (msgEl) msgEl.textContent = 'Sorry. Something went wrong. Please try again or email us directly.';
                    console.error('EmailJS error', error);
                })
                .finally(function() {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                });
      });
    }
});