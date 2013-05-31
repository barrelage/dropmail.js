var Dropmail = require('../../');

Dropmail.Model.baseURL = "http://localhost:9292";
Dropmail.Model.key = "w9GxuBn8ZeujTdIz1dSurEsmPkBbi1Wq2R53EW0mXY4";

var user;
Dropmail.User.find("105145576407562266", function(err, u) {
  if(err) return console.error(err);
  user = u;
  console.log(u);
});
