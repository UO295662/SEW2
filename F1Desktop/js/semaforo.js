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

        if (main.querySelector('.grid-container')) {
            return; 
        }
    
        const gridContainer = document.createElement('section');
        gridContainer.className = 'grid-container';
    
        const header = document.createElement('h2');
        header.textContent = 'Juego del Semáforo';
        gridContainer.appendChild(header);
    
        const lightsContainer = document.createElement('section');
        lightsContainer.className = 'lights-container';
    
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('section');
            light.className = 'light';
            lightsContainer.appendChild(light);
            this.lightsElements.push(light);
        }
    
        gridContainer.appendChild(lightsContainer);
    
        const buttonContainer = document.createElement('section');
        buttonContainer.className = 'button-container';
    
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Arrancar Semáforo';
        this.startButton.addEventListener('click', () => {
            this.initSequence();
        });
        buttonContainer.appendChild(this.startButton);
    
        this.reactionButton = document.createElement('button');
        this.reactionButton.textContent = 'Obtener Tiempo de Reacción';
        this.reactionButton.disabled = true;
        buttonContainer.appendChild(this.reactionButton);
    
        gridContainer.appendChild(buttonContainer);
    
        this.reactionParagraph = document.createElement('p');
        this.reactionParagraph.textContent = '';
        this.reactionParagraph.className = 'reaction-paragraph';
    
        gridContainer.appendChild(this.reactionParagraph);
    
        main.appendChild(gridContainer);
    
        this.reactionButton.addEventListener('click', () => {
            this.stopReaction();
        });
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
            this.startButton.disabled = false;
        }, 200);
    }

    stopReaction() {
        this.clic_moment = new Date();

        const reactionTime = ((this.clic_moment - this.unload_moment)/1000).toFixed(3);

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
            <label>Nombre:</label>
            <input type="text" name="nombre" required>
        </section>
        <section>    
            <label>Apellidos:</label>
            <input type="text" name="apellidos" required>
        </section>
        <section>    
            <label>Dificultad:</label>
            <input type="text" name="nivel" value="${this.difficulty}" readonly>
        </section>
        <section>    
            <label>Tiempo de Reacción (s):</label>
            <input type="text" name="tiempo" value="${reactionTime}" readonly>
        </section>    
            <input type="submit" value="Enviar">
        `;
        const main = document.querySelector('main');
        main.appendChild(form);
    }
}

const semaforo = new Semaforo();    