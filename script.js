const PEEK_SIZE = '90px'

class Card {
  constructor(symbol, suit) {
    this.symbol = symbol
    this.suit = suit
    if (symbol === 'A') {
      this.value = 1
    } else if (symbol === 'K') {
      this.value = 13
    } else if (symbol === 'Q') {
      this.value = 12
    } else if (symbol === 'J') {
      this.value = 11
    } else {
      this.value = parseInt(symbol)
    }
    if (suit === '\u2764' || suit === '\u2666') {
      this.color = 'red'
    } else {
      this.color = 'black'
    }
    this.covered = true
  }
}
const suits = ['\u2764', '\u2666', '\u2663', '\u2660']
const symbols = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']

let deck = []

// Initialize deck
const fillDeck = () => {
  suits.forEach((suit) => {
    symbols.forEach((symbol) => {
      deck.push(new Card(symbol, suit))
    })
  })
}

// Stacks in JS
const mainSeven = [[], [], [], [], [], [], []]
const mainFour = [[], [], [], []]
let drawn = []

// Stacks in HTML
const deckHTML = document.querySelector('#deck')
const drawnHTML = document.querySelector('#drawn')
const mainSevenHTML = document.querySelectorAll('.main-stack')
const mainFourHTML = document.querySelectorAll('.main-four')
const stacks = document.querySelectorAll('.main')
const infoParagraph = document.querySelector('#info')

const showCard = (div, card) => {
  /*
  Displays the given card object on the given HTML div element
  */
  div.innerText = card.symbol + ' ' + card.suit
  div.style.color = card.color
  div.style.backgroundColor = 'white'
}

const resize = (htmlStack) => {
  if (htmlStack.children.length >= 1) {
    htmlStack.style.gridTemplateRows =
      (PEEK_SIZE + ' ').repeat(htmlStack.children.length - 1) + '1fr'
  }
  return htmlStack
}

const setUpGame = () => {
  mainSeven.forEach((array, index) => {
    for (let i = 0; i < index + 1; i++) {
      let newCard = deck.pop()
      array.push(newCard)
      if (i === index) {
        array[i].covered = false
      }
      const newCardDiv = document.createElement('div')
      newCardDiv.classList.add('card')
      newCardDiv.classList.add(index.toString())
      if (newCard.covered) {
        newCardDiv.classList.add('facedown')
      } else {
        showCard(newCardDiv, newCard)
        newCardDiv.classList.add('main-seven')
      }
      mainSevenHTML[index].appendChild(newCardDiv)
      resize(mainSevenHTML[index])
    }
  })
  deckHTML.classList.add('facedown')
}

const resetDeck = () => {
  deckHTML.classList.add('facedown')
  drawnHTML.innerText = ''
  drawnHTML.style.color = 'black'
  drawnHTML.style.backgroundColor = ''
  deck = drawn.reverse()
  drawn = []
}

const draw = () => {
  if (deck[deck.length - 1]) {
    newCard = deck.pop()
    drawn.push(newCard)
    drawnHTML.classList.add('card')
    drawnHTML.setAttribute('id', 'drawn')
    showCard(drawnHTML, newCard)
  } else {
    deckHTML.classList.remove('facedown')
  }
  resetTurn()
}

const resetTurn = () => {
  if (cardHTML !== 0) {
    cardHTML.classList.remove('glow')
  }
  movableCardsHTML = getAvailableHTMLCards()
  stacks.forEach((stack) => {
    stack.removeEventListener('click', myListenerStack)
  })
  movableCardsHTML.forEach((card) => {
    card.addEventListener('click', myListenerCard)
  })
}

deckHTML.addEventListener('click', () => {
  if (deck.length !== 0) {
    draw()
  } else {
    resetDeck()
  }
})

const getAvailableHTMLCards = () => {
  let cards = []
  mainSevenHTML.forEach((array) => {
    for (let i = 0; i < array.children.length; i++) {
      let available = true
      for (let j = 0; j < array.children[i].classList.length; j++) {
        if (array.children[i].classList[j] === 'facedown') {
          available = false
        }
      }
      if (available) {
        cards.push(array.children[i])
      }
    }
  })
  if (drawnHTML.innerText != '') {
    showCard(drawnHTML, drawn[drawn.length - 1])
    cards.push(drawnHTML)
  }
  for (let i = 0; i < 4; i++) {
    if (mainFourHTML[i].innerText != '') {
      cards.push(mainFourHTML[i])
    }
  }
  return cards
}

