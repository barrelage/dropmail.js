var Dropmail = require('../../')
  , dropmail = new Dropmail({ baseURL: "http://0.0.0.0:9393" });

dropmail.authenticate("w9GxuBn8ZeujTdIz1dSurEsmPkBbi1Wq2R53EW0mXY4");

var user;
dropmail.User.find("105145576407562266", function(err, u) {
  if(err) return console.error(err);
  user = u;
  console.log(u);
});
