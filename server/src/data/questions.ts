import type { Category } from '../types.js';

export const createQuestionSet = (): Category[] => [
  {
    id: 'emoji',
    title: 'Emoji', //mithilfe von Emojis das Game erraten
    questions: [
      {
        id: 'emoji-100',
        categoryId: 'emoji',
        points: 100,
        text: '🐐🏙️💥🚗',
        answer: "Goat Simulator",
        used: false
      },
      {
        id: 'emoji-200',
        categoryId: 'emoji',
        points: 200,
        text: '📦❗🕵️‍♂️🐍',
        answer: 'Metal Gear Solid',
        used: false
      },
      {
        id: 'emoji-300',
        categoryId: 'emoji',
        points: 300,
        text: '🐒🎈🎯💥',
        answer: 'Bloons TD',
        used: false
      },
      {
        id: 'emoji-400',
        categoryId: 'emoji',
        points: 400,
        text: '🏥🧟‍♂️💊🔫',
        answer: 'Left 4 Dead',
        used: false
      },
      {
        id: 'emoji-500',
        categoryId: 'emoji',
        points: 500,
        text: '🚀👨‍🚀🌍🔧',
        answer: 'Kerbal Space Program',
        used: false
      }
    ]
  },
  {
    id: 'Cover',
    title: 'Cover', //Game Cover reingezoomt und erkennen
    questions: [
      {
        id: 'cover-100',
        categoryId: 'cover',
        points: 100,
        text: 'Welches Game suchen wir?',
        answer: 'Fall Guys',
        imageUrl: '/images/covers/fallGuys.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'cover-200',
        categoryId: 'cover',
        points: 200,
        text: 'Welches Game suchen wir?',
        answer: 'Raft',
        imageUrl: '/images/covers/raft.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'cover-300',
        categoryId: 'cover',
        points: 300,
        text: 'Welches Game suchen wir?',
        answer: 'The Surge 2',
        imageUrl: '/images/covers/theSurge2.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'cover-400',
        categoryId: 'cover',
        points: 400,
        text: 'Welches Game suchen wir?',
        answer: 'Warframe',
        imageUrl: '/images/covers/warframe.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'cover-500',
        categoryId: 'cover',
        points: 500,
        text: 'Welches Game suchen wir?',
        answer: 'PUBG',
        imageUrl: '/images/covers/pubg.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      }
    ]
  },
  {
    id: 'ohrwurm',
    title: 'Ohrwurm', //Ingame Sound von Spiel
    questions: [
      {
        id: 'ohrwurm-100',
        categoryId: 'ohrwurm',
        points: 100,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Mario Kart - Item Box',
        soundUrl: '/sounds/marioKartItemBox.mp3',
        used: false
      },
      {
        id: 'ohrwurm-200',
        categoryId: 'ohrwurm',
        points: 200,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Overwatch - High Noon Ult',
        soundUrl: '/sounds/overwatchHighNoon.mp3',
        used: false
      },
      {
        id: 'ohrwurm-300',
        categoryId: 'ohrwurm',
        points: 300,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'The Binding of Isaac - Damage',
        soundUrl: '/sounds/theBindingOfIsaac.mp3',
        used: false
      },
      {
        id: 'ohrwurm-400',
        categoryId: 'ohrwurm',
        points: 400,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Dying Light - Night Scream',
        soundUrl: '/sounds/dyingLightNightScream.mp3',
        used: false
      },
      {
        id: 'ohrwurm-500',
        categoryId: 'ohrwurm',
        points: 500,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Stronghold Crusader - Schatzkammer',
        soundUrl: '/sounds/strongholdCrusader.mp3',
        used: false
      }
    ]
  },
  {
    id: 'memeit',
    title: 'Meme it', //drei Memes anzeigen und dadurch das Game erraten
    questions: [
      {
        id: 'memeit-100',
        categoryId: 'memeit',
        points: 100,
        text: 'Welches Game suchen wir?',
        answer: 'Hell Divers 2',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/hellDivers1.jpg',
          '/images/memes/hellDivers2.jpg',
          '/images/memes/hellDivers3.jpg',
          '/images/memes/hellDivers4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-200',
        categoryId: 'memeit',
        points: 200,
        text: 'Welches Game suchen wir?',
        answer: 'The Sims',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/theSims1.jpg',
          '/images/memes/theSims2.jpg',
          '/images/memes/theSims3.jpg',
          '/images/memes/theSims4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-300',
        categoryId: 'memeit',
        points: 300,
        text: 'Welches Game suchen wir?',
        answer: 'Minecraft',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/minecraft1.jpg',
          '/images/memes/minecraft2.jpg',
          '/images/memes/minecraft3.jpg',
          '/images/memes/minecraft4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-400',
        categoryId: 'memeit',
        points: 400,
        text: 'Welches Game suchen wir?',
        answer: 'GTA 5',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/gta1.jpg',
          '/images/memes/gta2.jpg',
          '/images/memes/gta3.jpg',
          '/images/memes/gta4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-500',
        categoryId: 'memeit',
        points: 500,
        text: 'Welches Game suchen wir?',
        answer: 'Call of Duty',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/cod1.jpg',
          '/images/memes/cod2.jpg',
          '/images/memes/cod3.jpg',
          '/images/memes/cod4.jpg'
        ],
        used: false
      }
    ]
  },
  /*{
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
  },*/
  /*{
    id: 'what-do-you-meme',
    title: 'What do you meme?', //3 tipps anzeigen und meme erraten
    questions: [
      {
        id: 'what-do-you-meme-100',
        categoryId: 'what-do-you-meme',
        points: 100,
        text: 'Welches Meme suchen wir?',
        answer: 'This is fine',
        questionType: 'progressive',
        progressiveClues: [
          'Eine Figur bleibt trotz einer Katastrophe ruhig',
          'Die Umgebung wird zunehmend gefährlicher',
          'Ein Hund sitzt in einem brennenden Raum'
        ],
        progressiveImageUrl: '/images/memes/thisIsFine.jpg',
        used: false
      },
      {
        id: 'what-do-you-meme-200',
        categoryId: 'what-do-you-meme',
        points: 200,
        text: 'Welches Meme suchen wir?',
        answer: 'Hide the Pain Harold',
        questionType: 'progressive',
        progressiveClues: [
          'Eine Person versucht, ihre wahren Gefühle zu verstecken',
          'Ein älterer Mann lächelt sichtbar gezwungen',
          'Der grauhaarige Mann sitzt mit Kaffeetasse oder Laptop da und verbirgt seinen Schmerz'
        ],
        progressiveImageUrl: '/images/memes/harold.jpg',
        used: false
      },
      {
        id: 'what-do-you-meme-300',
        categoryId: 'what-do-you-meme',
        points: 300,
        text: 'Welches Meme suchen wir?',
        answer: 'Expanding Brain',
        questionType: 'progressive',
        progressiveClues: [
          'Jemand vertritt öffentlich eine provokante Meinung',
          'Vor der Person steht ein Tisch mit einem Schild',
          'Steven Crowder sitzt hinter dem Schild „Change My Mind"'
        ],
        progressiveImageUrl: '/images/memes/changeMyMind.jpg',
        used: false
      },
      {
        id: 'what-do-you-meme-400',
        categoryId: 'what-do-you-meme',
        points: 400,
        text: 'Welches Meme suchen wir?',
        answer: 'Handsome Squidward',
        questionType: 'progressive',
        progressiveClues: [
          'Eine normalerweise schlecht gelaunte Figur erhält durch einen Unfall ein vollkommen neues Aussehen',
          'Das neue Gesicht ist übertrieben symmetrisch, kantig und wirkt wie eine parodierte Version eines männlichen Models',
          'Eine bekannte Figur aus SpongeBob hat plötzlich einen extrem markanten Kiefer, hohe Wangenknochen und einen verführerischen Gesichtsausdruck'
        ],
        progressiveImageUrl: '/images/memes/thaddäus.jpg',
        used: false
      },
      {
        id: 'what-do-you-meme-500',
        categoryId: 'what-do-you-meme',
        points: 500,
        text: 'Welches Meme suchen wir?',
        answer: 'Chill Guy',
        questionType: 'progressive',
        progressiveClues: [
          'Eine Figur bleibt selbst dann völlig gelassen, wenn rundherum eigentlich alles eskaliert',
          'Ein menschenähnliches Tier steht mit leichtem Grinsen und beiden Händen in den Hosentaschen da',
          'Ein brauner Hund trägt einen grauen Pullover, blaue Jeans und rote Schuhe. Sein gesamtes Konzept besteht darin, einfach entspannt zu sein'
        ],
        progressiveImageUrl: '/images/memes/chillGuy.jpg',
        used: false
      }
    ]
  }*/

  {
    id: 'HUDini',
    title: 'HUDini', //Ingame Hud zeigen und Spiel erraten
    questions: [
      {
        id: 'HUDini-100',
        categoryId: 'HUDini',
        points: 100,
        text: 'Welches Game suchen wir?',
        answer: 'Mario Kart',
        imageUrl: '/images/hud/marioKart.png',
        used: false
      },
      {
        id: 'HUDini-200',
        categoryId: 'HUDini',
        points: 200,
        text: 'Welches Game suchen wir?',
        answer: 'Black Ops 4 Zombies',
        imageUrl: '/images/hud/blackOpsZombies.png',
        used: false
      },
      {
        id: 'HUDini-300',
        categoryId: 'HUDini',
        points: 300,
        text: 'Welches Game suchen wir?',
        answer: 'Borderlands 3',
        imageUrl: '/images/hud/borderlands.png',
        used: false
      },
      {
        id: 'HUDini-400',
        categoryId: 'HUDini',
        points: 400,
        text: 'Welches Game suchen wir?',
        answer: 'Payday 2',
        imageUrl: '/images/hud/payday.png',
        used: false
      },
      {
        id: 'HUDini-500',
        categoryId: 'HUDini',
        points: 500,
        text: 'Welches Game suchen wir?',
        answer: 'Halo',
        imageUrl: '/images/hud/halo.png',
        used: false
      }
    ]
  }
];