const getStack = (div) => {
  /*
  Takes in an HTML card and returns the stack index position for both the HTML stacks and the 
  javascript stacks
  */
  for (let i = 0; i < div.classList.length; i++) {
    if (!isNaN(parseInt(div.classList[i]))) {
      return parseInt(div.classList[i])
    }
  }
}

let cardMoving = []
let cardHTML = 0

const getCardMoving = (card) => {
  cardMoving = []
  if (card.id === 'drawn') {
    cardMoving.push(drawn[drawn.length - 1])
  } else if (isMainSeven(card)) {
    for (let i = 0; i < mainSeven[getStack(card)].length; i++) {
      for (let j = 0; j < card.innerText.length; j++) {
        if (mainSeven[getStack(card)][i].symbol === 10) {
          if (
            card.innerText.slice(j, j + 2) === '10' &&
            mainSeven[getStack(card)][i].color === card.style.color
          ) {
            for (let c = mainSeven[getStack(card)].length - 1; c >= i; c--) {
              // The card to compare is at the farthest index
              cardMoving.push(mainSeven[getStack(card)][c])
            }
          }
        } else {
          if (
            (mainSeven[getStack(card)][i].symbol === card.innerText[j] ||
              mainSeven[getStack(card)][i].symbol ===
                parseInt(card.innerText[j])) &&
            mainSeven[getStack(card)][i].color === card.style.color
          ) {
            for (let c = mainSeven[getStack(card)].length - 1; c >= i; c--) {
              // The card to compare is at the farthest index
              cardMoving.push(mainSeven[getStack(card)][c])
            }
          }
        }
      }
    }
  } else {
    cardMoving.push(
      mainFour[getStack(card)][mainFour[getStack(card)].length - 1]
    )
  }
  cardHTML = card
}

const isMainFour = (stack) => {
  for (let i = 0; i < stack.classList.length; i++) {
    if (stack.classList[i] === 'main-four') {
      return true
    }
  }
  return false
}

const isMainSeven = (stack) => {
  for (let i = 0; i < stack.classList.length; i++) {
    if (stack.classList[i] === 'main-seven') {
      return true
    }
  }
  return false
}

const addCardFromDrawnToMainFour = (stack) => {
  mainFour[parseInt(stack.id) - 1].push(drawn.pop())
  showCard(mainFourHTML[parseInt(stack.id) - 1], cardMoving[0])
  showCard(drawnHTML, drawn[drawn.length - 1])
  mainFourHTML[parseInt(stack.id) - 1].classList.add(
    (parseInt(stack.id) - 1).toString()
  )
  drawnHTML.setAttribute('id', 'drawn')
}

const addCardFromMainSevenToMainFour = (stack) => {
  mainFour[parseInt(stack.id) - 1].push(mainSeven[getStack(cardHTML)].pop())
  showCard(mainFourHTML[parseInt(stack.id) - 1], cardMoving[0])
  mainSevenHTML[getStack(cardHTML)].removeChild(
    mainSevenHTML[getStack(cardHTML)].lastChild
  )
  mainFourHTML[parseInt(stack.id) - 1].classList.add(
    (parseInt(stack.id) - 1).toString()
  )
}

const createNewDivForMainSeven = (stack) => {
  let newDiv = document.createElement('div')
  newDiv.innerHTML = cardHTML.innerHTML
  newDiv.style.backgroundColor = 'white'
  newDiv.style.color = cardHTML.style.color
  newDiv.classList = cardHTML.classList
  newDiv.classList.remove('glow')
  newDiv.classList.add('main-seven')
  stack.appendChild(newDiv)
  stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
}

//let switchOrder = false

const checkWin = () => {
  let total = 0
  for (let i = 0; i < 4; i++) {
    total += mainFour[i].length
  }
  if (total === 52) {
    console.log('win')
  }
}

let movableCardsHTML = getAvailableHTMLCards()

let counter = 0

const pickCard = (card) => {
  getCardMoving(card)
  cardHTML.classList.add('glow')
  movableCardsHTML.forEach((card) => {
    card.removeEventListener('click', myListenerCard)
  })
  stacks.forEach((stack) => {
    stack.addEventListener('click', myListenerStack)
  })
}

function myListenerCard(card) {
  pickCard(card.path[0])
}

