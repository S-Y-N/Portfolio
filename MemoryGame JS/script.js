//Створення змінних які тримають посилання на елементи розмітки
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const result = document.getElementById("result");

const gameContainer = document.querySelector(".game-container");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Список картинок
const items = [
    {
        name: "brazil",
        image: "img/brazil.png"
    },
    {
        name: "china",
        image: "img/china.png"
    },
    {
        name: "czech",
        image: "img/czech.png"
    },
    {
        name: "denmark",
        image: "img/denmark.png"
    },
    {
        name: "england",
        image: "img/england.png"
    },
    {
        name: "france",
        image: "img/france.png"
    },
    {
        name: "georgia",
        image: "img/georgia.png"
    },
    {
        name: "germany",
        image: "img/germany.png"
    },
    {
        name: "indonesia",
        image: "img/indonesia.png"
    },
    {
        name: "iraq",
        image: "img/iraq.png"
    },
    {
        name: "ireland",
        image: "img/ireland.png"
    },
    {
        name: "israel",
        image: "img/israel.png"
    },
    {
        name: "italy",
        image: "img/italy.png"
    },
    {
        name: "japan",
        image: "img/japan.png"
    },
    {
        name: "jordan",
        image: "img/jordan.png"
    },
    {
        name: "kazahstan",
        image: "img/kazahstan.png"
    },
    {
        name: "kenya",
        image: "img/kenya.png"
    },
    {
        name: "korea",
        image: "img/korea.png"
    },
    {
        name: "luxembourg",
        image: "img/luxembourg.png"
    },
    {
        name: "moldova",
        image: "img/moldova.png"
    },
    {
        name: "romania",
        image: "img/romania.png"
    },
    {
        name: "spain",
        image: "img/spain.png"
    },
    {
        name: "ukraine",
        image: "img/ukraine.png"
    },
    {
        name: "usa",
        image: "img/usa.png"
    },
    {
        name: "vietnam",
        image: "img/vietnam.png"
    },
    {
        name: "wales",
        image: "img/wales.png"
    },

];

//Ініціація змінних таймера
let seconds = 0,
    minutes = 0;
//Iніціація змінних кількості ходів і загального рахунку
let movesCount = 0,
    winCount = 0;

//Таймер
const timeGenerator = () => {
    seconds += 1;

    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //якщо гра буде йти довго, то для нормального відображення часу, додавати нулі до часу
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Кількість ходів
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Вибір випадкових картинок з масиву, щоб кожного разу картинки рендирились у різних    місцях

const generateRandom = (size = 4) => {
    //використовуємо оператор spread, який дозволяє в тимчасовий масив додати елементи іншого.
    let tempArray = [...items];
    //ініціалізація масиву значень карток
    let cardValues = [];
    //матриця 4*4 з 2 пар
    size = (size * size) / 2;
    //задаєм рандомні індекси карткам
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //після вибору видалить з масиву
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //просте тасування
    cardValues.sort(() => Math.random() - 0.5);

    /*1.Створення карток
           -card-before: показує рубашку карти
           -card-after: картинка на карті
           -data-card-value: для збереження назв карток і для їх порівняння 
    */
    for (let i = 0; i < size * size; i++) {

        gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before"></div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
    }
    //створення сітки з рівномірними клітинками
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Картки, вибираємо всі додані картки
    cards = document.querySelectorAll(".card-container");
    //перебор і для кожного елемента масива додоємо обробник кліку
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //Перевіряє чи для вибраної карти є вже збіг з іншою, якщо є - то вона вже не перевертається
            if (!card.classList.contains("matched")) {
                //перевернути картку
                card.classList.add("flipped");
                //якщо firstCard не false, а вона ініціалізована зі старту як false )
                if (!firstCard) {
                    //то поточна карта стає першою
                    firstCard = card;
                    //поточна карта отримує індекс карти
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //+1 крок до лічильника коли вибираємо другу картку
                    //без різниці, чи сходяться картки чи ні
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //якщо значення індексів двох карт співпадає, то обом додати клас matched
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //перша картка отримує дефолтне значення, оскільки наступна картка буде перша
                        firstCard = false;
                        winCount += 1;
                        //порівняти кількість пар і правильних ходів
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2>
                                    <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //якщо картки не співпадають, перевернути картку назад
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});


stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
       
    })
);

//Ініціалізація гри та виклик всіх функції
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};