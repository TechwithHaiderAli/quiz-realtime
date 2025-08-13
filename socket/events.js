
import { v4 as uuid4 } from "uuid";

// sessions: Map<string, Session>
// Session = {
//   sockets: Socket[],
//   users: { userId: string, score: number }[],
//   questions: { title: string, options: string[], answer: string }[],
//   currentIndex: number,
//   isStarted: boolean,
//   isStopped: boolean,
// }
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

const sessions = new Map();

export function RegisterEvents(io) {
  io.on("connection", (socket) => {
    console.log("User with Socket Id", socket.id, "Connected the Server");

    // Utility: safely emit to all sockets in a session
    const broadcastToSession = (session, event, payload) => {
      if (!session || !Array.isArray(session.sockets)) return;
      session.sockets.forEach((s) => {
        try { s.emit(event, payload); } catch (_) {}
      });
    };

    socket.on("create-session", () => {
      // Always create a new sessionId
      const newSessionId = uuid4();
      sessions.set(newSessionId, {
        questions: questions,
        sockets: [],
        users: [],
        currentIndex: 0,
        isStarted: false,
        isStopped: false,
      });
      console.log("Session Created", newSessionId);
      socket.emit("session-created", { sessionId: newSessionId });
    });

    socket.on("join", (data = {}) => {
      const { userId, sessionId } = data;
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session Does not exist");
        socket.emit("join-error", "Session Does not exist");
        return;
      }
      if (!userId) {
        socket.emit("join-error", "Invalid userId");
        return;
      }

      const alreadyUser = session.users.some((u) => u.userId === userId);
      if (alreadyUser) {
        socket.emit("join-error", "Already joined");
        return;
      }

      session.users.push({ userId, score: 0 });
      const alreadySocket = session.sockets.includes(socket);
      if (!alreadySocket) session.sockets.push(socket);

      socket.emit("join-success", { userId, sessionId });
    });

    socket.on("add-question", ({ questions, sessionId } = {}) => {
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session Does not Exist");
        socket.emit("add-question-error", "Session Does not exist");
        return;
      }
      if (!Array.isArray(questions)) {
        socket.emit("add-question-error", "Questions must be an array");
        return;
      }
      session.questions = questions;
      session.currentIndex = 0;
      socket.emit("add-question-success", { count: session.questions.length });
    });

    socket.on("start-session", ({ sessionId } = {}) => {
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session Does not Exist");
        socket.emit("start-error", "Session Does not exist");
        return;
      }
      if (session.isStarted) {
        socket.emit("start-error", "Session already started");
        return;
      }
      if (!session.questions[session.currentIndex]) {
        socket.emit("start-error", "No questions to start");
        return;
      }

      session.isStarted = true;
      const question = session.questions[session.currentIndex];
      broadcastToSession(session, "question", question);
    });

    socket.on("next-question", ({ sessionId } = {}) => {
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session Does not Exist");
        socket.emit("next-error", "Session Does not exist");
        return;
      }
      const nextIndex = session.currentIndex + 1;
      if (!session.questions[nextIndex]) {
        // No more questions
        broadcastToSession(session, "no-more-questions", true);
        return;
      }
      session.currentIndex = nextIndex;
      const question = session.questions[session.currentIndex];
      broadcastToSession(session, "question", question);
    });

    socket.on("submit-answer", ({ userId, sessionId, option } = {}) => {
      const session = sessions.get(sessionId);
      if (!session) {
        socket.emit("answer-error", "Session Does not exist");
        return;
      }
      const user = session.users.find((u) => u.userId === userId);
      if (!user) {
        socket.emit("answer-error", "User not in session");
        return;
      }
      const question = session.questions[session.currentIndex];
      if (!question) {
        socket.emit("answer-error", "No active question");
        return;
      }
      if (option === question.answer) {
        user.score++;
        socket.emit("answer-result", { correct: true, score: user.score });
      } else {
        socket.emit("answer-result", { correct: false, score: user.score });
      }
    });

    socket.on("end-session", ({ sessionId } = {}) => {
      const session = sessions.get(sessionId);
      if (!session) {
        console.log("Session Does not Exist");
        socket.emit("end-error", "Session Does not exist");
        return;
      }
      const users = session.users;
      broadcastToSession(session, "session-ended", users);
      sessions.delete(sessionId);
    });

    // Optional: clean up sockets on disconnect
    socket.on("disconnect", () => {
      for (const [, session] of sessions) {
        if (!Array.isArray(session.sockets)) continue;
        const idx = session.sockets.indexOf(socket);
        if (idx !== -1) session.sockets.splice(idx, 1);
      }
    });
  });
}

// For tests: allow controlled access (NOT exported by default app entry)