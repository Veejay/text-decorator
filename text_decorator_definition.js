class Marker {
  constructor(word, occurrence) {
    this._word = word
    this._occurrence = occurrence
  }

  get word() {
    return this._word
  }

  get occurrence() {
    return this._occurrence
  }
}

class TextDecoratorDefinition {
  constructor(start_marker, end_marker) {
    this._start_marker = start_marker
    this._end_marker = end_marker
  }

  get start_word() {
    return this._start_marker.word
  }
  get start_word_occurrence() {
    return this._start_marker.occurrence
  }
  get end_word() {
    return this._end_marker.word
  }
  get end_word_occurrence() {
    return this._end_marker.occurrence
  }
}

const sample = `
Par un 
jugement nos 0916248, 0916250, 0916251/2-2 du 9 mai 2011, le Tribunal administratif de Paris, après avoir prononcé un non-lieu à statuer à concurrence des sommes, respectivement, de2 134 euros, 2 856 euros et 1 544 euros, en ce qui concerne les suppléments d’impôt sur le revenu auxquels M. D… a été assujetti au titre des années 2004, 2005 et 2006, a rejeté ses demandes.

Par une requête et un mémoire complémentaire, enregistrés les 11 juillet 2011 et 
3 octobre 2013, M. D… a demandé à la Cour : 
1°) d’annuler le jugement nos 0916248, 0916250, 0916251/2-2 en date du 9 mai 2011 par lequel le Tribunal administratif de Paris a rejeté ses demandes tendant à la décharge des cotisations supplémentaires à l’impôt sur le revenu auxquelles il a été assujetti au titre des années 2004, 2005 et 2006 et des pénalités dont ces cotisations ont été assorties ;

2°) de prononcer cette décharge ;

3°) de mettre une somme de 3 000 euros à la charge de l’Etat au titre de l’article L. 761-1 du code de justice administrative.

Par un arrêt du 24 octobre 2013, la Cour administrative d’appel de Paris a rejeté la requête de M. D….

Par un pourvoi sommaire et un mémoire complémentaire, enregistrés les
18 décembre 2013 et 18 mars 2014 au secrétariat du contentieux du Conseil d’Etat, M. D… a demandé au Conseil d’Etat :

1°) d’annuler l’arrêt n° 11PA03133 du 24 octobre 2013 de la Cour administrative d’appel de Paris ;
`

const INDEXOF_NOT_FOUND = -1

class TextScanner {
  constructor(text) {
    this._text = text
  }

  occurrences(word, fromIndex = 0) {
    const occurrence = this._text.indexOf(word, fromIndex)
    if (Object.is(occurrence, INDEXOF_NOT_FOUND)) {
      return []
    } else {
      fromIndex = occurrence + word.length
      return [occurrence, ...this.occurrences(word, fromIndex)]
    }
  }
}

const WORD_SEPARATOR = ' '

class TextDecorator {
  constructor(text) {
    this._tokens = text.split(WORD_SEPARATOR)
  }

  decorate(decorator_definitions) {
    return decorator_definitions.reduce((memo, defintion) => {
      // SAUCE
    }, this._tokens).join(WORD_SEPARATOR)
  }
}

const scanner = new TextScanner(sample)
const occurrences = scanner.occurrences('Par')
for (let occurrence of occurrences) {
  console.log(sample.slice(occurrence, occurrence + 3))
}

const decorateText = (text, decoratorDefinition) => {
  // NOTE: has to be -1 if the occurrence index is 0-based
  let startWordOccurrence = 0
  let endWordOccurrence = 0
  return text.replace(new RegExp(decoratorDefinition.start_word, 'g'), match => {
    startWordOccurrence++
    const rightOccurrence = Object.is(startWordOccurrence, decoratorDefinition.start_word_occurrence)
    return rightOccurrence
      ? `<a href="https://www.doctrine.fr">${match}`
      : match

  }).replace(new RegExp(decoratorDefinition.end_word, 'g'), match => {
    endWordOccurrence++
    const rightOccurrence = Object.is(endWordOccurrence, decoratorDefinition.end_word_occurrence)
    return rightOccurrence
      ? `${match}</a>`
      : match
  });
}

// NOTE
const startMarker = new Marker('Par', 1)
const endMarker = new Marker('2011', 1)
const decoratorDefinition = new TextDecoratorDefinition(startMarker, endMarker)
const text = decorateText(sample, decoratorDefinition)
console.log(text)
