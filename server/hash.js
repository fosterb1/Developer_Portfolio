const bcrypt = require("bcrypt");

const password = process.argv[2];
if (!password) {
  console.log("Usage: node hash.js <password>");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Your password hash:");
  console.log(hash);
});
