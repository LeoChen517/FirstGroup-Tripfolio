const bcrypt = require('bcrypt');

async function generateHash() {
  const hash = await bcrypt.hash('123', 10); // 密碼123，鹽值10次
  console.log(hash);
}

generateHash();
