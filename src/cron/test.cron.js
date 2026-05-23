const cron = require("node-cron");

// ფუნქცია, რომელიც შესრულდება ყოველ 5 წამში
const runTestTask = () => {
  const currentTime = new Date().toLocaleTimeString("ka-GE");
  console.log(`[🚀 CRON TEST] ტასკი მუშაობს! მიმდინარე დრო: ${currentTime}`);
};

// "*/5 * * * * *" ნიშნავს ყოველ 5 წამში ერთხელ
module.exports = cron.schedule("*/5 * * * * *", runTestTask, {
  scheduled: false, // არ ჩაირთოს ავტომატურად, სანამ ხელით არ ვეტყვით (.start())
  timezone: "Asia/Tbilisi",
});
