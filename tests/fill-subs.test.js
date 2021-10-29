
const fillSubs = require('../src/utils/fill-subscriptions.js');
const subs = [
  {
    _key: '38542859',
    chat_id: 111111111,
    txt_route: 'Краснокаменск_Чита',
    route: ['Краснокаменск', 'Чита'],
  },
  {
    _key: '429613736',
    chat_id: 222222222,
    txt_route: 'Агинское_Чита',
    route: ['Агинское', 'Чита'],
  },
  {
    _key: '38543247',
    chat_id: 333333333,
    txt_route: 'Борзя_Чита',
    route: ['Борзя', 'Чита'],
  },
  {
    _key: '38543231',
    chat_id: 444444444,
    txt_route: 'Забайкальск_Чита',
    route: ['Забайкальск', 'Чита'],
  },
];

const recs = [
  {
    _key: '1',
    Body: 'Ищу машину  с Агинска до Читы , в 22-00, на сегодня, на данный момент в пути.  89244535332',
    route: ['Агинское', 'Чита'],
  },
  {
    _key: '2',
    Body: 'Ищу машину с Улан-Удэ до Агинска на воскресенье два человека. На 8 число вечеромТел.8-902-457-30-09, 89996035020',
    route: ['Улан-Удэ', 'Агинское'],
  },
  {
    _key: '3',
    Body: 'Ищу машину с У -Уд до агинска.1 пассажир без багажа.89243990988',
    route: ['Улан-Удэ', 'Агинское'],
  },
  {
    _key: '4',
    Body: '3.04.21г.-выезжаю Дульдурги-Агинск-Чита есть 4места. т.89962804104',
    route: ['Дульдурга', 'Агинское', 'Чита'],
  },
];

describe('fillSubs func', () => {
  const filledSubs = [];
  for (let rec of recs) {
    filledSubs.push(...fillSubs(rec, subs));        
  }
  test('correct count of filled subscriptions', () => {
    return expect(filledSubs.length).toBe(2);
  });
  test('Body of filled subs', () => {
    return expect(filledSubs.map(sub => sub.Body).sort()).toEqual([recs[0].Body, recs[3].Body].sort());
  });
  test('filled subs have property chat_id', () => {
    return expect(filledSubs[0].hasOwnProperty('chat_id')).toBe(true);
  });
  test('chat_id of filled subs', () => {
    return expect(filledSubs[0].chat_id).toBe(filledSubs[1].chat_id);
  });
  test('chat_id of filled subs 2', () => {
    return expect(filledSubs[0].chat_id).toBe(222222222);
  });
});