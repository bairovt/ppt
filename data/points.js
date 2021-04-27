const points = [
  {
    _key: 'Chita',
    name: 'Чита',
    names: ['чита', 'читы', 'читу'],
  },
  {
    _key: 'UlanUde',
    name: 'Улан-Удэ',
    names: ['уланудэ', 'уу', 'уудэ', 'уудe', 'ууд', 'ууланудэ'],
    // todo: тест ленивое-голодное - поставить сначала у-у
    regex: /улан(\s|\-)уд(э|a|е)|улан(\s|\-)у|у(\s|\-)уд(э|e)?|у(\s|\-)?у/gi,
  },
  {
    _key: 'Irkutsk',
    name: 'Иркутск',
    names: ['иркутск', 'иркутска', 'ирк'],
  },
  {
    _key: 'Aginsk',
    name: 'Агинское',
    names: ['агинское', 'агинска', 'агинск', 'агинского'],
  },
  {
    _key: 'StAga',
    name: 'Станция Ага',
    names: ['станцияага', 'ст. ага', 'ст. аги', 'ст. агу'],
    regex: /станци(я|и|ю)\s*аг(а|у|и)|ст\s*аг(а|и|у)/gi,
  },
  {
    _key: 'Duldurga',
    name: 'Дульдурга',
    names: ['дульдурга', 'дульдурги', 'дульдургу', 'дульд'],
  },
  {
    _key: 'Mogoitui',
    name: 'Могойтуй',
    names: ['могойтуй', 'могойтуя', 'мгт', 'могойтуйя'],
  },
  {
    _key: 'Mogocha',
    name: 'Могоча',
    names: ['могоча', 'могочи', 'могочу'],
  },
  {
    _key: 'Borzya',
    name: 'Борзя',
    names: ['борзя', 'борзи', 'борзю', 'борзию', 'борзии', 'борзе'],
  },
  {
    _key: 'Bilituy',
    name: 'Билитуй',
    names: ['билитуй', 'билитуя'],
  },
  {
    _key: 'Zabaikalsk',
    name: 'Забайкальск',
    names: [
      'забайкальск',
      'забайкальска',
      'забик',
      'забика',
      'збк',
      'заб',
      'зб',
      'забайкалск',
      'забайкальс',
    ],
  },
  {
    _key: 'Krasnokamensk',
    name: 'Краснокаменск',
    names: [
      'краснокаменск',
      'краснокаменска',
      'красный',
      'красн',
      'красного',
      'краснокаменске',
      'красноеаменск',
      'краснокамеска',
    ],
  },
  {
    _key: 'Dauriya',
    name: 'Даурия',
    names: ['даурия', 'даурии', 'даурию'],
  },
  {
    _key: 'Casuchey',
    name: 'Цасучей',
    names: ['цасучей', 'cасучей', 'цасучея', 'цасучея'],
  },
  {
    _key: 'Shilka',
    name: 'Шилка',
    names: ['шилка', 'шилку', 'шилки'],
  },
  {
    _key: 'Nerchinsk',
    name: 'Нерчинск',
    names: ['нерчинск', 'нерчинска'],
  },
  {
    _key: 'Baley',
    name: 'Балей',
    names: ['балей', 'балея'],
  },
  {
    _key: 'Sretensk',
    name: 'Сретенск',
    names: ['сретенск', 'сретенска', 'сретинск', 'сретинска'],
  },
  {
    _key: 'Chernyshevsk',
    name: 'Чернышевск',
    names: ['чернышевск', 'чернышевска'],
  },
  {
    _key: 'Olovyannaya',
    name: 'Оловянная',
    names: ['оловянная', 'оловяная', 'оловянной', 'оловяной', 'оловянную', 'оловяную'],
  },
  {
    _key: 'Kyakhta',
    name: 'Кяхта',
    names: ['кяхта', 'кяхты', 'кяхту'],
  },
  {
    _key: 'Gusinoozersk',
    name: 'Гусиноозерск',
    names: [
      'гусиноозерск',
      'гусиноозёрск',
      'гусинозерск',
      'гусинозёрск',
      'гусиноозерска',
      'гусиноозёрска',
      'гусинозерска',
      'гусинозёрска',
    ],
  },
  {
    _key: 'Selenginsk',
    name: 'Селенгинск',
    names: ['селенгинск', 'селенгинска'],
  },
  {
    _key: 'Kyahta',
    name: 'Кяхта',
    names: ['кяхта', 'кяхты', 'кяхту'],
  },
  {
    _key: 'Novosibirsk',
    name: 'Новосибирск',
    names: ['новосибирск', 'новосибирска', 'новосиб', 'новосиба'],
  },
  {
    _key: 'Kalga',
    name: 'Калга',
    names: ['калга', 'калги', 'калгу'],
  },
  {
    _key: 'AlekZavod',
    name: 'Александровский Завод',
    dash: true,
    names: ['александровскийзавод'],
    regex: /ал(е|и)(к|г)(сандровск(ий|ого)|\.|\-)?\s*завода?/gi,
  },
  {
    _key: 'GazZavod',
    name: 'Газимурский Завод',
    dash: true,
    names: ['газимурскийзавод'],
    regex: /га(з|с)*(имурск(ий|ого)|\.|\-)?\s*завода?/gi,
  },
  {
    _key: 'Mogzon',
    name: 'Могзон',
    names: ['могзон', 'могзона'],
  },
  {
    _key: 'Aksha',
    name: 'Акша',
    names: ['акша', 'акшы', 'акшу'],
  },
  {
    _key: 'Kyra',
    name: 'Кыра',
    names: ['кыра', 'кыры', 'кыру'],
  },
  {
    _key: 'Priargunsk',
    name: 'Приаргунск',
    names: ['приаргунск', 'приаргунска'],
  },
  {
    _key: 'Karymskoe',
    name: 'Карымское',
    names: [
      'карымск',
      'карымска',
      'карымское',
      'карымского',
      'карымская',
      'карымской',
      'карымскую',
    ],
  },
  {
    _key: 'PetrovskZab',
    dash: true,
    name: 'Петровск-Забайкальский',
    names: ['петровск'],
    regex: /п(е|и)тровск(а|ого)?(\-|\s+)(забайкальск(а|ий)?|завода?)|п(е|и)тровск(а|ого|ий)?/gi,
  },
  {
    _key: 'Hilok',
    name: 'Хилок',
    names: ['хилок', 'хилка', 'хелок', 'хелка'],
  },
  {
    _key: 'Ulety',
    name: 'Улёты',
    names: ['улёты', 'улёт', 'улётов', 'улеты', 'улет', 'улетов'],
  },
  {
    _key: 'Kurumkan',
    name: 'Курумкан',
    names: ['курумкан', 'курумкана'],
  },
  {
    _key: 'UstBarguzin',
    dash: true,
    name: 'Усть-Баргузин',
    names: ['усть-баргузин', 'устьбаргузин', 'устьбаргузина'],
  },
  {
    _key: 'Ononsk',
    name: 'Ононск',
    names: ['ононск', 'ононска'],
  },
  {
    _key: 'Step',
    name: 'Степь',
    names: ['степь', 'степи'],
  },
  {
    _key: 'Yasnaya',
    name: 'Ясная',
    names: ['ясная', 'ясной', 'ясную', 'ясною'],
  },
  {
    _key: 'Yasnogorsk',
    name: 'Ясногорск',
    names: ['ясногорск', 'ясногорска'],
  },
  {
    _key: 'Bichura',
    name: 'Бичура',
    names: ['бичура', 'бичуру', 'бичуры'],
  },
  {
    _key: 'Muhorshibir',
    name: 'Мухоршибирь',
    names: ['мухоршибирь'],
    regex: /мух(о|а)р\s|\sм\-?ш\s/gi,
  },
  {
    _key: 'SherlovayGora',
    name: 'Шерловая Гора',
    names: ['шерловая', 'шерловой', 'шерловую', 'шерловою'],
    regex: /ш(ер|ерл)?\.?\s*гор(а|ы|у)/gi,
  },
  {
    _key: 'Khabarovsk',
    name: 'Хабаровск',
    names: ['хабаровск', 'хабаровска'],
  },
  {
    _key: 'Novopavlovka',
    name: 'Новопавловка',
    names: ['новопавловка', 'новопавловки', 'новопавловку'],
  },
  {
    _key: 'Pervomayskij',
    name: 'Первомайский',
    names: ['первомайский', 'первомайского', 'первомайск', 'первомайска'],
  },
  {
    _key: 'Darasun',
    name: 'Дарасун',
    names: ['дарасун', 'дарасуна'],
  },
  {
    _key: 'Nurinsk',
    name: 'Нуринск',
    names: ['нуринск', 'нуринска'],
  },
  {
    _key: 'Tunka',
    name: 'Тунка',
    names: ['тунка', 'тунки', 'тунку'],
  },
  {
    _key: 'Kyren',
    name: 'Кырен',
    names: ['кырен', 'кырена'],
  },
  {
    _key: 'Arshan',
    name: 'Аршан',
    names: ['аршан', 'аршана'],
  },
  {
    _key: 'Tarbagataj',
    name: 'Тарбагатай',
    names: ['тарбагатай', 'тарбагатая'],
  },
  {
    _key: 'Sludanka',
    name: 'Слюдянка',
    names: ['слюдянка', 'слюдянку', 'слюдянки'],
  },
  {
    _key: 'Bada',
    name: 'Бада',
    names: ['бада', 'бады', 'баду'],
  },
  {
    _key: 'Gornyj',
    name: 'Горный',
    names: ['горный', 'горного'],
  },
  {
    _key: 'Taishet',
    name: 'Тайшет',
    names: ['тайшет', 'тайшета'],
  },
  {
    _key: 'Durului',
    name: 'Дурулгуй',
    names: ['дурулгуй', 'дурулгуя'],
  },
  {
    _key: 'Goryachinsk',
    name: 'Горячинск',
    names: ['горячинск', 'горячинска'],
  },
  {
    _key: 'Tsugol',
    name: 'Цугол',
    names: ['цугол', 'цугола'],
  },
  {
    _key: 'Kharanor',
    name: 'Харанор',
    names: ['харанор', 'харанора'],
  },
  {
    _key: 'Urulga',
    name: 'Урульга',
    names: ['урульга', 'урульги', 'урульгу'],
  },
  {
    _key: 'KrasnyjChikoj',
    name: 'Красный Чикой',
    names: ['красныйчикой', 'чикой'],
    regex: /крас(н|ный)?\s*чик(ой)?/gi,
  },
  {
    _key: 'Balyaga',
    name: 'Баляга',
    names: ['баляга', 'баляги', 'балягу'],
  },
  {
    _key: 'Alxanai',
    name: 'Алханай',
    names: ['алханай', 'алханая', 'алхана'],
  },
];

module.exports = points;
