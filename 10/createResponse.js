const { commandName } = require("./config");

module.exports = ({ request, session, version }) => {
  const cmd = request.command;
  if (
    cmd.includes(`${commandName} вездекод`) ||
    cmd.includes(`${commandName} вездеход`)
  ) {
    return {
      response: {
        text: "Привет вездекодерам!",
        tts: "Привет вездекодерам!",
        end_session: false,
      },
      session,
      version,
    };
  }
  return {
    response: {
      text: "Не поняла ваш запрос",
      tts: "Не поняла ваш запрос",
      end_session: false,
    },
    session,
    version,
  };
};
