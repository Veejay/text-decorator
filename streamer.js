const colors = require('colors/safe')
class TextTokenizer {
  constructor(text) {
    this._text = text
  }

  tokenize() {
    return this._text.split(/(\s{3})/)
  }
}

let sample = `Par un jugement nos 0916248, 0916250, 0916251/2-2 du 9 mai 2011, le Tribunal administratif de Paris, après avoir prononcé un non-lieu à statuer à concurrence des sommes, respectivement, de2 134 euros, 2 856 euros et 1 544 euros, en ce qui concerne les suppléments d’impôt sur le revenu auxquels M. D… a été assujetti au titre des années 2004, 2005 et 2006, a rejeté ses demandes.










Par une requête et un mémoire complémentaire, enregistrés les 11 juillet 2011 et 
3 octobre 

2013, M. D… a demandé à la Cour : 
1°) 

d’annuler 







le jugement nos 0916248, 0916250, 0916251/2-2 en date du 9 mai 2011 par lequel le Tribunal administratif de Paris a rejeté ses demandes tendant à la décharge des cotisations supplémentaires à l’impôt sur le revenu auxquelles il a été assujetti au titre des années 2004, 2005 et 2006 et des pénalités dont ces cotisations ont été assorties ;

2°) de prononcer cette décharge ;

3°) de mettre une somme de 3 000 euros à la charge de l’Etat au titre de l’article L. 761-1 du code de justice administrative.

Par un arrêt du 24 octobre 2013, la Cour administrative d’appel de Paris a rejeté la requête de M. D….

Par un pourvoi sommaire et un mémoire complémentaire, enregistrés les
18 décembre 2013 et 18 mars 2014 au secrétariat du contentieux du Conseil d’Etat, M. D… a demandé au Conseil d’Etat :

1°) d’annuler l’arrêt n° 11PA03133 du 24 octobre 2013 de la Cour administrative d’appel de Paris`
let startFrom = 0
const occurrences = new Map()
const { Readable } = require('stream')
const stream = new Readable()
let i = 0
stream._read = (size) => {
  console.log(`
    ===== START =======
    ${sample}
    =====  END  =======
  `)
  const match = /^([^\s]+)(\s+)/.exec(sample)
  if (Object.is(match, null)) {
    stream.push(sample)
    stream.push(null)
  } else {
    const { 0: completeMatch, 1: text, 2: space } = match
    let numberOfOccurrences = occurrences.get(text) || 0
    occurrences.set(text, ++numberOfOccurrences)
    
    sample = sample.slice(match[0].length)
    stream.push(match[0])
  }
}

stream.on('end', event => {
  console.log(occurrences)
})
stream.pipe(process.stdout)
