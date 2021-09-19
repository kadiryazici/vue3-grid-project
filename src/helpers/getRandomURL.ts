import { randomBetween } from '$helpers/randomBetween';

const keywords = [
   'lorem',
   'chocolate',
   'bruh',
   'google',
   'hospitality',
   'vscode',
   'page',
   '25',
   'login',
   'helpme',
   'so',
   'secret',
   'vuejsisbest',
   'dude',
   'valorant',
   'dcgel',
   'kanka',
   'btw',
   'gora-izle',
   'attack',
   'really',
   'haha',
   'lmao',
   'so-serious',
   'do',
   'I-beg-you',
   'freak',
   'matrix',
   'simulation',
   'doctor',
   'who',
   'what',
   'no',
   'please',
   'doit',
   'nope',
   'want',
   'to'
];

export const getRandomURL = () => {
   const keys = [] as string[];
   const length = randomBetween(2, 8, { floor: true });
   for (const ___ of Array(length)) {
      const randomKeywordIndex = randomBetween(0, keywords.length - 1, { floor: true });
      keys.push(keywords[randomKeywordIndex]);
   }
   return '/' + keys.join('-');
};
