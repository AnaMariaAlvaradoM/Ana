 emailjs.init('S71uulqDXROPVUCtR');

    // ── Cursor ───────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cursor.style.left=mx+'px'; cursor.style.top=my+'px';
    });
    (function loop(){
      rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.service-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>{ ring.style.width='44px'; ring.style.height='44px'; ring.style.opacity='.7'; });
      el.addEventListener('mouseleave',()=>{ ring.style.width='30px'; ring.style.height='30px'; ring.style.opacity='1'; });
    });

    // ── Hamburger ────────────────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click',()=>{ hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
    function closeMobileMenu(){ hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }

    // ── Scroll reveal ────────────────────────────────────
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
    },{threshold:.1});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    // ── Skill bars ───────────────────────────────────────
    const barIO = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ const f=e.target; f.style.transform=`scaleX(${f.dataset.w})`; }});
    },{threshold:.5});
    document.querySelectorAll('.skill-bar-fill').forEach(f=>barIO.observe(f));

    // ── Formulario con EmailJS ───────────────────────────
    const nameInput    = document.getElementById('contact-name');
    const emailInput   = document.getElementById('contact-email');
    const msgInput     = document.getElementById('contact-msg');
    const sendBtn      = document.getElementById('send-btn');
    const formFeedback = document.getElementById('form-feedback');

    sendBtn.addEventListener('click', async () => {
      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim();
      const message = msgInput.value.trim();

      if (!name || !email || !message) {
        showFeedback('Por favor completa todos los campos.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Ingresa un email válido.', 'error');
        return;
      }

      sendBtn.textContent = 'Enviando...';
      sendBtn.disabled = true;

      try {
        await emailjs.send('service_f86jjuo', 'template_x26jd1k', {
          from_name:  name,
          from_email: email,
          message:    message,
        });
        showFeedback('¡Mensaje enviado! Te responderé pronto 🙌', 'success');
        nameInput.value = ''; emailInput.value = ''; msgInput.value = '';
        sendBtn.textContent = 'Enviado ✓';
        setTimeout(() => { sendBtn.textContent = 'Enviar mensaje →'; sendBtn.disabled = false; }, 4000);
      } catch(err) {
        showFeedback('Hubo un error al enviar. Intenta de nuevo.', 'error');
        sendBtn.textContent = 'Enviar mensaje →';
        sendBtn.disabled = false;
      }
    });

    function showFeedback(msg, type) {
      formFeedback.textContent = msg;
      formFeedback.style.color = type === 'success' ? '#6dbf8b' : '#cf6679';
      formFeedback.style.opacity = '1';
      setTimeout(() => { formFeedback.style.opacity = '0'; }, 5000);
    }