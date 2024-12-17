class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.lightsElements = [];
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.randomDifficulty();
        this.createStructure();
    }

    randomDifficulty() {
        const randomIndex = Math.floor(Math.random() * this.levels.length);
        return this.levels[randomIndex];
    }
    
    createStructure() {
        const main = document.querySelector('main');
    
        if (main.querySelector('[data-light]')) {
            return; // Evita duplicar la estructura
        }
    
        // Encabezado
        const header = document.createElement('h2');
        header.textContent = 'Juego del Semáforo';
        main.appendChild(header);
    
        // Contenedor de luces
        const semaforoContainer = document.createElement('div');
        semaforoContainer.classList.add('semaforo');
        main.appendChild(semaforoContainer);
    
        // Creación de luces
        this.lightsElements = [];
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            light.setAttribute('data-light', '');
            semaforoContainer.appendChild(light); // Añadir las luces al contenedor
            this.lightsElements.push(light); // Guarda referencia a las luces
        }
    
        // Contenedor de botones
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');
        main.appendChild(buttonsContainer);
    
        // Botón de iniciar
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Arrancar Semáforo';
        this.startButton.addEventListener('click', () => {
            this.initSequence();
        });
        buttonsContainer.appendChild(this.startButton);
    
        // Botón de reacción
        this.reactionButton = document.createElement('button');
        this.reactionButton.textContent = 'Obtener Tiempo de Reacción';
        this.reactionButton.disabled = true;
        this.reactionButton.addEventListener('click', () => {
            this.stopReaction();
        });
        buttonsContainer.appendChild(this.reactionButton);
    
        // Párrafo de resultado
        this.reactionParagraph = document.createElement('p');
        this.reactionParagraph.textContent = '';
        main.appendChild(this.reactionParagraph);
    }   
    initSequence() {
        this.startButton.disabled = true;
        const main = document.querySelector('main');
        main.classList.add('load');

        let delay = 0;
        this.lightsElements.forEach((light) => {
            setTimeout(() => {
                light.classList.add('on');
            }, delay);
            delay += 500;
        });

        const totalDelay = 500 * this.lightsElements.length;
        const randomTimeout = this.difficulty * 1000 + totalDelay;
        console.log(randomTimeout);
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, randomTimeout);
    }

    endSequence() {
        const main = document.querySelector('main');
        main.classList.add('unload');
        this.lightsElements.forEach((light) => {
            light.classList.remove('on');
        });
        setTimeout(() => {
            main.classList.remove('load');
            main.classList.remove('unload');
            this.reactionButton.disabled = false;
            this.startButton.disabled = true;
        }, 200);
    }

    stopReaction() {
        this.clic_moment = new Date();

        const reactionTime = ((this.clic_moment - this.unload_moment) / 1000).toFixed(3);

        this.reactionParagraph.textContent = `Tiempo de reacción: ${reactionTime} segundos`;

        const main = document.querySelector('main');
        main.classList.remove('load');
        main.classList.remove('unload');
        this.createRecordForm(reactionTime);
        this.reactionButton.disabled = true;
        this.startButton.disabled = false;
    }

    createRecordForm(reactionTime) {
        const form = document.createElement('form');
        form.action = "semaforo.php";
        form.method = "POST";

        form.innerHTML = `
            <section>
                <h3>Información Personal</h3>
                <label>
                    Nombre:
                    <input type="text" name="nombre" required>
                </label>
            </section>
            <section>
                <h3>Información Adicional</h3>
                <label>
                    Apellidos:
                    <input type="text" name="apellidos" required>
                </label>
            </section>
            <section>
                <h3>Dificultad del Juego</h3>
                <label>
                    Dificultad:
                    <input type="text" name="nivel" value="${this.difficulty}" readonly>
                </label>
            </section>
            <section>
                <h3>Resultado</h3>
                <label>
                    Tiempo de Reacción (s):
                    <input type="text" name="tiempo" value="${reactionTime}" readonly>
                </label>
            </section>
            <input type="submit" value="Enviar">
        `;

        const main = document.querySelector('main');
        main.appendChild(form);
    }
}

const semaforo = new Semaforo();