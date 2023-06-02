import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    // opens the game with all new dice
    const [dice, setDice] = React.useState(allNewDice())
    // set tenzies to false (a new game)
    const [tenzies, setTenzies] = React.useState(false)
    // set the rolls to 0
    const [rolls, setRolls] = React.useState(0)
    // set the state at 0 for the "bestRolls" if "bestRolls" not present
    const [bestRolls, setBestRolls] = React.useState(
        JSON.parse(localStorage.getItem("bestRolls")) || 0
    )
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setRecords()
        }  
    }, [dice])
    
    
    
    // function to store the record (lowest) rolls
    function setRecords() {
        if (!bestRolls || rolls < bestRolls) {
            setBestRolls(rolls)
        }
    }
    
    // set bestRolls to localStorage when bestRolls changes
    React.useEffect(() => {
        localStorage.setItem("bestRolls", JSON.stringify(bestRolls))
    }, [bestRolls])
    
    // generates an individual new die
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    // generates an entire dice roll (all 10 dice)
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    // rolls dice that are not held
    function rollDice() {
        if(!tenzies) {
            setRolls(prevRolls => prevRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                // only generate a new die if !die.isHeld
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
        } else {
            // this else condition resets the game if game is won
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title"> Tenzies </h1>
            <div className="rolls-container">
                <h3 className="rolls">Rolls: {rolls}</h3>
                <h3 className="rolls">🎲</h3>
                <h3 className="rolls">Best Score: {bestRolls}</h3>
                <h3 className="rolls">🎲</h3>
            </div>
            {tenzies 
                ? <h3 className="won">You won!</h3>
                : <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
            }
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}