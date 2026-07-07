import type { Category } from '../types.js';

export const createQuestionSet = (): Category[] => [
  {
    id: 'smite_oder_schaetzen',
    title: 'Smite oder Schätzen',
    questions: [
      {
        id: 'smite_oder_schaetzen-100',
        categoryId: 'smite_oder_schaetzen',
        points: 100,
        text: 'Wie viele Voidgrubs können maximal vor dem Rift Herald in einem Spiel spawnen?',
        answer: '6 Voidgrubs',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'smite_oder_schaetzen-200',
        categoryId: 'smite_oder_schaetzen',
        points: 200,
        text: 'Wie viele Champs haben eine Fähigkeit die unendlich stacken kann?',
        answer: '15 Champions',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'smite_oder_schaetzen-300',
        categoryId: 'smite_oder_schaetzen',
        points: 300,
        text: 'Wie viel Gold ist eine normale Minion-Wave ohne Cannon wert?',
        answer: '105 Gold',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'smite_oder_schaetzen-400',
        categoryId: 'smite_oder_schaetzen',
        points: 400,
        text: 'Wie viel Gold bekommt man, wenn man bis Minute 10:00 auf einer Lane perfekt last-hittet, ohne Kills, Plates oder passives Gold mitzuzählen?',
        answer: '2295 Gold',
        questionType: 'estimate',
        used: false
      },
      {
        id: 'smite_oder_schaetzen-500',
        categoryId: 'smite_oder_schaetzen',
        points: 500,
        text: 'Wie viele aktuelle Champs haben ein Apostroph im offiziellen Namen?',
        answer: '8 Champions',
        questionType: 'estimate',
        used: false
      }
    ]
  },
  {
    id: 'splash',
    title: 'Splash',
    questions: [
      {
        id: 'splash-100', //Frage mit Bild zum zoomen
        categoryId: 'splash',
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
        id: 'splash-200',
        categoryId: 'splash',
        points: 200,
        text: 'Movies 200 question. Replace this text.',
        answer: 'Movies 200 answer. Replace this answer.',
        used: false
      },
      {
        id: 'splash-300',
        categoryId: 'splash',
        points: 300,
        text: 'Movies 300 question. Replace this text.',
        answer: 'Movies 300 answer. Replace this answer.',
        used: false
      },
      {
        id: 'splash-400',
        categoryId: 'splash',
        points: 400,
        text: 'Movies 400 question. Replace this text.',
        answer: 'Movies 400 answer. Replace this answer.',
        used: false
      },
      {
        id: 'splash-500',
        categoryId: 'splash',
        points: 500,
        text: 'Movies 500 question. Replace this text.',
        answer: 'Movies 500 answer. Replace this answer.',
        used: false
      }
    ]
  },
  {
    id: 'ohrwurm',
    title: 'Ohrwurm',
    questions: [
      {
        id: 'ohrwurm-100',
        categoryId: 'ohrwurm',
        points: 100,
        text: 'Welche Map hat den Callout "Banana"',
        answer: 'Inferno',
        used: false
      },
      {
        id: 'ohrwurm-200', //normale Frage mit Bild
        categoryId: 'ohrwurm',
        points: 200,
        text: 'Wie viel kostet Kevlar ohne Helm + CZ75-Auto',
        answer: '500 + 650 = 1150',
        imageUrl: '/images/cs2/kevlar.png',
        imageMode: 'normal',
        used: false
      },
      {
        id: 'ohrwurm-300',
        categoryId: 'ohrwurm',
        points: 300,
        text: 'Music 300 question. Replace this text.',
        answer: 'Music 300 answer. Replace this answer.',
        used: false
      },
      {
        id: 'ohrwurm-400',
        categoryId: 'ohrwurm',
        points: 400,
        text: 'Music 400 question. Replace this text.',
        answer: 'Music 400 answer. Replace this answer.',
        used: false
      },
      {
        id: 'ohrwurm-500',
        categoryId: 'ohrwurm',
        points: 500,
        text: 'Music 500 question. Replace this text.',
        answer: 'Music 500 answer. Replace this answer.',
        used: false
      }
    ]
  },
  {
    id: 'viegod',
    title: "Viego'd",
    questions: [
      {
        id: 'viegod-100',
        categoryId: 'viegod',
        points: 100,
        text: 'Welche Ability gehört nicht Corki?',
        answer: 'Passive ist von Tristana',
        questionType: 'ability-fake',

        champName: 'Corki',
        splashUrl: '/images/lol/splashes/Corki.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/corki/passive.png',
            abilityName: 'Präzision'
            isFake: true,
            fakeFromChampion: 'Brand'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/corki/q.png',
            abilityName: 'Phosphorus Bombe'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/corki/w.png',
            abilityName: 'Valkyrie',
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/corki/e.png',
            abilityName: 'Gatling Gun'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/corki/r.png',
            abilityName: 'Missile Barrage'
          }
        ],

        fakeAbilityKey: 'Passive',
        fakeAbilityFrom: 'Tristana',
        fakeAbilityName: 'Präzision',

        used: false
      },
      {
        id: 'viegod-200',
        categoryId: 'viegod',
        points: 200,
        text: 'Which ability does not belong to Viego?',
        answer: 'Q is from Aatrox.',
        questionType: 'ability-fake',

        champName: 'Viego',
        splashUrl: '/images/lol/splashes/viego.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/viego/passive.png',
            abilityName: 'Sovereign’s Domination'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/aatrox/q.png',
            abilityName: 'The Darkin Blade',
            isFake: true,
            fakeFromChampion: 'Aatrox'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/viego/w.png',
            abilityName: 'Spectral Maw'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/viego/e.png',
            abilityName: 'Harrowed Path'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/viego/r.png',
            abilityName: 'Heartbreaker'
          }
        ],

        fakeAbilityKey: 'Q',
        fakeAbilityFrom: 'Aatrox',
        fakeAbilityName: 'The Darkin Blade',

        used: false
      },
      {
        id: 'viegod-300',
        categoryId: 'viegod',
        points: 300,
        text: 'Which ability does not belong to Viego?',
        answer: 'E is from Heimerdinger.',
        questionType: 'ability-fake',

        champName: 'Viego',
        splashUrl: '/images/lol/splashes/viego.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/viego/passive.png',
            abilityName: 'Sovereign’s Domination'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/viego/q.png',
            abilityName: 'Blade of the Ruined King'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/viego/w.png',
            abilityName: 'Spectral Maw'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/heimerdinger/e.png',
            abilityName: 'CH-2 Electron Storm Grenade',
            isFake: true,
            fakeFromChampion: 'Heimerdinger'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/viego/r.png',
            abilityName: 'Heartbreaker'
          }
        ],

        fakeAbilityKey: 'E',
        fakeAbilityFrom: 'Heimerdinger',
        fakeAbilityName: 'CH-2 Electron Storm Grenade',

        used: false
      },
      {
        id: 'viegod-400',
        categoryId: 'viegod',
        points: 400,
        text: 'Which ability does not belong to Viego?',
        answer: 'R is from Garen.',
        questionType: 'ability-fake',

        champName: 'Viego',
        splashUrl: '/images/lol/splashes/viego.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/viego/passive.png',
            abilityName: 'Sovereign’s Domination'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/viego/q.png',
            abilityName: 'Blade of the Ruined King'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/viego/w.png',
            abilityName: 'Spectral Maw'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/viego/e.png',
            abilityName: 'Harrowed Path'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/garen/r.png',
            abilityName: 'Demacian Justice',
            isFake: true,
            fakeFromChampion: 'Garen'
          }
        ],

        fakeAbilityKey: 'R',
        fakeAbilityFrom: 'Garen',
        fakeAbilityName: 'Demacian Justice',

        used: false
      },
      {
        id: 'viegod-500',
        categoryId: 'viegod',
        points: 500,
        text: 'Which ability does not belong to Viego?',
        answer: 'P is from Renata Glasc.',
        questionType: 'ability-fake',

        champName: 'Viego',
        splashUrl: '/images/lol/splashes/viego.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/renata/passive.png',
            abilityName: 'Leverage',
            isFake: true,
            fakeFromChampion: 'Renata Glasc'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/viego/q.png',
            abilityName: 'Blade of the Ruined King'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/viego/w.png',
            abilityName: 'Spectral Maw'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/viego/e.png',
            abilityName: 'Harrowed Path'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/viego/r.png',
            abilityName: 'Heartbreaker'
          }
        ],

        fakeAbilityKey: 'P',
        fakeAbilityFrom: 'Renata Glasc',
        fakeAbilityName: 'Leverage',

        used: false
      }
    ]
  },
  {
    id: 'riot',
    title: 'Riot?',
    questions: [
      {
        id: 'riot-100',
        categoryId: 'riot',
        points: 100,
        text: 'Which game is this sound from?',
        answer: 'Nani',
        soundUrl: '/sounds/testSound.mp3',
        used: false
      },
      {
        id: 'riot-200',
        categoryId: 'riot',
        points: 200,
        text: 'Which movie is this sound from?',
        answer: 'Star Wars',
        soundUrl: '/sounds/starwars-200.mp3',
        used: false
      },
      {
        id: 'riot-300',
        categoryId: 'riot',
        points: 300,
        text: 'Which meme sound is this?',
        answer: 'Vine boom',
        soundUrl: '/sounds/vineboom-300.mp3',
        used: false
      },
      {
        id: 'riot-400',
        categoryId: 'riot',
        points: 400,
        text: 'Which game character makes this sound?',
        answer: 'Mario',
        soundUrl: '/sounds/mario-400.mp3',
        used: false
      },
      {
        id: 'riot-500',
        categoryId: 'riot',
        points: 500,
        text: 'Name the song.',
        answer: 'Your answer here',
        soundUrl: '/sounds/song-500.mp3',
        used: false
      }
    ]
  }
];