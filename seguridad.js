// ============================================================================
// SEGURIDAD.JS - GUARDIÁN SILENCIOSO DEL SISTEMA M.E.F.
// ============================================================================

(function() {
    // 1. Evitar que el guardián actúe si por accidente se lee en el Login
    const urlActual = window.location.pathname.toLowerCase();
    if (urlActual.includes('index.html') || urlActual.endsWith('/')) {
        return; 
    }

    // 2. Verificar que exista una sesión activa en la memoria
    const sesion = localStorage.getItem('isa_sesion');
    if (!sesion) {
        alert("Acceso Denegado. Por favor, inicie sesión primero.");
        window.location.replace('index.html');
        return;
    }

    // ==========================================
    // 3. CONTROL DE TIEMPO Y AUTO-CIERRE
    // ==========================================
    const TIEMPO_MAXIMO = 5 * 60 * 1000; // 5 minutos de tolerancia
    const ultimaActividad = localStorage.getItem('isa_ultima_actividad');

    // Si hay un registro de actividad previa, comprobamos si ya pasó el tiempo límite
    if (ultimaActividad) {
        const tiempoPasado = Date.now() - parseInt(ultimaActividad);
        
        // Si pasaron más de 5 minutos (ya sea por inactividad o porque cerraste el navegador)
        if (tiempoPasado > TIEMPO_MAXIMO) {
            localStorage.removeItem('isa_sesion');
            localStorage.removeItem('isa_ultima_actividad');
            alert("Sesión expirada por seguridad. Por favor, inicie sesión nuevamente.");
            window.location.replace('index.html');
            return;
        }
    }

    // Si pasó la prueba de tiempo, actualizamos la marca del reloj de inmediato
    localStorage.setItem('isa_ultima_actividad', Date.now().toString());

    // Función para resetear el reloj cada vez que el usuario se mueva
    let timerInactividad;
    function registrarActividad() {
        localStorage.setItem('isa_ultima_actividad', Date.now().toString());
        clearTimeout(timerInactividad);
        
        // Temporizador en vivo: te bota si dejas la computadora abierta y te vas al almacén
        timerInactividad = setTimeout(() => {
            localStorage.removeItem('isa_sesion');
            localStorage.removeItem('isa_ultima_actividad');
            alert("Su sesión ha sido cerrada automáticamente tras 5 minutos de inactividad.");
            window.location.replace('index.html');
        }, TIEMPO_MAXIMO);
    }

    // Escuchamos cualquier movimiento del mouse o teclado para saber que sigues ahí
    window.addEventListener('load', registrarActividad);
    document.addEventListener('mousemove', registrarActividad);
    document.addEventListener('keypress', registrarActividad);
    document.addEventListener('scroll', registrarActividad);
    document.addEventListener('click', registrarActividad);

    // ==========================================
    // 4. BLOQUEO DE CURIOSOS (ANTI-HACKERS BÁSICOS)
    // ==========================================
    
    // Bloquea el Click Derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); 
    });

    // Bloquea las herramientas de desarrollador (F12, Ctrl+Shift+I, etc.)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
           (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || 
           (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
            e.preventDefault();
        }
    });

})();