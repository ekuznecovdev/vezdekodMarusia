const fs = require("fs");
const path = require("path");
const db = require("./database.json");
const { questions } = require("./config");

const savedb = async () => {
  await fs.writeFileSync(
    path.join(__dirname, "./database.json"),
    JSON.stringify(db),
    (err) => err && console.log(err)
  );
};

const getDefaultModel = (sessionId, userId) => {
  if (db.responses[userId]) {
    delete db.responses[userId];
    savedb();
  }
  return {
    questions: [null, null, null, null, null, null, null, null, null],
    sessionId,
    userId,
  };
};

const checkRegistration = (sessionId, userId) => {
  if (!db.responses[userId]) {
    return false;
  }
  if (db.responses[userId].sessionId != sessionId) {
    delete db.responses[userId];
    savedb();
    return false;
  }
  return true;
};

const getQuestionNumber = (userId) => {
  const dbData = db.responses[userId].questions;
  const index = dbData.findIndex((v) => v == null);
  console.log(index);
  return index;
};

const saveresponse = (userId, number, value) => {
  db.responses[userId].questions[number] = value;
  savedb();
  return;
};

const analizeResponse = (userId, session, version) => {
  const responses = db.responses[userId].questions;
  let ctgs = "";
  for (let i = 1; i < responses.length; i++) {
    const data = responses[i];
    if (i == 1 && data == 1) {
      ctgs += `Java,\n`;
    }
    if (i == 2 && data == 1) {
      ctgs += "VK Mini Apps,\n";
    }
    if (i == 3 && data == 1) {
      ctgs += "Gamedev,\n";
    }
    if (i == 4 && data == 1) {
      ctgs += "Mobile,\n";
    }
    if (i == 5 && data == 1) {
      ctgs += "Backend,\n";
    }
    if (i == 6 && data == 1) {
      ctgs += "PHP,\n";
    }
    if (i == 7 && data == 1) {
      ctgs += "Чат-боты,\n";
    }
    if (i == 8 && data == 1) {
      ctgs += "Маруся.";
    }
  }
  delete db.responses[userId];
  savedb();
  return {
    response: {
      text: `Категории, которые вам подойдут:\n\n${
        ctgs.length > 0 ? ctgs : "Вам не подойдёт никакая категория."
      }\n\nУдачного вездекода!`,
      tts: `<speaker audio=marusia-sounds/game-win-1> Категории, которые вам подойдут:\n\n${
        ctgs.length > 0 ? ctgs : "Вам не подойдёт никакая категория."
      }\n\nУдачного вездекода!`,
      commands: [
        {
          type: "BigImage",
          image_id: 457239018,
        },
      ],
      end_session: false,
    },
    session,
    version,
  };
};

const getQuestion = (number, session, version, userId) => {
  let questionText = questions[number];
  if (!questionText) {
    return analizeResponse(userId, session, version);
  }
  return {
    response: {
      text: questionText,
      tts: `<speaker audio=marusia-sounds/game-8-bit-coin-1> ${questionText}`,
      end_session: false,
    },
    session,
    version,
  };
};

module.exports = {
  savedb,
  getDefaultModel,
  checkRegistration,
  getQuestion,
  getQuestionNumber,
  saveresponse,
};