const findEmptyStack = () => {
  for (let j = 0; j < stacks.length; j++) {
    for (let i = 0; i < stacks[j].classList.length; i++) {
      if (stacks[j].classList[i] === 'empty') {
        return stacks[j]
      }
    }
  }
}

const findRightMainFour = () => {
  if (cardHTML.innerText[0] === 'A') {
    for (let i = 0; i < 4; i++) {
      if (mainFourHTML[i].innerText === '') {
        return mainFourHTML[i]
      }
    }
    resetTurn()
  } else {
    for (let i = 0; i < 4; i++) {
      if (
        mainFourHTML[i].innerText[mainFourHTML[i].innerText.length - 1] ===
        cardHTML.innerText[cardHTML.innerText.length - 1]
      ) {
        return mainFourHTML[i]
      }
    }
    resetTurn()
  }
}

function myListenerStack(stack) {
  if (stack.path[1].id === 'main-seven') {
    let emptyStack = findEmptyStack()
    emptyStack.classList.remove('empty')
    placeCard(emptyStack)
  } else if (stack.path[1].id === 'main-four-container') {
    placeCard(findRightMainFour())
  } else {
    placeCard(stack.path[1])
  }
}

document.querySelector('button').addEventListener('click', () => {
  fillDeck()
  setUpGame()
  movableCardsHTML = getAvailableHTMLCards()
  movableCardsHTML.forEach((card) => {
    card.addEventListener('click', myListenerCard)
  })
})

const addIdsToMainFour = () => {
  for (let i = 1; i < 5; i++) {
    mainFourHTML[i - 1].setAttribute('id', i.toString())
  }
}

