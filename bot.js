var cr = `<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
var ms = ` <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>`;
const questionData = [
    { sl: 0, question: "Hello, I am bot. Welcome to our service." },
    {
        sl: 1,
        question:
            "What is the main reason you will be seeing the doctor today.",
    },
    {
        sl: 2,
        question: "Tell us as much as you can about the current problem.",
    },
    {
        sl: 3,
        question:
            "What other medical problem do you have for which you have to take medecine.",
    },
    {
        sl: 4,
        question:
            "Have you had any surgeries> If so, tell me about the surgeries and date or years if you can.",
    },
    { sl: 5, question: "Are you allergic to any medecine or foods." },
    { sl: 6, question: "Are you married, single, divorced or separated." },
    { sl: 7, question: "Do you smoke, If so how much." },
    { sl: 8, question: "Do you drink alcohol? if so how much." },
    { sl: 9, question: "Nice to talk with you. Thanks for your support." },
    { sl: 10, question: "Bye." },
];
function startListening() {
    $("#show-blink").addClass("pulse-ring");
    const recognition = new webkitSpeechRecognition();
    const timeoutDuration = 6000; // 5 seconds
    let speechTimeout;

    recognition.onstart = function () {
        speechTimeout = setTimeout(function () {
            speak("No speech detected. Please try again.");
            recognition.stop();
        }, timeoutDuration);
    };

    recognition.onresult = function (event) {
        clearTimeout(speechTimeout);
        const userText = event.results[0][0].transcript.toLowerCase();
        if (userText != "") {
            getVoice();
        }
        respondToUser(userText);
    };

    recognition.onerror = function (event) {
        clearTimeout(speechTimeout);
        speak("Speech recognition error. Please try again.");
    };
    recognition.onend = function () {
        clearTimeout(speechTimeout);
    };
    recognition.start();
}
function stopListening() {
    const recognition = new webkitSpeechRecognition();
    recognition.stop();
}
function respondToUser() {
    speak(questionData[answered].question);
}

function getVoice() {
    answered++;
    $("#start-btn").attr("data-count", answered);
    $("#show-blink").removeClass("pulse-ring");
}
function speak(text, c = 0) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;

    $("#show-blink").removeClass("pulse-ring");
    utterance.onend = function () {
        if (answered == 10) {
            window.location.reload();
        } else {
            startListening();
        }
    };
    setTimeout(function () {
        stopListening();
        speechSynthesis.speak(utterance);
    }, 1000);
}

var answered = 0;
var mute = 0;
$(document).ready(function () {
    $(document).on("click", "#chat-circle", function () {
        $(".chatbot").toggleClass("bot-hide");
        if ($(".chatbot").hasClass("bot-hide")) {
            $(this).html(ms);
            $("#chat-circle").removeClass("md-time");
        } else {
            $("#chat-circle").addClass("md-time");
            $(this).html(cr);
        }
    });

    $(document).on("click", ".bot-action.act,.act-btn", function () {
        var iden = $("#identificationNo").val();
        if (iden == "") {
            alert("Enter patient identification no");
            return false;
        } else {
            window.location = "/index.html";
        }
    });
    $(document).on("click", "#start-btn", function () {
        var count = $("#start-btn").attr("data-count");
        stopListening();
        speak(questionData[count].question);
    });
});
