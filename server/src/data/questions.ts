import type { Category } from '../types.js';

export const createQuestionSet = (): Category[] => [
  {
    id: 'schaetzen',
    title: 'Schätzen',
    questions: [
      {
        id: 'schaetzen-100',
        categoryId: 'schaetzen',
        points: 100,
        text: 'Wie viele Spiele hat Burgi auf seinem Main Account',
        answer: '209',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'schaetzen-200',
        categoryId: 'schaetzen',
        points: 200,
        text: 'Gaming 200 question. Replace this text.',
        answer: 'Gaming 200 answer. Replace this answer.',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'schaetzen-300',
        categoryId: 'schaetzen',
        points: 300,
        text: 'Wie viele Pokemon gibt es in der Gen 1',
        answer: '151',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'schaetzen-400',
        categoryId: 'schaetzen',
        points: 400,
        text: 'Gaming 400 question. Replace this text.',
        answer: 'Gaming 400 answer. Replace this answer.',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'schaetzen-500',
        categoryId: 'schaetzen',
        points: 500,
        text: 'Gaming 500 question. Replace this text.',
        answer: 'Gaming 500 answer. Replace this answer.',
        questionType: 'estimate',
        used: false
      }
    ]
  },
  {
    id: 'lol',
    title: 'League of Legends',
    questions: [
      {
        id: 'lol-100', //Frage mit Bild zum zoomen
        categoryId: 'league',
        points: 100,
        text: 'Which champion is this?',
        answer: 'Ahri',
        imageUrl: '/images/lol/ahri.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'movies-200',
        categoryId: 'movies',
        points: 200,
        text: 'Movies 200 question. Replace this text.',
        answer: 'Movies 200 answer. Replace this answer.',
        used: false
      },
      {
        id: 'movies-300',
        categoryId: 'movies',
        points: 300,
        text: 'Movies 300 question. Replace this text.',
        answer: 'Movies 300 answer. Replace this answer.',
        used: false
      },
      {
        id: 'movies-400',
        categoryId: 'movies',
        points: 400,
        text: 'Movies 400 question. Replace this text.',
        answer: 'Movies 400 answer. Replace this answer.',
        used: false
      },
      {
        id: 'movies-500',
        categoryId: 'movies',
        points: 500,
        text: 'Movies 500 question. Replace this text.',
        answer: 'Movies 500 answer. Replace this answer.',
        used: false
      }
    ]
  },
  {
    id: 'cs2',
    title: 'Counter Strike 2',
    questions: [
      {
        id: 'cs2-100',
        categoryId: 'cs2',
        points: 100,
        text: 'Welche Map hat den Callout "Banana"',
        answer: 'Inferno',
        used: false
      },
      {
        id: 'cs2-200', //normale Frage mit Bild
        categoryId: 'cs2',
        points: 200,
        text: 'Wie viel kostet Kevlar ohne Helm + CZ75-Auto',
        answer: '500 + 650 = 1150',
        imageUrl: '/images/cs2/kevlar.png',
        imageMode: 'normal',
        used: false
      },
      {
        id: 'music-300',
        categoryId: 'music',
        points: 300,
        text: 'Music 300 question. Replace this text.',
        answer: 'Music 300 answer. Replace this answer.',
        used: false
      },
      {
        id: 'music-400',
        categoryId: 'music',
        points: 400,
        text: 'Music 400 question. Replace this text.',
        answer: 'Music 400 answer. Replace this answer.',
        used: false
      },
      {
        id: 'music-500',
        categoryId: 'music',
        points: 500,
        text: 'Music 500 question. Replace this text.',
        answer: 'Music 500 answer. Replace this answer.',
        used: false
      }
    ]
  },
  {
    id: 'internet',
    title: 'Internet',
    questions: [
      {
        id: 'internet-100',
        categoryId: 'internet',
        points: 100,
        text: 'Internet 100 question. Replace this text.',
        answer: 'Internet 100 answer. Replace this answer.',
        used: false
      },
      {
        id: 'internet-200',
        categoryId: 'internet',
        points: 200,
        text: 'Internet 200 question. Replace this text.',
        answer: 'Internet 200 answer. Replace this answer.',
        used: false
      },
      {
        id: 'internet-300',
        categoryId: 'internet',
        points: 300,
        text: 'Internet 300 question. Replace this text.',
        answer: 'Internet 300 answer. Replace this answer.',
        used: false
      },
      {
        id: 'internet-400',
        categoryId: 'internet',
        points: 400,
        text: 'Internet 400 question. Replace this text.',
        answer: 'Internet 400 answer. Replace this answer.',
        used: false
      },
      {
        id: 'internet-500',
        categoryId: 'internet',
        points: 500,
        text: 'Internet 500 question. Replace this text.',
        answer: 'Internet 500 answer. Replace this answer.',
        used: false
      }
    ]
  },
  {
    id: 'sounds',
    title: 'Sounds',
    questions: [
      {
        id: 'sounds-100',
        categoryId: 'sounds',
        points: 100,
        text: 'Which game is this sound from?',
        answer: 'Nani',
        soundUrl: '/sounds/testSound.mp3',
        used: false
      },
      {
        id: 'sounds-200',
        categoryId: 'sounds',
        points: 200,
        text: 'Which movie is this sound from?',
        answer: 'Star Wars',
        soundUrl: '/sounds/starwars-200.mp3',
        used: false
      },
      {
        id: 'sounds-300',
        categoryId: 'sounds',
        points: 300,
        text: 'Which meme sound is this?',
        answer: 'Vine boom',
        soundUrl: '/sounds/vineboom-300.mp3',
        used: false
      },
      {
        id: 'sounds-400',
        categoryId: 'sounds',
        points: 400,
        text: 'Which game character makes this sound?',
        answer: 'Mario',
        soundUrl: '/sounds/mario-400.mp3',
        used: false
      },
      {
        id: 'sounds-500',
        categoryId: 'sounds',
        points: 500,
        text: 'Name the song.',
        answer: 'Your answer here',
        soundUrl: '/sounds/song-500.mp3',
        used: false
      }
    ]
  }
];