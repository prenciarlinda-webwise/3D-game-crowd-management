import { useEffect, useState } from 'react'
import useGameStore from '../store/gameStore'
import './UI.css'

function UI() {
  const { currentScenario, scenarios, gameStage, choices, exportData, resetGame, userInfo } = useGameStore()

  // Debug logging
  console.log('UI Render - Scenarios:', scenarios.length, 'Current:', currentScenario)

  const handleDownloadData = () => {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crowd-study-${data.participantId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (gameStage === 'complete') {
    return (
      <div className="ui-overlay">
        <div className="ui-panel complete">
          <h2>Study Complete!</h2>
          <p>Thank you for participating, {userInfo?.name}!</p>
          <div className="summary">
            <h3>Your Choices:</h3>
            {choices.map((choice, index) => (
              <p key={index}>
                Scenario {choice.scenarioId}: <strong>{choice.choice}</strong> door
                <span className="time-badge">({(choice.timeToDecide / 1000).toFixed(1)}s)</span>
              </p>
            ))}
          </div>
          <div className="button-group">
            <button onClick={handleDownloadData}>Download Data</button>
            <button onClick={resetGame}>Restart</button>
          </div>
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentScenario]

  // Get detailed description for each scenario type
  const getScenarioDetails = (scenario) => {
    switch (scenario.type) {
      case 'color-choice':
        return {
          title: 'Fair Stand',
          description: `You are at a fair and see two stands ahead of you - one ${scenario.colors[0].toUpperCase()} and one ${scenario.colors[1].toUpperCase()}. You need to choose one stand to visit.`,
          instruction: 'Click on the stand you would like to visit.'
        }
      case 'crowd-influence':
        return {
          title: 'Fair Stand',
          description: `You are at a fair and see two identical stands ahead. The left stand has some people waiting, while the right stand has fewer people.`,
          instruction: 'Click on the stand you would like to visit.'
        }
      case 'animated-crowd':
        return {
          title: 'Fair Stand',
          description: 'You are at a fair and see two stands ahead. Take a moment to look around before making your choice.',
          instruction: 'Click on the stand you would like to visit.'
        }
      case 'carnival-attractions':
        return {
          title: 'Carnival Ride',
          description: `You are at a carnival and see two attractions: a Ferris Wheel on the left and a Carousel on the right. Both rides look fun and you have time for one.`,
          instruction: 'Click on the attraction you would like to ride.'
        }
      case 'street-width':
        return {
          title: 'Choose Your Path',
          description: 'You are walking through town and come to a fork. On the left is a narrow street, and on the right is a wide street. Both lead to the same destination.',
          instruction: 'Click on the street you would choose to walk down.'
        }
      case 'christmas-lights':
        return {
          title: 'Winter Walk',
          description: 'You are taking a winter walk and see two paths ahead. The left path has Christmas decorations and lights. The right path is a simple winter trail.',
          instruction: 'Click on the path you would choose to walk through.'
        }
      default:
        return {
          title: 'Make a Choice',
          description: 'You see two options ahead of you.',
          instruction: 'Click on your preferred choice.'
        }
    }
  }

  const details = getScenarioDetails(scenario)

  return (
    <div className="ui-overlay">
      <div className="ui-panel">
        <div className="scenario-info">
          <h3>Scenario {currentScenario + 1} of {scenarios.length}: {details.title}</h3>
          <p className="scenario-description">{details.description}</p>
        </div>
        <div className="instructions">
          <p className="scenario-instruction">{details.instruction}</p>
        </div>
      </div>
    </div>
  )
}

export default UI
