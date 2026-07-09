import type { Category } from '../types.js';

export const createQuestionSet = (): Category[] => [
  {
    id: 'board2-item-shop',
    title: 'Item Shop',
    questions: [
      {
        id: 'board2-item-shop-100',
        categoryId: 'board2-item-shop',
        points: 100,
        text: 'Which item is most famously associated with putting yourself into stasis?',
        answer: "Zhonya's Hourglass",
        used: false
      },
      {
        id: 'board2-item-shop-200',
        categoryId: 'board2-item-shop',
        points: 200,
        text: 'Which defensive stat reduces incoming physical damage?',
        answer: 'Armor',
        used: false
      },
      {
        id: 'board2-item-shop-300',
        categoryId: 'board2-item-shop',
        points: 300,
        text: 'Which defensive stat reduces incoming magic damage?',
        answer: 'Magic Resist',
        used: false
      },
      {
        id: 'board2-item-shop-400',
        categoryId: 'board2-item-shop',
        points: 400,
        text: 'Which item effect usually helps champions clear wards around them?',
        answer: 'Sweeper / Oracle Lens effect',
        used: false
      },
      {
        id: 'board2-item-shop-500',
        categoryId: 'board2-item-shop',
        points: 500,
        text: 'What is the general name for items that give a powerful clickable effect?',
        answer: 'Active items',
        used: false
      }
    ]
  },
  {
    id: 'splash',
    title: 'Splash',
    questions: [
      {
        id: 'splash-100',
        categoryId: 'splash',
        points: 100,
        text: 'Which champion is this?',
        answer: 'Xhin Zhao',
        imageUrl: '/images/lol/splashes/xhin.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-200',
        categoryId: 'splash',
        points: 200,
        text: 'Which champion is this?',
        answer: 'Ivern',
        imageUrl: '/images/lol/splashes/ivern.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-300',
        categoryId: 'splash',
        points: 300,
        text: 'Which champion is this?',
        answer: 'Yorick',
        imageUrl: '/images/lol/splashes/yorick.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-400',
        categoryId: 'splash',
        points: 400,
        text: 'Which champion is this?',
        answer: 'Jayce',
        imageUrl: '/images/lol/splashes/jayce.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-500',
        categoryId: 'splash',
        points: 500,
        text: 'Which champion is this?',
        answer: 'Lux',
        imageUrl: '/images/lol/splashes/lux.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
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
        text: 'Welcher Champion ist das?"',
        answer: 'Viego',
        soundUrl: '/sounds/viego.mp3',
        used: false
      },
      {
        id: 'ohrwurm-200',
        categoryId: 'ohrwurm',
        points: 200,
        text: 'Welcher Champion ist das?',
        answer: 'K`sante - W',
        soundUrl: '/sounds/ksante.mp3',
        used: false
      },
      {
        id: 'ohrwurm-300',
        categoryId: 'ohrwurm',
        points: 300,
        text: 'Welcher Champion ist das?',
        answer: 'Rakan - Q',
        soundUrl: '/sounds/rakan.mp3',
        used: false
      },
      {
        id: 'ohrwurm-400',
        categoryId: 'ohrwurm',
        points: 400,
        text: 'Welcher Champion ist das?',
        answer: 'Nilah - Emote',
        soundUrl: '/sounds/nilah.mp3',
        used: false
      },
      {
        id: 'ohrwurm-500',
        categoryId: 'ohrwurm',
        points: 500,
        text: 'Welchen Champion gehört dieses Login-Theme',
        answer: 'Tristana',
        soundUrl: '/sounds/dragon_trainer_tristana.mp3',
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
        text: 'Welche Ability gehört nicht zu Corki?',
        answer: 'Passive ist von Tristana',
        questionType: 'ability-fake',

        champName: 'Corki',
        splashUrl: '/images/lol/splashes/Corki.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/corki/tristana_passive.png',
            abilityName: 'Hextech Munition',
            isFake: true,
            fakeFromChampion: 'Tristana'
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

        fakeAbilityKey: 'P',
        fakeAbilityFrom: 'Tristana',
        fakeAbilityName: 'Präzision',

        used: false
      },
      {
        id: 'viegod-200',
        categoryId: 'viegod',
        points: 200,
        text: 'Welche Ability gehört nicht zu Camille?',
        answer: 'E ist von Nilah',
        questionType: 'ability-fake',

        champName: 'Camille',
        splashUrl: '/images/lol/splashes/camille.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/camille/passive.png',
            abilityName: 'Adaptive Verteidigung'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/camille/q.png',
            abilityName: 'Präzisionsprotokoll',
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/camille/w.png',
            abilityName: 'Taktischer Klingenfeger'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/camille/nilah_e.png',
            abilityName: 'Greifhaken',
            isFake: true,
            fakeFromChampion: 'Nilah'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/camille/r.png',
            abilityName: 'Das Hextech-Ultimatum'
          }
        ],

        fakeAbilityKey: 'E',
        fakeAbilityFrom: 'Nilah',
        fakeAbilityName: 'Stromschnellen',

        used: false
      },
      {
        id: 'viegod-300',
        categoryId: 'viegod',
        points: 300,
        text: 'Welche Ability gehört nicht zu Kassadin?',
        answer: 'Q ist von Malzahar',
        questionType: 'ability-fake',

        champName: 'Kassadin',
        splashUrl: '/images/lol/splashes/kassadin.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/kassadin/passive.png',
            abilityName: 'Leerenstein'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/kassadin/malzahar_q.png',
            abilityName: 'Kugel der Leere',
            isFake: true,
            fakeFromChampion: 'Malzahar'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/kassadin/w.png',
            abilityName: 'Leerenklinge'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/kassadin/e.png',
            abilityName: 'Energiewelle',
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/kassadin/r.png',
            abilityName: 'Lerrenwanderer'
          }
        ],

        fakeAbilityKey: 'Q',
        fakeAbilityFrom: 'Malzahar',
        fakeAbilityName: 'Ruf der Leere',

        used: false
      },
      {
        id: 'viegod-400',
        categoryId: 'viegod',
        points: 400,
        text: 'Welche Ability gehört nicht zu Blitzcrank',
        answer: 'Q ist von Heimerdinger',
        questionType: 'ability-fake',

        champName: 'Blitzcrank',
        splashUrl: '/images/lol/splashes/blitzcrank.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/blitzcrank/passive.png',
            abilityName: 'Manabarriere'
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/blitzcrank/heimerdinger_q.png',
            abilityName: 'Raketenangriff',
            isFake: true,
            fakeFromChampion: 'Heimerdinger'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/blitzcrank/w.png',
            abilityName: 'Übertaktet'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/blitzcrank/e.png',
            abilityName: 'Geladene Faust'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/blitzcrank/r.png',
            abilityName: 'Statisches Feld',
          }
        ],

        fakeAbilityKey: 'Q',
        fakeAbilityFrom: 'Heimerdinger',
        fakeAbilityName: 'Hextech-Affinität',

        used: false
      },
      {
        id: 'viegod-500',
        categoryId: 'viegod',
        points: 500,
        text: 'Welche Ability gehört nicht zu Volibear?',
        answer: 'W ist von Udyr',
        questionType: 'ability-fake',

        champName: 'Volibear',
        splashUrl: '/images/lol/splashes/volibear.jpg',

        abilitySlots: [
          {
            key: 'P',
            imageUrl: '/images/lol/abilities/volibear/passive.png',
            abilityName: 'Der Unerbittliche Sturm',
          },
          {
            key: 'Q',
            imageUrl: '/images/lol/abilities/volibear/q.png',
            abilityName: 'Donnernder Schlag'
          },
          {
            key: 'W',
            imageUrl: '/images/lol/abilities/volibear/udyr_w.png',
            abilityName: 'Zerfleischen',
            isFake: true,
            fakeFromChampion: 'Udyr'
          },
          {
            key: 'E',
            imageUrl: '/images/lol/abilities/volibear/e.png',
            abilityName: 'Himmelsbrecher'
          },
          {
            key: 'R',
            imageUrl: '/images/lol/abilities/volibear/r.png',
            abilityName: 'Sturmbringer'
          }
        ],

        fakeAbilityKey: 'W',
        fakeAbilityFrom: 'Udyr',
        fakeAbilityName: 'Wildlingsklaue',

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
        text: 'Nenne die Ability!',
        answer: 'Renata - W (Bailout)',
        questionType: 'progressive',
        progressiveClues: [
          'Mit dieser Fähigkeit kann man True Damage an Vermündeten verursachen',
          'Ziel erhält 5 Sekunden lang Bonus Attack Speed & Movement Speed. Verdoppelt sich über den Zeitraum',
          'Der Buff erneuert sich, wenn das Ziel einen Takedown erzielt'
        ],
        used: false
      },
      {
        id: 'riot-200',
        categoryId: 'riot',
        points: 200,
        text: 'Nenne die Ability',
        answer: 'Nasus - R (Dominus)',
        questionType: 'progressive',
        progressiveClues: [
          'Halbiert den Cooldown einer anderen Fähigkeit',
          'Verursacht magischen Schaden abhängig vom maximalen Leben des Gegners',
          'Caster wird größer'
        ],
        used: false
      },
      {
        id: 'riot-300',
        categoryId: 'riot',
        points: 300,
        text: 'Nenne die Ability',
        answer: 'Kayle - E (Starfire Spellblade)',
        questionType: 'progressive',
        progressiveClues: [
          'Skaliert mit Bonus AD, AP, % missing HP & Crit Modifier',
          'passiver Teil gibt On-Hit Damage, aktiver Teil einen Auto Attack Reset',
          'erhöht Attack Range auf 525'
        ],
        used: false
      },
      {
        id: 'riot-400',
        categoryId: 'riot',
        points: 400,
        text: 'Nenne die Ability',
        answer: 'Vi - Q (Vault Breaker)',
        questionType: 'progressive',
        progressiveClues: [
          'getroffene Minions und Monster werden zum Caster gezogen',
          'Caster verlangsamt sich beim Channeln selbst',
          'getroffene Champions werden zurückgestoßen'
        ],
        used: false
      },
      {
        id: 'riot-500',
        categoryId: 'riot',
        points: 500,
        text: 'Nenne die Ability',
        answer: 'Zyra - W (Rampant Growth)',
        questionType: 'progressive',
        progressiveClues: [
          'Zwei Ladungen und interagiert mit den anderen Fähigkeiten',
          'Champion Takedowns frischen eine Ladung auf',
          'Gibt in einem kleinen Radius Sicht und kann als Ziel für Teleport benutzt werden'
        ],
        used: false
      }
    ]
  }
];

