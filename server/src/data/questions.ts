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
        text: '🧱⛏️💎🧟',
        answer: "Minecraft",
        used: false
      },
      {
        id: 'emoji-200',
        categoryId: 'emoji',
        points: 200,
        text: '🚗⚽🥅🚀',
        answer: 'Rocket League',
        used: false
      },
      {
        id: 'emoji-300',
        categoryId: 'emoji',
        points: 300,
        text: '🐎🤠🔫🌵',
        answer: 'Red Dead Redemption',
        used: false
      },
      {
        id: 'emoji-400',
        categoryId: 'emoji',
        points: 400,
        text: '⚔️🔥💀🏰',
        answer: 'Dark Souls',
        used: false
      },
      {
        id: 'emoji-500',
        categoryId: 'emoji',
        points: 500,
        text: '🏹🤖🦖🌿',
        answer: 'Horizon Zero Dawn',
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
        answer: 'Super Mario 64',
        imageUrl: '/images/covers/supermario64.jpg',
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
        answer: 'GTA 5',
        imageUrl: '/images/covers/gta5.jpg',
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
        answer: 'Cyberpunk',
        imageUrl: '/images/covers/cyberpunk.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-400',
        categoryId: 'splash',
        points: 400,
        text: 'Welches Game suchen wir?',
        answer: 'Doom Eternal',
        imageUrl: '/images/covers/doom.jpg',
        imageMode: 'zoom',
        zoomLevels: [3, 2.5, 2, 1.5, 1],
        zoomStartIndex: 0,
        used: false
      },
      {
        id: 'splash-500',
        categoryId: 'splash',
        points: 500,
        text: 'Welches Game suchen wir?',
        answer: 'Elden Ring',
        imageUrl: '/images/covers/eldenring.jpg',
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
        answer: 'Minecraft - Creeper',
        soundUrl: '/sounds/creeper.mp3',
        used: false
      },
      {
        id: 'ohrwurm-200',
        categoryId: 'ohrwurm',
        points: 200,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Among Us - Emergency Meeting',
        soundUrl: '/sounds/amongUs_emergencyMeeting.mp3',
        used: false
      },
      {
        id: 'ohrwurm-300',
        categoryId: 'ohrwurm',
        points: 300,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Legend of Zelda - Chest',
        soundUrl: '/sounds/zelda_chest.mp3',
        used: false
      },
      {
        id: 'ohrwurm-400',
        categoryId: 'ohrwurm',
        points: 400,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Valorant - Defuse',
        soundUrl: '/sounds/valorant_defuse.mp3',
        used: false
      },
      {
        id: 'ohrwurm-500',
        categoryId: 'ohrwurm',
        points: 500,
        text: 'Zu welchem Game gehört dieser Sound?',
        answer: 'Portal',
        soundUrl: '/sounds/portal.mp3',
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
        answer: 'League of Legends',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/lol1.png',
          '/images/memes/lol2.jpg',
          '/images/memes/lol3.jpg',
          '/images/memes/lol4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-200',
        categoryId: 'memeit',
        points: 200,
        text: 'Welches Game suchen wir?',
        answer: 'Skyrim',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/skyrim1.jpg',
          '/images/memes/skyrim3.jpg',
          '/images/memes/skyrim4.png',
          '/images/memes/skyrim2.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-300',
        categoryId: 'memeit',
        points: 300,
        text: 'Welches Game suchen wir?',
        answer: 'Counter-Strike 2',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/cs1.jpg',
          '/images/memes/cs2.png',
          '/images/memes/cs3.jpg',
          '/images/memes/cs4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-400',
        categoryId: 'memeit',
        points: 400,
        text: 'Welches Game suchen wir?',
        answer: 'Dark Souls',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/darksouls1.jpg',
          '/images/memes/darksouls2.jpg',
          '/images/memes/darksouls3.jpg',
          '/images/memes/darksouls4.jpg'
        ],
        used: false
      },
      {
        id: 'memeit-500',
        categoryId: 'memeit',
        points: 500,
        text: 'Welches Game suchen wir?',
        answer: 'Among Us',
        questionType: 'meme-reveal',
        memeImages: [
          '/images/memes/amongUs1.jpg',
          '/images/memes/amongUs2.jpg',
          '/images/memes/amongUs3.png',
          '/images/memes/amongUs4.jpg'
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
  {
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
          text: 'Wie viele Stunden an unterschiedlichen filmischen Sequenzen und Dialogszenen wurden insgesamt für Baldur’s Gate 3 produziert?',
          answer: '174 Stunden',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-700',
          categoryId: 'Pi_*_Daumen',
          points: 700,
          text: 'Wie viele Flughäfen sind in Microsoft Flight Simulator (2020) weltweit enthalten?',
          answer: '~ 37.000 Flughäfen',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-800',
          categoryId: 'Pi_*_Daumen',
          points: 800,
          text: 'Wie viele gesprochene Dialogzeilen enthält Red Dead Redemption 2 ungefähr?',
          answer: '500.000 Dialogzeilen',
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-900',
          categoryId: 'Pi_*_Daumen',
          points: 900,
          text: 'Wie viele einzelne Blockpositionen umfasst ein vollständiger Minecraft-Overworld-Chunk, inklusive leerer Luftblöcke?',
          answer: '98.304 Blockpositionen (16 x 16 x 384)', //Ein Chunk ist 16 Blöcke breit, 16 Blöcke lang und im normalen Overworld insgesamt 384 Blöcke hoch.
          questionType: 'estimate',
          used: false
        },
        {
          id: 'Pi_*_Daumen-1000',
          categoryId: 'Pi_*_Daumen',
          points: 1000,
          text: 'Angenommen, man würde in No Man’s Sky jede Sekunde einen neuen Planeten besuchen: Wie viele Jahre würde es dauern, alle theoretisch möglichen Planeten zu besuchen?',
          answer: '585 Milliarde Jahre', //Das Spiel basiert auf einem 64-Bit-System mit theoretisch 18.446.744.073.709.551.616 möglichen Planeten. Weil normale Zahlen offenbar nicht mehr gereicht haben.
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
          answer: 'GTA 5',
          imageUrl: '/images/maps/gta5.png',
          used: false
        },
        {
          id: 'board2-map-gap-700',
          categoryId: 'board2-map-gap',
          points: 700,
          text: 'Welches Game suchen wir?',
          answer: 'Sea of Thieves',
          imageUrl: '/images/maps/seaOfThieves.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-800',
          categoryId: 'board2-map-gap',
          points: 800,
          text: 'Welches Game suchen wir?',
          answer: 'Death Stranding',
          imageUrl: '/images/maps/deathStranding.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-900',
          categoryId: 'board2-map-gap',
          points: 900,
          text: 'Welches Game suchen wir?',
          answer: 'Hollow Knight',
          imageUrl: '/images/maps/hollowKnight.jpg',
          used: false
        },
        {
          id: 'board2-map-gap-1000',
          categoryId: 'board2-map-gap',
          points: 1000,
          text: 'Welches Game suchen wir?',
          answer: 'Assassins Creed - Black Flag',
          imageUrl: '/images/maps/assassinsCreed.jpg',
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
          answer: 'Playstation + League of Legends',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/playstationLolFusion.png',
          logoFusionLeftName: 'Playstation',
          logoFusionLeftImageUrl: '/images/logo-fusion/playstation.png',
          logoFusionRightName: 'League of Legends',
          logoFusionRightImageUrl: '/images/logo-fusion/leagueOfLegends.png',
          used: false
        },
        {
          id: 'logo-fusion-700',
          categoryId: 'logo-fusion',
          points: 700,
          text: 'Welche Logos wurden vermischt?',
          answer: 'XBOX + Among Us',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/xboxAmongUsFusion.png',
          logoFusionLeftName: 'XBOX',
          logoFusionLeftImageUrl: '/images/logo-fusion/xbox.png',
          logoFusionRightName: 'Among Us',
          logoFusionRightImageUrl: '/images/logo-fusion/amongUs.png',
          used: false
        },
        {
          id: 'logo-fusion-800',
          categoryId: 'logo-fusion',
          points: 800,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Steam + CS2',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/steamCs2Fusion.png',
          logoFusionLeftName: 'Steam',
          logoFusionLeftImageUrl: '/images/logo-fusion/steam.png',
          logoFusionRightName: 'CS2',
          logoFusionRightImageUrl: '/images/logo-fusion/cs2.png',
          used: false
        },
        {
          id: 'logo-fusion-900',
          categoryId: 'logo-fusion',
          points: 900,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Nintendo 64 + Minecraft',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/minecraftN64Fusion.png',
          logoFusionLeftName: 'Nintendo 64',
          logoFusionLeftImageUrl: '/images/logo-fusion/n64.png',
          logoFusionRightName: 'Minecraft',
          logoFusionRightImageUrl: '/images/logo-fusion/minecraft.png',
          used: false
        },
        {
          id: 'logo-fusion-1000',
          categoryId: 'logo-fusion',
          points: 1000,
          text: 'Welche Logos wurden vermischt?',
          answer: 'Rocket League + Candy Crush',
          questionType: 'logo-fusion',
          fusionImageUrl: '/images/logo-fusion/RocketLeagueCandyCrushFusion.png',
          logoFusionLeftName: 'Rocket League',
          logoFusionLeftImageUrl: '/images/logo-fusion/rocketLeague.png',
          logoFusionRightName: 'Candy Crush',
          logoFusionRightImageUrl: '/images/logo-fusion/candyCrush.png',
          used: false
        }
      ]
    },
    {
      id: 'board2-polyglot',
      title: 'Polyglot', //ein gaming wort in einer sehr fremden sprache zeigen und es wird immer einfacher und erkennbarer bis zur deutschen sprache
      questions: [
        {
          id: 'board2-polyglot-600',
          categoryId: 'board2-polyglot',
          points: 600,
          text: 'Welches Wort ist gesucht?',
          answer: 'Spieler',
          questionType: 'progressive',
          progressiveClues: [
            'プレイヤー',
            'pelaaja',
            'jugador',
            'speler',
            'player'
          ],
          used: false
        },
        {
          id: 'board2-polyglot-700',
          categoryId: 'board2-polyglot',
          points: 700,
          text: 'Welches Wort ist gesucht?',
          answer: 'Schatz',
          questionType: 'progressive',
          progressiveClues: [
            '宝',
            'hazine',
            'tesoro',
            'schat',
            'treasure'
          ],
          used: false
        },
        {
          id: 'board2-polyglot-800',
          categoryId: 'board2-polyglot',
          points: 800,
          text: 'Welches Wort ist gesucht?',
          answer: 'Zauber',
          questionType: 'progressive',
          progressiveClues: [
            '魔法',
            'büyü',
            'hechizo',
            'toverij',
            'spell'
          ],
          used: false
        },
        {
          id: 'board2-polyglot-900',
          categoryId: 'board2-polyglot',
          points: 900,
          text: 'Welches Wort ist gesucht?',
          answer: 'Rüstung',
          questionType: 'progressive',
          progressiveClues: [
            '鎧',
            'zırh',
            'armadura',
            'uitrusting',
            'armor'
          ],
          used: false
        },
        {
          id: 'board2-polyglot-1000',
          categoryId: 'board2-polyglot',
          points: 1000,
          text: 'Welches Wort ist gesucht?',
          answer: 'Schwert',
          questionType: 'progressive',
          progressiveClues: [
            '剣',
            'kılıç',
            'espada',
            'zwaard',
            'sword'
          ],
          used: false
        },
      ]
    },
    {
      id: 'board2-fun-with-flags',
      title: 'Spaß mit Flaggen', //Spaß mit flaggen
      questions: [
        {
          id: 'board2-fun-with-flags-600',
          categoryId: 'board2-fun-with-flags',
          points: 600,
          text: 'Welches Land ist das?',
          answer: 'Elfenbeinküste',
          imageUrl: '/images/flaggen/elfenbeinküste.png',
          used: false
        },
        {
          id: 'board2-fun-with-flags-700',
          categoryId: 'board2-fun-with-flags',
          points: 700,
          text: 'Welches Land ist das?',
          answer: 'Nigeria',
          imageUrl: '/images/flaggen/nigeria.png',
          used: false
        },
        {
          id: 'board2-fun-with-flags-800',
          categoryId: 'board2-fun-with-flags',
          points: 800,
          text: 'Welches Land ist das?',
          answer: 'Uganda',
          imageUrl: '/images/flaggen/uganda.png',
          used: false
        },
        {
          id: 'board2-fun-with-flags-900',
          categoryId: 'board2-fun-with-flags',
          points: 900,
          text: 'Welches Land ist das?',
          answer: 'Chad',
          imageUrl: '/images/flaggen/chad.png',
          used: false
        },
        {
          id: 'board2-fun-with-flags-1000',
          categoryId: 'board2-fun-with-flags',
          points: 1000,
          text: 'Welches Land ist das?',
          answer: 'Malediven',
          imageUrl: '/images/flaggen/malediven.png',
          used: false
        }
      ]
    }
  ];
}