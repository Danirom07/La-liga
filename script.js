document.addEventListener('DOMContentLoaded', () => {
  
    // CLARO/OSCURO
  
    const themeToggle = document.getElementById("themeToggle");
    const logoLiga = document.getElementById("logoLiga");
    const tituloLiga = document.getElementById("tituloLiga");

    function updateUI(isLight) {
        // Actualizar Icono del botón
        if (themeToggle) themeToggle.textContent = isLight ? "☀️" : "🌙";

        // Actualizar Logo Principal (el pequeño de la esquina)
        if (logoLiga) {
            logoLiga.src = isLight ? "imagenes/Titulo-Blanco.png" : "imagenes/logo.png";
        }

        // Actualizar Imagen de Título (el grande del centro)
        if (tituloLiga) {
            tituloLiga.src = isLight ? "imagenes/Titulo.png" : "imagenes/Titulo.png";
        }
    }

    // Cargar preferencia al iniciar
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }
    updateUI(document.body.classList.contains("light-mode"));

    // Evento Click del botón
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isNowLight = document.body.classList.contains("light-mode");
            localStorage.setItem("theme", isNowLight ? "light" : "dark");
            updateUI(isNowLight);
        });
    }


    // 2. MENÚ MÓVIL 
 
    const menuToggle = document.getElementById('menuToggle');
    const menuLinks = document.getElementById('menuLinks');

    if (menuToggle && menuLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            menuLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }

    // 3. ANIMACIÓN DE NÚMEROS 
    const animarContadores = () => {
        const contadores = document.querySelectorAll('.stat-number');
        contadores.forEach(contador => {
            const objetivo = +contador.innerText;
            const duracion = 1500;
            const incremento = objetivo / (duracion / 16);
            let valorActual = 0;

            const actualizar = () => {
                valorActual += incremento;
                if (valorActual < objetivo) {
                    contador.innerText = Math.ceil(valorActual);
                    requestAnimationFrame(actualizar);
                } else {
                    contador.innerText = objetivo;
                }
            };
            actualizar();
        });
    };

    if (document.querySelector('.hero-stats')) {
        animarContadores();
    }

    // 4. EFECTO PARALLAX EN IMAGEN HERO

    const heroRight = document.querySelector('.hero-right');
    const heroImg = document.querySelector('.hero-img');

    if (heroRight && heroImg) {
        heroRight.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = heroRight.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            heroImg.style.transform = `scale(1.1) translate(${x * 30}px, ${y * 30}px)`;
        });

        heroRight.addEventListener('mouseleave', () => {
            heroImg.style.transform = `scale(1.0) translate(0, 0)`;
        });
    }
});




    // ---  ELEMENTOS DEL MENÚ Y NAVEGACIÓN ---
    const menuToggle = document.getElementById('menuToggle');
    const menuLinks = document.getElementById('menuLinks');
    const links = document.querySelectorAll(".menu-links a");

    if (menuToggle && menuLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            menuLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }

    // Resaltar enlace activo según la URL
    const currentPath = window.location.pathname.split("/").pop();
    links.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
            link.classList.add("active");
        }
        link.addEventListener('click', () => {
            menuLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('open');
        });
    });

    // LÓGICA DE CLUBES 
    const tarjetas = document.querySelectorAll('.club-card');

    // Animación de aparición escalonada 
    const cardObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay dinámico para efecto de cascada
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 80);
                cardObserver.unobserve(entry.target);
            }
        });
    }, cardObserverOptions);

    tarjetas.forEach(card => cardObserver.observe(card));

    // Efecto de Brillo Dinámico en la info de la parte trasera
    const infoItems = document.querySelectorAll('.club-info-content p, .club-info-content hr');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.filter = "drop-shadow(0 0 10px #ff004c)";
            item.style.transition = "0.3s";
        });
        item.addEventListener('mouseleave', () => {
            item.style.filter = "none";
        });
    });

    // BUSCADOR
    const buscadorInput = document.getElementById('buscarEquipo');

    if (buscadorInput) {
        buscadorInput.addEventListener('input', function () {
            const valor = this.value.toLowerCase();

            // CASO A: FILTRAR TARJETAS 
            if (tarjetas.length > 0) {
                tarjetas.forEach(card => {
                    // Buscamos el nombre en el h3 de la parte delantera o trasera
                    const nombreEquipo = card.querySelector('h3').textContent.toLowerCase();
                    if (nombreEquipo.includes(valor)) {
                        card.style.display = ""; // Muestra la tarjeta
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    } else {
                        card.style.display = "none"; // Oculta la tarjeta
                    }
                });
            }

            //  FILTRAR TABLA 
            const filasClasificacion = document.querySelectorAll('.tabla-clasificacion tbody tr');
            if (filasClasificacion.length > 0) {
                filasClasificacion.forEach(fila => {
                    // El nombre suele estar en la segunda celda (index 1)
                    const celdaNombre = fila.cells[1];
                    if (celdaNombre) {
                        const nombreEquipo = celdaNombre.textContent.toLowerCase();
                        fila.style.display = nombreEquipo.includes(valor) ? '' : 'none';
                    }
                });
            }
        });
    }

    // API CLASIFICACIÓN 
    const API_KEY = '2dd07104cbe042b59b7defdab7067576';
    const url = "/api/clasificacion";
    async function cargarLaLiga() {
        const cuerpoTabla = document.querySelector('.tabla-clasificacion tbody');
        if (!cuerpoTabla) return;

        try {
            const response = await fetch(URL_CLASIFICACION, {
                headers: {'X-Auth-Token': API_KEY}
            });
            const data = await response.json();
            const tablaDatos = data.standings[0].table;

            cuerpoTabla.innerHTML = '';
            tablaDatos.forEach(equipo => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${equipo.position}</td>
                    <td>
                        <img src="${equipo.team.crest}" width="25" height="25" style="margin-right: 12px; vertical-align: middle;">
                        ${equipo.team.shortName || equipo.team.name}
                    </td>
                    <td><strong>${equipo.points}</strong></td>
                    <td>${equipo.playedGames}</td>
                    <td>${equipo.won}</td>
                    <td>${equipo.draw}</td>
                    <td>${equipo.lost}</td>
                    <td>${equipo.goalsFor}</td>
                    <td>${equipo.goalsAgainst}</td>
                    <td>${equipo.goalDifference}</td>
                `;
                cuerpoTabla.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al cargar la API:", error);
            // Si la API falla, mantenemos lo que haya en el HTML o mostramos un mensaje
        }
    }

    // Solo ejecutamos la API si estamos en la página de clasificación
    if (document.querySelector('.tabla-clasificacion')) {
        cargarLaLiga();
    }

    // ANIMACIÓN DE ESTADÍSTICAS
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = fill.getAttribute('data-width');
            }
        });
    }, {threshold: 0.5});

    document.querySelectorAll('.stat-fill').forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0';
        statObserver.observe(bar);
});


//  Animación de los números 
const animarContadores = () => {
    const contadores = document.querySelectorAll('.stat-number');
    contadores.forEach(contador => {
        const objetivo = +contador.innerText;
        const duracion = 1500; 
        const incremento = objetivo / (duracion / 16); 

        let valorActual = 0;
        const actualizar = () => {
            valorActual += incremento;
            if (valorActual < objetivo) {
                contador.innerText = Math.ceil(valorActual);
                requestAnimationFrame(actualizar);
            } else {
                contador.innerText = objetivo;
            }
        };
        actualizar();
    });
};

    // Lanzar contadores si estamos en el inicio
    if (document.querySelector('.hero-stats')) {
    animarContadores();
}

    // Efecto de seguimiento 
    const heroRight = document.querySelector('.hero-right');
    const heroImg = document.querySelector('.hero-img');

    if (heroRight && heroImg) {
    heroRight.addEventListener('mousemove', (e) => {
        const {width, height, left, top} = heroRight.getBoundingClientRect();
        // Calculamos la posición del ratón respecto al centro del contenedor
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        // Movemos la imagen suavemente en dirección opuesta
        heroImg.style.transform = `scale(1.1) translate(${x * 30}px, ${y * 30}px)`;
    });

    // Resetear posición cuando el ratón sale
    heroRight.addEventListener('mouseleave', () => {
        heroImg.style.transform = `scale(1.0) translate(0, 0)`;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.player-spotlight-card');

    // EFECTO 3D E ILUMINACIÓN DINÁMICA 
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Cálculo de porcentajes para el brillo 
            const xPercent = ((x / rect.width) * 100).toFixed(2);
            const yPercent = ((y / rect.height) * 100).toFixed(2);

            card.style.setProperty('--mouse-x', `${xPercent}%`);
            card.style.setProperty('--mouse-y', `${yPercent}%`);

            // Cálculo de rotación para el efecto 3D
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Sensibilidad ajustada a 15 para suavidad
            const rotateX = (centerY - y) / 15;
            const rotateY = (x - centerX) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        // Resetear la carta al salir el ratón
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    });

    //  ANIMACIÓN DE NÚMEROS AL HACER SCROLL 
    const animateNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const values = entry.target.querySelectorAll('.stat-value');

                values.forEach(val => {
                    const target = +val.innerText;
                    let count = 0;
                    const duration = 1500; // 1.5 segundos de animación
                    const increment = target / (duration / 16);

                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            val.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            val.innerText = target;
                        }
                    };
                    updateCount();
                });
                // Dejamos de observar este contenedor una vez ejecutada la animación
                observer.unobserve(entry.target);
            }
        });
    };

    // Configuración del Observer para los números
    const statsObserver = new IntersectionObserver(animateNumbers, { threshold: 0.5 });

    // Activamos el observador en cada contenedor de estadísticas
    document.querySelectorAll('.player-stats').forEach(container => {
        statsObserver.observe(container);
    });
});




async function cargarClasificacion() {
    const url = "https://api.football-data.org/v4/competitions/PD/standings";

    try {
        const response = await fetch(url, {
            headers: {
                "X-Auth-Token": "765345970e4f40c9afd5bb0c58753527"
            }
        });

app.use(cors());

      
        const data = await response.json();

        const standings = data.standings[0].table;

        let html = "";

        standings.forEach(team => {
            html += `
                <tr>
                    <td>${team.position}</td>
                    <td style="display:flex; align-items:center; gap:8px;">
                        <img src="${team.team.crest}" width="25" height="25">
                        ${team.team.name}
                    </td>
                    <td>${team.playedGames}</td>
                    <td>${team.points}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.goalsFor}</td>
                    <td>${team.goalsAgainst}</td>
                    <td>${team.goalDifference}</td>
                </tr>
            `;
        });

        document.getElementById("tablaCuerpo").innerHTML = html;

    } catch (error) {
        console.error("Error cargando clasificación:", error);
    }
}

cargarClasificacion();
setInterval(cargarClasificacion, 60000);

// Buscador
document.getElementById("buscarEquipo").addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaCuerpo tr");

    filas.forEach(fila => {
        const nombre = fila.children[1].innerText.toLowerCase();
        fila.style.display = nombre.includes(filtro) ? "" : "none";
    });
});


