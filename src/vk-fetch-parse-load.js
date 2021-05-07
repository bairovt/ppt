const axios = require('axios');
const parse0 = require('node-html-parser');

const { parse } = parse0;
const topicList = [
  {
    group: 'aginskoe_online',
    name: '[ МАРШРУТЫ ] Агинский округ - Забайкальск - Китай',
    url: 'https://vk.com/topic-44660102_36222363',
  },
  {
    group: 'aginskoe_online',
    name: '[ МАРШРУТЫ ] Агинский округ - Улан-Удэ',
    url: 'https://vk.com/topic-44660102_36222358',
  },
  {
    group: 'aginskoe_online',
    name: '[ МАРШРУТЫ ] Агинский округ - Чита',
    url: 'https://vk.com/topic-44660102_33569845',
  },
  {
    group: 'aginskoe_online',
    name: '[ МАРШРУТЫ ] Дульдурга - Агинское - Могойтуй',
    url: 'https://vk.com/topic-44660102_39454601',
  },
];


const topic = {
    group: 'aginskoe_online',
    name: '[ МАРШРУТЫ ] Агинский округ - Чита',
    url: 'https://vk.com/topic-44660102_33569845',
  };

const recs = [];

async function fetchTopicRecs(topic) {
  const offsetResp = await axios.get(topic.url + '?offset=1');
  const offsetList = offsetResp.data.match(/offset=\d+/gi);
  const offset = offsetList[offsetList.length - 1];

  const resp = await axios.get(topic.url + '?' + offset);
  const root = parse(resp.data);
  const postItemDivs = root.querySelectorAll('div.post_item');

  const topicRecs = [];

  for (let postItemDiv of postItemDivs) {
    let rec = { src: 'vk' };
    // rec.Body = postItemDiv.querySelector('div.pi_text').structuredText.replace(/\n/g, ' ');
    rec.Body = postItemDiv.querySelector('div.pi_text').structuredText;
    rec.item_date = postItemDiv.querySelector('a.item_date').text;
    rec.author = postItemDiv.querySelector('a.pi_author').text;
    rec.authorId = postItemDiv.querySelector('a.pi_author').getAttribute('href').slice(1);
    topicRecs.push(rec);
  }
  return topicRecs;
}

async function main() {

  const allTopicRecs = await Promise.all(topicList.map(topic => fetchTopicRecs(topic)))
  // const allTopicRecs = fetchTopicRecs(topic);

  // console.log(JSON.stringify(allTopicRecs, null, 2));
  console.log(allTopicRecs);
   
}

main();