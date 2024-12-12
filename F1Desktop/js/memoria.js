class Memoria {
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.elements = {
            cards: [
                { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
                { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
            ]
        };

        this.shuffleElements();  
        this.createElements();   
        this.addEventListeners(); 
    }

    addEventListeners() {
        const allCards = document.querySelectorAll('article');
        allCards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card)); 
        });
    }

    createElements() {
        const main = document.querySelector('main');
        if (main.querySelector('section > article')) {
            return;
        }
    
        const cardsContainer = document.createElement('section');
        this.elements.cards.forEach(card => {
            const article = document.createElement('article');
            article.element = card.element; 
            article.setAttribute('data-element', card.element);

            const h3 = document.createElement('h3');
            h3.innerText = 'Tarjeta de memoria';
            article.appendChild(h3);
    
            const img = document.createElement('img');
            img.src = card.source;
            img.alt = card.element;
            article.appendChild(img);
    
            cardsContainer.appendChild(article);
        });

        main.appendChild(cardsContainer);
    }

    flipCard(card) {
        if (card.getAttribute('data-state') === 'revealed' || card.getAttribute('data-state') === 'flip') {
            return;
        }
        if (this.lockBoard || card === this.firstCard) {
            return; 
        }
        card.setAttribute('data-state', 'flip');
        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card; 
        } else {
            this.secondCard = card;
            this.lockBoard = true;
            this.checkForMatch(); 
        }
    }

    checkForMatch() {
        const isMatch = this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element');
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.setAttribute('data-state', 'revealed');
        this.secondCard.setAttribute('data-state', 'revealed');
        this.resetBoard();
    }

    unflipCards() {
        setTimeout(() => {         
            this.firstCard.removeAttribute('data-state'); 
            this.secondCard.removeAttribute('data-state'); 
            this.resetBoard();
        }, 2500); 
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    shuffleElements() {
        const { cards } = this.elements;
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]; 
        }
    }
}

const juegoMemoria = new Memoria();