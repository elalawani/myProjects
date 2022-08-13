// All Elements

let countSpan = document.querySelector(".count span");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit");
let resultsContainer = document.querySelector(".results");
let countDownDiv = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countDownIntervall;
function getQuistions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let myQuestions = JSON.parse(this.responseText)
            let questionNum = myQuestions.length;
            createBullets(questionNum);
            addData(myQuestions[currentIndex], questionNum);

            countDown (5 , questionNum);

            submitButton.onclick =  () => {
                let rightAnswer = myQuestions[currentIndex].right_answer

                currentIndex++;

                checkAnswer(rightAnswer, questionNum);

                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                addData(myQuestions[currentIndex], questionNum);

                handelBullets();

                clearInterval(countDownIntervall);
                countDown(5 , questionNum);

                showResults(questionNum);





            }
        }
    };

    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}

getQuistions();

function addData (obj, count) {
    if(currentIndex < count)
    {
    let qtitle = document.createElement("h2");

    let qtext = document.createTextNode(obj['title']);
    qtitle.appendChild(qtext);
    quizArea.appendChild(qtitle);

// answers
    for (let i = 0; i < 4; i++) {
    let mainDiv = document.createElement("div");
    mainDiv.className = "answer";

    let radioInput = document.createElement("input");

    radioInput.name = 'question';
    radioInput.type = 'radio';
    radioInput.id = `answer_${i+1}`;
    radioInput.dataset.answer = obj[`answer_${i+1}`];

    if ( i === 0 ) {
        radioInput.checked = true;

    }

    let theLabel = document.createElement("label");

    theLabel.htmlFor = `answer_${i+1}`;

    let labelText = document.createTextNode(obj[`answer_${i+1}`])

    theLabel.appendChild(labelText);

    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    answersArea.appendChild(mainDiv);


    }}

}

function checkAnswer(rAnswer, num) {

    let answers = document.getElementsByName("question");
    let theChosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked){

            theChosenAnswer = answers[i].dataset.answer;

        }
    }
    if(rAnswer === theChosenAnswer) {
        rightAnswers++;
    }
}

function createBullets (num) {
    countSpan.innerHTML = num

    for (let i = 0; i < num; i++) {
        let thebullet = document.createElement("span");

        if (i === 0) {
            thebullet.className = "on";
        }

        bulletSpanContainer.appendChild(thebullet);
    }

}

function handelBullets () {

    let bulletSpans = document.querySelectorAll(".bullets .spans span");
    let arrayofSpans = Array.from(bulletSpans);
    arrayofSpans.forEach((span, index) => {
        if (currentIndex === index){
            span.className = "on";
        }
    })
}

function showResults(count) {
    let results;
    if(currentIndex === count){
        submitButton.remove();
        quizArea.remove();
        answersArea.remove();
        bullets.remove()

       if (rightAnswers > (count / 2) && rightAnswers < count) {
           results = `<span class="good">GOOD</span>, ${rightAnswers} From ${count} is Right`
       } else if (rightAnswers === count) {
           results = `<span class="perfect">PERFECT</span>, ${rightAnswers} From ${count} is Right`
       } else {
           results = `<span class="bad">BAD</span>, ${rightAnswers} From ${count} is Right`
       }
       resultsContainer.innerHTML = results;
       resultsContainer.style.padding = "10px";
       resultsContainer.style.backgroundColor = "white";
       resultsContainer.style.marginTop = "10px";
    }
}

function countDown (duration, count) {
    if (currentIndex < count) {
        let minute, seconde;
        countDownIntervall = setInterval(()=>{
            minute = parseInt(duration / 60);
            seconde = parseInt(duration % 60);

            minute = minute < 10 ? `0${minute}`:`${minute}`;
            seconde = seconde < 10 ? `0${seconde}`:`${seconde}`;

            countDownDiv.innerHTML = `${minute}:${seconde}`;

            if (--duration < 0) {
                clearInterval(countDownIntervall);
                submitButton.click();
            }

        }, 1000)
    }

}