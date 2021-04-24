const axios = require('axios');
const parse0 = require('node-html-parser');

const { parse } = parse0;

axios
  .get('https://vk.com/topic-44660102_33569845?offset=89340')
  .then(function (resp) {
    // handle success
    const root = parse(resp.data);
    const infoDivs = root.querySelectorAll('div.post_item');    
    
    // console.log(infoDivs[0].structure);
    // console.log(infoDivs[0].querySelector('a.pi_author').text);  
    
    let recs = [];
    
    for (let infoDiv of infoDivs) {
      let rec = {src: 'vk'};
      rec.Body = infoDiv.querySelector('div.pi_text').structuredText.replace(/\n/g, ' ');
      rec.item_date = infoDiv.querySelector('a.item_date').text;
      rec.author = infoDiv.querySelector('a.pi_author').text;
      rec.authorId = infoDiv.querySelector('a.pi_author').getAttribute('href').slice(1);
      recs.push(rec);
    }

    console.log(JSON.stringify(recs, null, 2));
  })
  .catch(function (error) {
    // handle error
    console.error(error);
  })
  .then(function () {
    // always executed
  });