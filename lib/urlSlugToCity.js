export default function urlSlugToCity(myCity) {
  //swap each hyphen for space
  myCity = myCity.replaceAll('-', ' ')
  //swap html encoding for space
  myCity = myCity.replaceAll('%20', ' ')
  //capitalise first letter of each word except if word is 'de'
  myCity = myCity.replace(/\b(?!de)\w/g, l => l.toUpperCase())
  return myCity
}
