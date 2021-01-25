const fetch = require("node-fetch");
const fs = require("fs");
const faker = require("faker");

randomArray = function (length, max) {
  return Array.apply(null, Array(length)).map(function () {
    return Math.floor(Math.random() * max) + 1;
  });
};

downloadIMG = async function (url, filename) {
  console.log(url);
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(`./public/images/${filename}.png`, buffer, () =>
    console.log("finished downloading!")
  );
};

randomDate = function (start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
};

rich_text = () => {
  let url = faker.internet.url();
  return `<h1>${faker.lorem.sentence()}</h1>
  <p>${faker.lorem.sentences()}</p>
  <ul>
    <li>${faker.lorem.word()}</li>
    <li>${faker.lorem.word()}</li>
    <li>${faker.lorem.word()}</li>
    </ul>
  <p><a href="${url}" rel="noopener noreferrer" target="_blank">${url}</a></p>
  <p><br></p>
  <p><strong>${faker.lorem.sentence()}</strong></p><p><br></p>
  `;
};

const seedUtils = {
  randomArray: randomArray,
  downloadIMG: downloadIMG,
  randomDate: randomDate,
  rich_text: rich_text,
};

module.exports = seedUtils;
