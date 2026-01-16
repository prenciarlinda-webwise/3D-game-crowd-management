import { create } from 'zustand'

const useGameStore = create((set, get) => ({
  // Game flow stages: 'registration' -> 'avatar-selection' -> 'instructions' -> 'playing' -> 'complete'
  gameStage: 'registration',
  
  // User information
  userInfo: null,
  avatar: null,
  
  // Game state
  currentScenario: 0,
  isComplete: false,
  participantId: Date.now().toString(),
  
  // Data collection
  choices: [],
  
  // IMPORTANT: 8 scenarios total
  scenarios: [
    {
      id: 1,
      type: 'color-choice',
      question: 'Choose a stand',
      colors: ['green', 'red']
    },
    {
      id: 2,
      type: 'color-choice',
      question: 'Choose a stand',
      colors: ['blue', 'red']
    },
    {
      id: 3,
      type: 'color-choice',
      question: 'Choose a stand',
      colors: ['blue', 'green']
    },
    {
      id: 4,
      type: 'crowd-influence',
      question: 'Choose a stand',
      crowdSizes: [15, 3]
    },
    {
      id: 5,
      type: 'animated-crowd',
      question: 'Choose a stand',
      leftStand: { initialCount: 3 },
      rightStand: {
        initialCount: 1,
        arriving: [
          { count: 1, delay: 2000 },
          { count: 2, delay: 4000 },
          { count: 2, delay: 6000 }
        ]
      }
    },
    {
      id: 6,
      type: 'carnival-attractions',
      question: 'Which attraction would you visit?',
      leftAttraction: { type: 'ferris-wheel', queueSize: 12 },
      rightAttraction: { type: 'carousel', queueSize: 2 }
    },
    {
      id: 7,
      type: 'street-width',
      question: 'Which path would you take?',
      leftStreet: { width: 'narrow' },
      rightStreet: { width: 'wide' }
    },
    {
      id: 8,
      type: 'christmas-lights',
      question: 'Which path would you walk down?',
      leftPath: { hasLights: true },
      rightPath: { hasLights: false }
    }
  ],

  // Actions
  setGameStage: (stage) => set({ gameStage: stage }),
  
  setUserInfo: (info) => set({ userInfo: info }),
  
  setAvatar: (avatar) => set({ avatar }),
  
  recordChoice: (scenarioId, choice, timeToDecide) => {
    const choices = get().choices
    set({
      choices: [...choices, {
        scenarioId,
        choice,
        timeToDecide,
        timestamp: new Date().toISOString()
      }]
    })
  },

  nextScenario: () => {
    const current = get().currentScenario
    const scenarios = get().scenarios
    
    console.log('Next Scenario Called:', { current, total: scenarios.length, next: current + 1 })
    
    if (current < scenarios.length - 1) {
      set({ currentScenario: current + 1 })
      console.log('Moving to scenario:', current + 1)
    } else {
      console.log('Game complete! Moving to completion screen')
      set({ 
        isComplete: true,
        gameStage: 'complete'
      })
    }
  },

  resetGame: () => {
    set({
      gameStage: 'registration',
      userInfo: null,
      avatar: null,
      currentScenario: 0,
      isComplete: false,
      choices: [],
      participantId: Date.now().toString()
    })
  },

  exportData: () => {
    const { participantId, userInfo, avatar, choices } = get()
    return {
      participantId,
      userInfo,
      avatar,
      choices,
      exportDate: new Date().toISOString()
    }
  }
}))

export default useGameStore
