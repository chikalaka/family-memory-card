import React, { useEffect, useState } from "react"
import styles from "./App.module.css"
import ReactCardFlip from "react-card-flip"
import CareBears from "./assets/photos/careBears.jpg"
import I1 from "./assets/photos/1.jpeg"
import I2 from "./assets/photos/2.jpeg"
import I3 from "./assets/photos/3.jpeg"
import I4 from "./assets/photos/4.jpeg"
import I5 from "./assets/photos/5.jpeg"
import I6 from "./assets/photos/6.jpeg"
import I7 from "./assets/photos/7.jpeg"
import I8 from "./assets/photos/8.jpeg"
import I9 from "./assets/photos/9.jpeg"
import I10 from "./assets/photos/10.jpeg"
import I11 from "./assets/photos/11.jpeg"
import I12 from "./assets/photos/12.jpeg"
import I13 from "./assets/photos/13.jpeg"
import I14 from "./assets/photos/14.jpeg"
import I15 from "./assets/photos/15.jpeg"
import I16 from "./assets/photos/16.jpeg"
import I17 from "./assets/photos/17.jpeg"

const allImages = [
  I1,
  I2,
  I3,
  I4,
  I5,
  I6,
  I7,
  I8,
  I9,
  I10,
  I11,
  I12,
  I13,
  I14,
  I15,
  I16,
  I17
]

function shuffle(arr: Array<number>) {
  return arr.sort(() => Math.random() - 0.5)
}

const getRandImageLocation = (pairCount: number) =>
  // @ts-ignore
  shuffle([...Array(pairCount).keys(), ...Array(pairCount).keys()])

const getBoolArray = (pairCount: number, isTrue: boolean) =>
  Array(pairCount * 2).fill(isTrue)

type Choice = {
  location: number | null
  imageId: number | null
}

function App() {
  const [movesCount, setMovesCount] = useState(0)
  const [pairCount, setPairCount] = useState(10)
  const incrementPair = () => {
    if (pairCount < allImages.length) {
      setMovesCount(0)
      setPairCount(c => c + 1)
    }
  }
  const decrementPair = () => {
    if (pairCount > 1) {
      setMovesCount(0)
      setPairCount(c => c - 1)
    }
  }
  const images = allImages.slice(0, pairCount)

  const [imagesLocations, setImagesLocations] = useState(
    getRandImageLocation(pairCount)
  )

  const setNewGame = () => {
    setMovesCount(0)
    setAreFlipped(getBoolArray(pairCount, false))
    setAreDone(getBoolArray(pairCount, false))
    setFirstChoice({ location: null, imageId: null })
    setImagesLocations(getRandImageLocation(pairCount))
  }
  const [areFlipped, setAreFlipped] = useState<Array<boolean>>(
    getBoolArray(pairCount, false)
  )
  const [areDone, setAreDone] = useState<Array<boolean>>(
    getBoolArray(pairCount, false)
  )
  const isBoardDone = areDone.every(l => l)

  useEffect(() => {
    setImagesLocations(getRandImageLocation(pairCount))
    setAreFlipped(getBoolArray(pairCount, false))
    setAreDone(getBoolArray(pairCount, false))
  }, [pairCount])

  const hideAll = () => {
    setAreFlipped(
      getBoolArray(pairCount, false).map((val, index) => val || areDone[index])
    )
  }

  const flipOne = (location: number | null) => {
    if (location === null) return
    setAreFlipped(arr => {
      const newArr = arr
      newArr[location] = true
      return newArr
    })
  }

  const [firstChoice, setFirstChoice] = useState<Choice>({
    location: null,
    imageId: null
  })

  const flip = (choice: Choice) => () => {
    setMovesCount(c => c + 1)
    if (firstChoice.location === null) {
      hideAll()
      flipOne(choice.location)
      setFirstChoice(choice)
    } else {
      flipOne(choice.location)
      if (choice.imageId === firstChoice.imageId) {
        setAreDone(arr => {
          const newArr = arr
          if (choice.location !== null) newArr[choice.location] = true
          if (firstChoice.location !== null) newArr[firstChoice.location] = true
          return newArr
        })
      }
      setFirstChoice({ location: null, imageId: null })
    }
  }
  const isFlipped = (boardLocation: number) => areFlipped[boardLocation]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.newGame} onClick={setNewGame}>
          New game
        </button>
        <div>Moves: {movesCount}</div>
        <div className={styles.pairCountContainer}>
          <div className={styles.pairChange} onClick={decrementPair}>
            -
          </div>
          <div>{pairCount}</div>
          <div className={styles.pairChange} onClick={incrementPair}>
            +
          </div>
        </div>
      </div>
      <div
        className={styles.goodJob + (isBoardDone ? " " + styles.boardDone : "")}
      >
        כל הכבוד!
      </div>
      <div className={styles.board}>
        {imagesLocations.map((location, index) => (
          <Card
            isFlipped={isFlipped(index)}
            flip={flip({ location: index, imageId: location })}
            image={images[location]}
          />
        ))}
      </div>
    </div>
  )
}

// @ts-ignore
function Card({ isFlipped, flip, image }) {
  return (
    <ReactCardFlip
      containerStyle={{ height: "100%", width: "100%" }}
      isFlipped={isFlipped}
      flipDirection="horizontal"
    >
      <img className={styles.image} src={CareBears} onClick={flip} />

      <img className={styles.image} src={image} />
    </ReactCardFlip>
  )
}

export default App
