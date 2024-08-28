document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    const numberOfParticles = 80;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`; // Opacità variabile
        particlesContainer.appendChild(particle);

        animateParticle(particle);
    }

    function animateParticle(particle) {
        const animationDuration = Math.random() * 10 + 5;
        const translateX = Math.random() * 200 - 100;
        const translateY = Math.random() * 200 - 100;

        particle.animate([
            { transform: `translate(${translateX}px, ${translateY}px)` }
        ], {
            duration: animationDuration * 1000,
            iterations: Infinity,
            direction: 'alternate'
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const text = "Web Developer & Graphic Designer";
    const speed = 100; // Velocità di digitazione in millisecondi
    const delayBetweenCycles = 1000; // Ritardo tra la fine della cancellazione e l'inizio di una nuova scrittura
    let index = 0;
    let deleting = false;

    function typeWriter() {
        if (deleting) {
            if (index > 0) {
                document.querySelector(".typed-text").textContent = text.substring(0, index - 1);
                index--;
                setTimeout(typeWriter, speed);
            } else {
                deleting = false;
                setTimeout(typeWriter, delayBetweenCycles);
            }
        } else {
            if (index < text.length) {
                document.querySelector(".typed-text").textContent = text.substring(0, index + 1);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                deleting = true;
                setTimeout(typeWriter, delayBetweenCycles);
            }
        }
    }

    typeWriter();
});


// Funzioni per aprire i link in una nuova finestra
function openInNewWindow(url) {
    window.open(url, '_blank');
}

// Event listeners per le immagini dei progetti
document.getElementById('view-app-design').addEventListener('click', function () {
    openInNewWindow('https://www.figma.com/proto/tMlnZEXXnfNYaSKvo0qsRD/Blockbuster?page-id=0%3A1&node-id=1-17&starting-point-node-id=1%3A3&t=jcWjxdHr3EYpJ8Gt-1n');
});

document.getElementById('view-brochure').addEventListener('click', function () {
    openInNewWindow('https://acrobat.adobe.com/id/urn:aaid:sc:EU:ec418e1b-6743-44a1-991c-c53cf7e85de9');
});

document.getElementById('view-book-cover').addEventListener('click', function () {
    openInNewWindow('https://acrobat.adobe.com/id/urn:aaid:sc:EU:c64189f2-62a6-4895-81df-cfd58e81d123');
});

document.getElementById('view-poster').addEventListener('click', function () {
    openInNewWindow('https://acrobat.adobe.com/id/urn:aaid:sc:EU:5d5ad8e1-bd84-4801-bc21-873e08eae5d1');
});