const placeCard = (stack) => {
  // Get card to where it is going
  if (isMainFour(stack)) {
    if (cardMoving.length === 1) {
      if (stack.hasChildNodes() === false) {
        if (cardMoving[0].symbol === 'A') {
          if (cardHTML.id === 'drawn') {
            // Moving card from drawn into mainFour
            addCardFromDrawnToMainFour(stack)
            checkWin()
            resetTurn()
          } else if (isMainSeven(cardHTML)) {
            // Moving card from mainSeven into mainFour
            addCardFromMainSevenToMainFour(stack)
            showCard(
              mainSevenHTML[getStack(cardHTML)].lastChild,
              mainSeven[getStack(cardHTML)][
                mainSeven[getStack(cardHTML)].length - 1
              ]
            )
            mainSevenHTML[getStack(cardHTML)].lastChild.classList.remove(
              'facedown'
            )
            mainSevenHTML[getStack(cardHTML)].lastChild.classList.add(
              'main-seven'
            )
            checkWin()
            resetTurn()
          } else {
            // Moving an ace from one mainFour stack to another
            mainFour[parseInt(stack.id) - 1].push(
              mainFour[getStack(cardHTML)].pop()
            )
            showCard(mainFourHTML[parseInt(stack.id) - 1], cardMoving[0])
            mainFourHTML[getStack(cardHTML)].innerText = ''
            mainFourHTML[getStack(cardHTML)].style.color = 'black'
            resetTurn()
          }
        }
      } else {
        // Moving cards other than an Ace into the mainFour
        if (
          cardMoving[0].suit ===
            mainFour[parseInt(stack.id) - 1][
              mainFour[parseInt(stack.id) - 1].length - 1
            ].suit &&
          cardMoving[0].value ===
            mainFour[parseInt(stack.id) - 1][
              mainFour[parseInt(stack.id) - 1].length - 1
            ].value +
              1
        ) {
          if (cardHTML.id === 'drawn') {
            // From the drawn pile
            addCardFromDrawnToMainFour(stack)
            checkWin()
            resetTurn()
          } else {
            // From the mainSeven
            addCardFromMainSevenToMainFour(stack)
            if (mainSeven[getStack(cardHTML)].length === 0) {
              mainSevenHTML[getStack(cardHTML)].classList.add('empty')
            } else {
              showCard(
                mainSevenHTML[getStack(cardHTML)].lastChild,
                mainSeven[getStack(cardHTML)][
                  mainSeven[getStack(cardHTML)].length - 1
                ]
              )
              mainSevenHTML[getStack(cardHTML)].lastChild.classList.remove(
                'facedown'
              )
              mainSevenHTML[getStack(cardHTML)].lastChild.classList.add(
                'main-seven'
              )
            }
            checkWin()
            resetTurn()
          }
        }
      }
    } else {
      // Error handling
      resetTurn()
    }
  } else {
    // Moving cards to the mainSeven
    if (
      (mainSeven[parseInt(stack.id) - 1].length === 0 &&
        cardMoving[cardMoving.length - 1].symbol === 'K') ||
      (mainSeven[parseInt(stack.id) - 1][
        mainSeven[parseInt(stack.id) - 1].length - 1
      ].color !== cardMoving[cardMoving.length - 1].color &&
        mainSeven[parseInt(stack.id) - 1][
          mainSeven[parseInt(stack.id) - 1].length - 1
        ].value ===
          cardMoving[cardMoving.length - 1].value + 1)
    ) {
      if (mainSeven[parseInt(stack.id) - 1].length === 0) {
        stack.style.borderStyle = 'none'
      }
      if (cardHTML.id === 'drawn') {
        // Add card from drawn to mainSeven
        mainSeven[parseInt(stack.id) - 1].push(drawn.pop())
        cardHTML.removeAttribute('id')
        createNewDivForMainSeven(stack)
        resize(stack)
        if (drawn.length !== 0) {
          showCard(drawnHTML, drawn[drawn.length - 1])
        } else {
          drawnHTML.innerText = ''
          drawnHTML.style.color = 'black'
          drawnHTML.style.backgroundColor = ''
        }
        drawnHTML.setAttribute('id', 'drawn')
        resetTurn()
      } else if (isMainSeven(cardHTML)) {
        //Move cards within the mainSeven stacks

        // Make changes in js arrays
        let cardsMoved = cardMoving.length
        for (let i = 0; i < cardsMoved; i++) {
          mainSeven[parseInt(stack.id) - 1].push(cardMoving.pop())
          mainSeven[getStack(cardHTML)].pop()
        }
        // Define variable that represents index of stack originally clicked
        let originalStackIndex = getStack(cardHTML)
        // Make changes in HTML
        for (let i = 0; i < cardsMoved; i++) {
          stack.appendChild(
            mainSevenHTML[originalStackIndex].children[
              mainSevenHTML[originalStackIndex].children.length - cardsMoved + i
            ]
          )
          stack.lastChild.classList.remove(originalStackIndex.toString())
          stack.lastChild.classList.add((parseInt(stack.id) - 1).toString())
        }
        resize(stack)

        // Shows next card in line of original list
        if (mainSeven[originalStackIndex].length !== 0) {
          showCard(
            mainSevenHTML[originalStackIndex].lastChild,
            mainSeven[originalStackIndex][
              mainSeven[originalStackIndex].length - 1
            ]
          )
          mainSevenHTML[originalStackIndex].lastChild.classList.toggle(
            'facedown'
          )
          mainSevenHTML[originalStackIndex].lastChild.classList.add(
            'main-seven'
          )
          resize(mainSevenHTML[originalStackIndex])
        } else {
          mainSevenHTML[originalStackIndex].classList.add('empty')
        }
        resetTurn()
      } else {
        // Moving card from mainFour to mainSeven
        mainSeven[parseInt(stack.id) - 1].push(
          mainFour[parseInt(cardHTML.id) - 1].pop()
        )
        cardHTML.classList.remove('main-four')
        cardHTML.classList.remove(getStack(cardHTML).toString())
        cardHTML.classList.remove('card-stack')
        cardHTML.classList.add('card')
        cardHTML.classList.remove('main')
        createNewDivForMainSeven(stack)
        resize(stack)
        if (mainFourHTML[parseInt(cardHTML.id) - 1].length !== 0) {
          showCard(
            mainFourHTML[parseInt(cardHTML.id) - 1],
            mainFour[parseInt(cardHTML.id) - 1][
              mainFour[parseInt(cardHTML.id) - 1].length - 1
            ]
          )
          console.log(cardHTML.id.toString())
          mainFourHTML[parseInt(cardHTML.id) - 1].classList.add('main-four')
          mainFourHTML[parseInt(cardHTML.id) - 1].classList.add('card-stack')
          mainFourHTML[parseInt(cardHTML.id) - 1].classList.add('main')
          mainFourHTML[parseInt(cardHTML.id) - 1].classList.remove('card')
        } else {
          mainFourHTML[parseInt(cardHTML.id) - 1].innerText = ''
          mainFourHTML[parseInt(cardHTML.id) - 1].color = 'black'
        }
        cardHTML.removeAttribute('id')
        addIdsToMainFour()
        resetTurn()
      }
    }
  }
}