export function createQuestionSetBoard2(): Category[] {
  return [

    {
      id: 'Pi_*_Baron',
      title: 'Pi * Baron',
      questions: [
        {
          id: 'Pi_*_Baron-100',
          categoryId: 'Pi_*_Baron',
          points: 100,
          text: 'Wie viele Voidgrubs können maximal vor dem Rift Herald in einem Spiel spawnen?',
          answer: '6 Voidgrubs',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Baron-200',
          categoryId: 'Pi_*_Baron',
          points: 200,
          text: 'Wie viele Champs haben eine Fähigkeit die unendlich stacken kann?',
          answer: '15 Champions',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Baron-300',
          categoryId: 'Pi_*_Baron',
          points: 300,
          text: 'Wie viel Gold ist eine normale Minion-Wave ohne Cannon wert?',
          answer: '105 Gold',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Baron',
          categoryId: 'Pi_*_Baron',
          points: 400,
          text: 'Wie viel Gold bekommt man, wenn man bis Minute 10:00 auf einer Lane perfekt last-hittet, ohne Kills, Plates oder passives Gold mitzuzählen?',
          answer: '2295 Gold',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Baron-500',
          categoryId: 'Pi_*_Baron',
          points: 500,
          text: 'Wie viele aktuelle Champs haben ein Apostroph im offiziellen Namen?',
          answer: '8 Champions',
          questionType: 'estimate',
          used: false
        }
      ]
    },
    {
      id: 'board2-map-gap',
      title: 'Map Gap',
      questions: [
        {
          id: 'board2-map-gap-100',
          categoryId: 'board2-map-gap',
          points: 100,
          text: 'How many lanes does Summoner’s Rift have?',
          answer: '3 lanes: top, mid and bot',
          used: false
        },
        {
          id: 'board2-map-gap-200',
          categoryId: 'board2-map-gap',
          points: 200,
          text: 'Which neutral monster is associated with the Hand of Baron buff?',
          answer: 'Baron Nashor',
          used: false
        },
        {
          id: 'board2-map-gap-300',
          categoryId: 'board2-map-gap',
          points: 300,
          text: 'Which objective destroys towers faster by spawning empowered minions?',
          answer: 'Baron Nashor buff',
          used: false
        },
        {
          id: 'board2-map-gap-400',
          categoryId: 'board2-map-gap',
          points: 400,
          text: 'What structure must usually fall before a team can damage the Nexus?',
          answer: 'Inhibitors and Nexus turrets stand in the way, depending on game state.',
          used: false
        },
        {
          id: 'board2-map-gap-500',
          categoryId: 'board2-map-gap',
          points: 500,
          text: 'What is the common name for controlling enemy jungle vision and movement before an objective?',
          answer: 'Vision control / setting up vision',
          used: false
        }
      ]
    },
    {
      id: 'board2-lore-drop',
      title: 'Lore',
      questions: [
        {
          id: 'board2-lore-drop-100',
          categoryId: 'board2-lore-drop',
          points: 100,
          text: 'Which region is commonly associated with Garen and Lux?',
          answer: 'Demacia',
          used: false
        },
        {
          id: 'board2-lore-drop-200',
          categoryId: 'board2-lore-drop',
          points: 200,
          text: 'Which region is commonly associated with Darius and Draven?',
          answer: 'Noxus',
          used: false
        },
        {
          id: 'board2-lore-drop-300',
          categoryId: 'board2-lore-drop',
          points: 300,
          text: 'Which region is commonly associated with Yasuo, Yone and Irelia?',
          answer: 'Ionia',
          used: false
        },
        {
          id: 'board2-lore-drop-400',
          categoryId: 'board2-lore-drop',
          points: 400,
          text: 'Which region is commonly associated with Azir and Xerath?',
          answer: 'Shurima',
          used: false
        },
        {
          id: 'board2-lore-drop-500',
          categoryId: 'board2-lore-drop',
          points: 500,
          text: 'Which shadowy island region is associated with Thresh, Viego and the Ruination?',
          answer: 'The Shadow Isles',
          used: false
        }
      ]
    },
    {
      id: 'board2-numbers',
      title: 'Zahlenfriedhof',
      questions: [
        {
          id: 'board2-numbers-100',
          categoryId: 'board2-numbers',
          points: 100,
          text: 'Estimate: How many champions were available when League of Legends launched?',
          answer: '40 champions',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'board2-numbers-200',
          categoryId: 'board2-numbers',
          points: 200,
          text: 'Estimate: How many players are in a normal Summoner’s Rift match?',
          answer: '10 players',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'board2-numbers-300',
          categoryId: 'board2-numbers',
          points: 300,
          text: 'Estimate: How many inhibitors does one team have on Summoner’s Rift?',
          answer: '3 inhibitors',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'board2-numbers-400',
          categoryId: 'board2-numbers',
          points: 400,
          text: 'Estimate: How many ability slots does a champion normally have if you count passive, Q, W, E and R?',
          answer: '5 ability slots',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'board2-numbers-500',
          categoryId: 'board2-numbers',
          points: 500,
          text: 'Estimate: How many teams play in one standard League game?',
          answer: '2 teams',
          questionType: 'estimate',
          used: false
        }
      ]
    },
    {
      id: 'board2-champion-crimes',
      title: 'Champion Crimes',
      questions: [
        {
          id: 'board2-champion-crimes-100',
          categoryId: 'board2-champion-crimes',
          points: 100,
          text: 'Which champion is this?',
          answer: 'Yuumi',
          questionType: 'progressive',
          progressiveClues: [
            'This champion is often accused of not really playing the game.',
            'It can attach to an ally.',
            'It is a support champion.',
            'It is a magical cat.',
            'The answer makes half the lobby groan immediately.'
          ],
          used: false
        },
        {
          id: 'board2-champion-crimes-200',
          categoryId: 'board2-champion-crimes',
          points: 200,
          text: 'Which champion is this?',
          answer: 'Teemo',
          questionType: 'progressive',
          progressiveClues: [
            'This champion is small but emotionally damaging.',
            'Walking into the wrong area can suddenly hurt a lot.',
            'It uses traps.',
            'It blinds enemies.',
            'Captain Teemo on duty. Unfortunately.'
          ],
          used: false
        },
        {
          id: 'board2-champion-crimes-300',
          categoryId: 'board2-champion-crimes',
          points: 300,
          text: 'Which champion is this?',
          answer: 'Yasuo',
          questionType: 'progressive',
          progressiveClues: [
            'This champion is often either 0/10 or somehow carrying.',
            'It has a very famous wall.',
            'It can dash through units.',
            'It interacts heavily with knockups.',
            'Every solo queue team has suffered from one.'
          ],
          used: false
        },
        {
          id: 'board2-champion-crimes-400',
          categoryId: 'board2-champion-crimes',
          points: 400,
          text: 'Which champion is this?',
          answer: 'Shaco',
          questionType: 'progressive',
          progressiveClues: [
            'This champion makes the game feel less like League and more like harassment.',
            'It uses boxes.',
            'It can deceive enemies with a clone.',
            'It often appears where it absolutely should not be.',
            'The clown is not here to improve anyone’s evening.'
          ],
          used: false
        },
        {
          id: 'board2-champion-crimes-500',
          categoryId: 'board2-champion-crimes',
          points: 500,
          text: 'Which champion is this?',
          answer: 'Kayn',
          questionType: 'progressive',
          progressiveClues: [
            'This champion has two major transformation paths.',
            'It can move through terrain.',
            'It is a jungler.',
            'It uses a scythe.',
            'Red or blue, someone is about to complain.'
          ],
          used: false
        }
      ]
    }
  ];
}