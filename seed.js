import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const questions=[
  { "title": "What is the capital of France?", "options": ["Paris", "Rome", "Berlin", "Madrid"], "answer": "Paris" },
  { "title": "Which planet is known as the Red Planet?", "options": ["Earth", "Mars", "Jupiter", "Venus"], "answer": "Mars" },
  { "title": "What is 5 + 7?", "options": ["10", "11", "12", "13"], "answer": "12" },
  { "title": "Who wrote 'Hamlet'?", "options": ["William Shakespeare", "Charles Dickens", "Leo Tolstoy", "Mark Twain"], "answer": "William Shakespeare" },
  { "title": "What is the largest mammal?", "options": ["Elephant", "Blue Whale", "Giraffe", "Hippo"], "answer": "Blue Whale" },
  { "title": "What is the chemical symbol for water?", "options": ["O2", "H2O", "CO2", "HO"], "answer": "H2O" },
  { "title": "Which continent is Egypt in?", "options": ["Asia", "Europe", "Africa", "Australia"], "answer": "Africa" },
  { "title": "How many days are in a leap year?", "options": ["365", "366", "364", "367"], "answer": "366" },
  { "title": "What gas do plants absorb?", "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], "answer": "Carbon Dioxide" },
  { "title": "Who painted the Mona Lisa?", "options": ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"], "answer": "Leonardo da Vinci" },
  { "title": "What is the fastest land animal?", "options": ["Cheetah", "Lion", "Horse", "Tiger"], "answer": "Cheetah" },
  { "title": "How many continents are there?", "options": ["5", "6", "7", "8"], "answer": "7" },
  { "title": "Which ocean is the largest?", "options": ["Atlantic", "Indian", "Pacific", "Arctic"], "answer": "Pacific" },
  { "title": "What is the capital of Japan?", "options": ["Tokyo", "Kyoto", "Osaka", "Nagoya"], "answer": "Tokyo" },
  { "title": "Which is the smallest prime number?", "options": ["1", "2", "3", "5"], "answer": "2" },
  { "title": "In which country is the Eiffel Tower?", "options": ["Italy", "France", "Germany", "Spain"], "answer": "France" },
  { "title": "Which element has the symbol 'O'?", "options": ["Oxygen", "Gold", "Osmium", "Opium"], "answer": "Oxygen" },
  { "title": "How many hours are in a day?", "options": ["24", "25", "12", "23"], "answer": "24" },
  { "title": "What is the boiling point of water (in Celsius)?", "options": ["90", "95", "100", "110"], "answer": "100" },
  { "title": "Who discovered gravity?", "options": ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], "answer": "Isaac Newton" },
  { "title": "Which instrument has keys, pedals, and strings?", "options": ["Guitar", "Piano", "Violin", "Drums"], "answer": "Piano" },
  { "title": "What is the largest desert in the world?", "options": ["Sahara", "Gobi", "Arctic", "Antarctic"], "answer": "Antarctic" },
  { "title": "How many legs does a spider have?", "options": ["6", "8", "10", "12"], "answer": "8" },
  { "title": "Which is the longest river in the world?", "options": ["Amazon", "Nile", "Yangtze", "Mississippi"], "answer": "Nile" },
  { "title": "Which language is the most spoken in the world?", "options": ["English", "Mandarin Chinese", "Spanish", "Hindi"], "answer": "Mandarin Chinese" },
  { "title": "How many colors are there in a rainbow?", "options": ["5", "6", "7", "8"], "answer": "7" },
  { "title": "What is the square root of 64?", "options": ["6", "7", "8", "9"], "answer": "8" },
  { "title": "Which planet is closest to the Sun?", "options": ["Mercury", "Venus", "Earth", "Mars"], "answer": "Mercury" },
  { "title": "What is the largest bone in the human body?", "options": ["Femur", "Tibia", "Humerus", "Spine"], "answer": "Femur" },
  { "title": "Which metal is liquid at room temperature?", "options": ["Mercury", "Lead", "Gold", "Aluminium"], "answer": "Mercury" }
]

socket.on("connect", () => {
  console.log("Connected, adding questions...");
    socket.emit("add-question", { sessionId: "25016d0f-e590-4371-9c17-1548bb5834b4",questions });
  console.log("Questions added");
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