export function createQuestionSetBoard2(): Category[] {
  return [

    {
      id: 'Pi_*_Daumen',
      title: 'Pi * 👍', //Schätzfragen für Gaming
      questions: [
        {
          id: 'Pi_*_Daumen-600',
          categoryId: 'Pi_*_Daumen',
          points: 600,
          text: 'Wie viele gesprochene Dialogzeilen enthält Skyrim ungefähr?',
          answer: '~ 60.000 Dialogzeilen',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-700',
          categoryId: 'Pi_*_Daumen',
          points: 700,
          text: 'Wie viele Schauspieler waren ungefähr, an der Produktion von Red Dead Redemption 2, beteiligt?',
          answer: '~ 1.200 Schauspieler',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-800',
          categoryId: 'Pi_*_Daumen',
          points: 800,
          text: 'Wie viele unterschiedliche Streckenlayouts bietet Gran Turismo 7 ungefähr?',
          answer: '110 Streckenlayouts', //110 Streckenlayouts auf 37 Strecken
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-900',
          categoryId: 'Pi_*_Daumen',
          points: 900,
          text: 'Wie viele Menschen hatten The Sims 4 bis April 2023 weltweit gespielt?',
          answer: '~ 70 Mio. Spieler', //Mehr als 70 Millionen Spieler
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-1000',
          categoryId: 'Pi_*_Daumen',
          points: 1000,
          text: 'Wie viele Menschen sahen das Finale der League-of-Legends-Weltmeisterschaft 2019 gleichzeitig in der Spitze?',
          answer: '~ 44 Mio. Zuschauer', //Rund 44 Millionen Zuscheier gleichzeitig
          questionType: 'estimate',
          used: false
        }
      ]
    },
    {
      id: 'board2-map-gap',
      title: 'Map Gap', //ingame map zeigen und dadurch spiel erraten
      questions: [
        {
          id: 'board2-map-gap-600',
          categoryId: 'board2-map-gap',
          points: 600,
          text: 'Welches Game suchen wir?',
          answer: 'PUBG - Erangel',
          imageUrl: '/images/maps/pubgErangel.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-700',
          categoryId: 'board2-map-gap',
          points: 700,
          text: 'Welches Game suchen wir?',
          answer: 'Pokemon - Diamond',
          imageUrl: '/images/maps/pokemonDiamond.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-800',
          categoryId: 'board2-map-gap',
          points: 800,
          text: 'Welches Game suchen wir?',
          answer: 'World of Warcraft',
          imageUrl: '/images/maps/wow.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-900',
          categoryId: 'board2-map-gap',
          points: 900,
          text: 'Welches Game suchen wir?',
          answer: 'Need for Speed - Most Wanted',
          imageUrl: '/images/maps/nfsMostWanted.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-1000',
          categoryId: 'board2-map-gap',
          points: 1000,
          text: 'Welches Game suchen wir?',
          answer: 'World of Tanks',
          imageUrl: '/images/maps/wot.jpg',
          used: false
        }
      ]
    },
    {
      id: 'logo-fusion',
      title: 'Logo Fusion', //zwei gaming logos oder auch marken oder consolen logos vermischen und erraten lassen
      questions: [
        {
          id: 'logo-fusion-600',
          categoryId: 'logo-fusion',
          points: 600,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Nintendo Switch + Portal',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/nintendoSwitchPortalFusion.png',
          logoFusionLeftName: 'Nintendo Switch',
          logoFusionLeftImageUrl: '/images/logo-fusion/nintendoSwitch.png',
          logoFusionRightName: 'Portal',
          logoFusionRightImageUrl: '/images/logo-fusion/portal.png',
          used: false
        },
        {
          id: 'logo-fusion-700',
          categoryId: 'logo-fusion',
          points: 700,
          text: 'Welche Logos wurden vermischt?',
          answer: 'XBOX + Halo',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/xboxHaloFusion.png',
          logoFusionLeftName: 'XBOX',
          logoFusionLeftImageUrl: '/images/logo-fusion/xbox.png',
          logoFusionRightName: 'Halo',
          logoFusionRightImageUrl: '/images/logo-fusion/halo.png',
          used: false
        },
        {
          id: 'logo-fusion-800',
          categoryId: 'logo-fusion',
          points: 800,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Game Cube + The Legend of Zelda',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/gameCubeZeldaFusion.png',
          logoFusionLeftName: 'Game Cube',
          logoFusionLeftImageUrl: '/images/logo-fusion/gameCube.png',
          logoFusionRightName: 'Zelda',
          logoFusionRightImageUrl: '/images/logo-fusion/zelda.png',
          used: false
        },
        {
          id: 'logo-fusion-900',
          categoryId: 'logo-fusion',
          points: 900,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Nintendo 64 + Elden Ring',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/n64EldenRingFusion.png',
          logoFusionLeftName: 'Nintendo 64',
          logoFusionLeftImageUrl: '/images/logo-fusion/n64.png',
          logoFusionRightName: 'Elden Ring',
          logoFusionRightImageUrl: '/images/logo-fusion/eldenRing2.png',
          used: false
        },
        {
          id: 'logo-fusion-1000',
          categoryId: 'logo-fusion',
          points: 1000,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Bendy + Cuphead',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/bendyCupheadFusion.png',
          logoFusionLeftName: 'Bendy',
          logoFusionLeftImageUrl: '/images/logo-fusion/bendy.png',
          logoFusionRightName: 'Cuphead',
          logoFusionRightImageUrl: '/images/logo-fusion/cuphead.png',
          used: false
        }
      ]
    },
    {
      id: 'patch-quatsch',
      title: 'Patch oder Quatsch',
      questions: [
        {
          id: 'patch-quatsch-600',
          categoryId: 'patch-quatsch',
          points: 600,
          text: 'Minecraft: Welcher Fakt ist frei erfunden?',
          answer: 'D ist fake!',
          questionType: 'patch-quatsch',
          patchCorrectChoiceKey: 'D',
          patchChoices: [
            {
              key: 'A',
              text: 'Blitze können die Oxidation von Kupferblöcken teilweise entfernen.'
            },
            {
              key: 'B',
              text: 'Lederstiefel verhindern, dass Spieler in Pulverschnee einsinken.'
            },
            {
              key: 'C',
              text: 'Man kann einen Ghast durch ein Fernrohr betrachten, um einen Fortschritt zu erhalten.'
            },
            {
              key: 'D',
              text: 'Füchse können mit einem Eimer aufgenommen und transportiert werden.',
              isFake: true
            }
          ],
          used: false
        },
        {
          id: 'patch-quatsch-700',
          categoryId: 'patch-quatsch',
          points: 700,
          text: 'Rainbow Six Siege: Welcher Fakt ist frei erfunden?',
          answer: 'B ist fake!',
          questionType: 'patch-quatsch',
          patchCorrectChoiceKey: 'B',
          patchChoices: [
            {
              key: 'A',
              text: 'Spieler konnten mit werfbaren Gadgets eine Art Dab-Tanz ausführen.'
            },
            {
              key: 'B',
              text: '„Geiseln konnten gegnerische Drohnen aufheben und zu den Verteidigern zurückbringen.',
              isFake: true
            },
            {
              key: 'C',
              text: 'Niedergeschossene Spieler schienen aus der Außenansicht Treppen hinabzuschweben.'
            },
            {
              key: 'D',
              text: 'Das Geräusch einer Drohne konnte weiterlaufen, obwohl die Drohne bereits zerstört war.'
            }
          ],
          used: false
        },
        {
          id: 'patch-quatsch-800',
          categoryId: 'patch-quatsch',
          points: 800,
          text: 'Rocket League: Welcher Fakt ist frei erfunden?',
          answer: 'D ist fake!',
          questionType: 'patch-quatsch',
          patchCorrectChoiceKey: 'D',
          patchChoices: [
            {
              key: 'A',
              text: 'Der Ball konnte in privaten Spielen durch einen Würfel ersetzt werden.'
            },
            {
              key: 'B',
              text: 'Die Boost-Stärke konnte auf das Zehnfache gestellt werden.'
            },
            {
              key: 'C',
              text: 'In einem Modus wurden Fahrzeuge beim Annähern an den Ball langsamer.'
            },
            {
              key: 'D',
              text: 'Spieler konnten den Ball vor dem Anstoß selbst auf einer frei gewählten Position platzieren.',
              isFake: true
            }
          ],
          used: false
        },
        {
          id: 'patch-quatsch-900',
          categoryId: 'patch-quatsch',
          points: 900,
          text: 'Stardew Valley: Welcher Fakt ist frei erfunden?',
          answer: 'A ist fake!',
          questionType: 'patch-quatsch',
          patchCorrectChoiceKey: 'A',
          patchChoices: [
            {
              key: 'A',
              text: 'Kühe können mit Hüten ausgestattet werden und produzieren dadurch höherwertige Milch.',
              isFake: true
            },
            {
              key: 'B',
              text: 'Man kann Katzen und Hunden Hüte aufsetzen.'
            },
            {
              key: 'C',
              text: 'Mayonnaise und Gelee können getrunken werden.'
            },
            {
              key: 'D',
              text: 'Gefüllte Truhen lassen sich durch Schläge mit einem schweren Werkzeug verschieben.'
            }
          ],
          used: false
        },
        {
          id: 'patch-quatsch-1000',
          categoryId: 'patch-quatsch',
          points: 1000,
          text: 'Apex Legends: Welcher Fakt ist frei erfunden?',
          answer: 'D ist fake!',
          questionType: 'patch-quatsch',
          patchCorrectChoiceKey: 'D',
          patchChoices: [
            {
              key: 'A',
              text: 'Zwei P2020-Pistolen können gleichzeitig im Akimbo-Modus verwendet werden.'
            },
            {
              key: 'B',
              text: 'Zwei Mozambique-Schrotflinten können gleichzeitig verwendet werden.'
            },
            {
              key: 'C',
              text: 'Der Akimbo-Modus wird aktiviert, sobald man eine zweite passende Waffe aufnimmt.'
            },
            {
              key: 'D',
              text: 'Zwei Wingman-Revolver können gleichzeitig verwendet werden, allerdings nur ohne Visier.',
              isFake: true
            }
          ],
          used: false
        }
      ]
    },
    {
      id: 'board2-fun-with-flags',
      title: 'Spaß mit Flaggen', //Flaggen von Games (ingame)
      questions: [
        {
          id: 'board2-fun-with-flags-600',
          categoryId: 'board2-fun-with-flags',
          points: 600,
          text: 'Welches Game suchen wir?',
          answer: 'Fallout - New Vegas',
          imageUrl: '/images/flaggen/falloutNewVegas.png',
          used: false
        },
        {
          id: 'board2-fun-with-flags-700',
          categoryId: 'board2-fun-with-flags',
          points: 700,
          text: 'Welches Game suchen wir?',
          answer: 'Skyrim',
          imageUrl: '/images/flaggen/skyrim.jpg',
          used: false
        },
        {
          id: 'board2-fun-with-flags-800',
          categoryId: 'board2-fun-with-flags',
          points: 800,
          text: 'Welches Game suchen wir?',
          answer: 'The Legend of Zelda',
          imageUrl: '/images/flaggen/theLegendofZelda.jpg',
          used: false
        },
        {
          id: 'board2-fun-with-flags-900',
          categoryId: 'board2-fun-with-flags',
          points: 900,
          text: 'Welches Game suchen wir?',
          answer: 'Hell Divers 2',
          imageUrl: '/images/flaggen/hellDivers.jpg',
          used: false
        },
        {
          id: 'board2-fun-with-flags-1000',
          categoryId: 'board2-fun-with-flags',
          points: 1000,
          text: 'Welches Game suchen wir?',
          answer: 'Cyberpunk 2077', //Nusa Flagge
          imageUrl: '/images/flaggen/cyberpunk.jpg',
          used: false
        }
      ]
    }
  ];
}