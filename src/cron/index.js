const testCron = require("./test.cron");
const dbKeepAliveCron = require("./dbKeepAlive.cron");

const initCrons = () => {
  console.log("[CRON SYSTEM] კრონ-სისტემა წარმატებით ინიციალიზებულია.");

  // ვრთავთ ჩვენს სატესტო კრონს
  testCron.start();

  // 🆕 ვრთავთ ბაზის Keep-Alive კრონს
  dbKeepAliveCron.start();
  console.log("[CRON SYSTEM] სატესტო ტასკი გაშვებულია (პერიოდულობა: 5 წამი).");
};

module.exports = initCrons;
