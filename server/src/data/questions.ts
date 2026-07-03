import type { Category } from '../types.js';

export const createQuestionSet = (): Category[] => [
  {
    id: 'gaming',
    title: 'Gaming',
    questions: [
      {
        id: 'gaming-100',
        categoryId: 'gaming',
        points: 100,
        text: 'Placeholder question for Gaming 100. Replace this text.',
        answer: 'Placeholder answer.',
        used: false
      },
      {
        id: 'gaming-200',
        categoryId: 'gaming',
        points: 200,
        text: 'Placeholder question for Gaming 200. Replace this text.',
        answer: 'Placeholder answer.',
        used: false
      },
      {
        id: 'gaming-300',
        categoryId: 'gaming',
        points: 300,
        text: 'Placeholder question for Gaming 300. Replace this text.',
        answer: 'Placeholder answer.',
        used: false
      },
      {
        id: 'gaming-400',
        categoryId: 'gaming',
        points: 400,
        text: 'Placeholder question for Gaming 400. Replace this text.',
        answer: 'Placeholder answer.',
        used: false
      },
      {
        id: 'gaming-500',
        categoryId: 'gaming',
        points: 500,
        text: 'Placeholder question for Gaming 500. Replace this text.',
        answer: 'Placeholder answer.',
        used: false
      }
    ]
  },
  {
    id: 'movies',
    title: 'Movies',
    questions: [100, 200, 300, 400, 500].map((points) => ({
      id: `movies-${points}`,
      categoryId: 'movies',
      points,
      text: `Placeholder question for Movies ${points}. Replace this text.`,
      answer: 'Placeholder answer.',
      used: false
    }))
  },
  {
    id: 'music',
    title: 'Music',
    questions: [100, 200, 300, 400, 500].map((points) => ({
      id: `music-${points}`,
      categoryId: 'music',
      points,
      text: `Placeholder question for Music ${points}. Replace this text.`,
      answer: 'Placeholder answer.',
      used: false
    }))
  },
  {
    id: 'internet',
    title: 'Internet',
    questions: [100, 200, 300, 400, 500].map((points) => ({
      id: `internet-${points}`,
      categoryId: 'internet',
      points,
      text: `Placeholder question for Internet ${points}. Replace this text.`,
      answer: 'Placeholder answer.',
      used: false
    }))
  },
  {
    id: 'random',
    title: 'Random',
    questions: [100, 200, 300, 400, 500].map((points) => ({
      id: `random-${points}`,
      categoryId: 'random',
      points,
      text: `Placeholder question for Random ${points}. Replace this text.`,
      answer: 'Placeholder answer.',
      used: false
    }))
  }
];
