const db = require("./database.json");
const {
  savedb,
  getDefaultModel,
  checkRegistration,
  getQuestion,
  getQuestionNumber,
  saveresponse,
} = require("./dbUtils.js");

const getErrorText = (session, version) => {
  return {
    response: {
      text: "Произошла ошибка при регистрации. Попробуйте начать тест занова написав или сказав 'начать тест'",
      tts: "Произошла ошибка при регистрации. Попробуйте начать тест занова написав или сказав 'начать тест'",
      end_session: false,
    },
    session,
    version,
  };
};

module.exports = ({ request, session, version }) => {
  const cmd = request.command;
  console.log(cmd);
  if (cmd == "on_interrupt") {
    delete db.responses[session.user_id];
    savedb();
    return {
      response: {
        text: "Очень жаль, что вы уже уходите. До встречи!",
        tts: "<speaker audio=marusia-sounds/game-loss-1> Очень жаль, что вы уже уходите. До встречи!",
        end_session: false,
      },
      session,
      version,
    };
  }
  if (cmd.includes("начать") && cmd.includes("тест")) {
    const model = getDefaultModel(session.session_id, session.user_id);
    db.responses[session.user_id] = model;
    savedb();
    return {
      response: {
        text: "Для ответа на вопрос напишите или скажите слово 'да' или 'нет'. Начинаем ?",
        tts: "Для ответа на вопрос напишите или скажите слово 'да' или 'нет'. Начинаем ?",
        end_session: false,
      },
      session,
      version,
    };
  }
  if (cmd.includes("закрыть") && cmd.includes("тест")) {
    const isReg = checkRegistration(session.session_id, session.user_id);
    if (!isReg) {
      return getErrorText(session, version);
    }
    delete db.responses[session.user_id];
    savedb();
    return {
      response: {
        text: "Очень жаль, что вы закончили тест раньше. Если всё же захотите пройти тест скажите или напишите 'начать тест'",
        tts: "<speaker audio=marusia-sounds/game-loss-1> Очень жаль, что вы закончили тест раньше. Если всё же захотите пройти тест скажите или напишите 'начать тест'",
        end_session: false,
      },
      session,
      version,
    };
  }
  if (cmd.includes("да") && !cmd.includes("не")) {
    const isReg = checkRegistration(session.session_id, session.user_id);
    if (!isReg) {
      return getErrorText(session, version);
    }
    const questionNumber = getQuestionNumber(session.user_id);
    saveresponse(session.user_id, questionNumber, 1);
    return getQuestion(questionNumber, session, version, session.user_id);
  }
  if (cmd.includes("нет") || (cmd.includes("да") && cmd.includes("не"))) {
    const isReg = checkRegistration(session.session_id, session.user_id);
    if (!isReg) {
      return getErrorText(session, version);
    }
    const questionNumber = getQuestionNumber(session.user_id);
    if (questionNumber == 0) {
      delete db.responses[session.user_id];
      savedb();
      return {
        response: {
          text: "Очень жаль. Если всё же захотите пройти тест скажите или напишите 'начать тест'",
          tts: "<speaker audio=marusia-sounds/game-loss-1> Очень жаль. Если всё же захотите пройти тест скажите или напишите 'начать тест'",
          end_session: false,
        },
        session,
        version,
      };
    }
    saveresponse(session.user_id, questionNumber, 0);
    return getQuestion(questionNumber, session, version, session.user_id);
  }
  if (
    checkRegistration(session.session_id, session.user_id) &&
    getQuestionNumber(session.user_id) >= 0
  ) {
    return {
      response: {
        text: "Чтобы ответить скажите или напишите 'да' или 'нет'. Чтобы закончить тест скажите или напишите 'закрыть тест'",
        tts: "Чтобы ответить скажите или напишите 'да' или 'нет'. Чтобы закончить тест скажите или напишите 'закрыть тест'",
        end_session: false,
      },
      session,
      version,
    };
  }
  return {
    response: {
      text: "Не поняла ваш запрос. Чтобы пройти тест скажите или напишите 'начать тест'",
      tts: "Не поняла ваш запрос. Чтобы пройти тест скажите или напишите 'начать тест'",
      end_session: false,
    },
    session,
    version,
  };
};
