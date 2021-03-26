function formatBrazilianDate(tmdbdate){
  let arrayDate = tmdbdate.split('-')
  let brazilian_date = ''
  if(arrayDate.length == 3)
    brazilian_date = arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0]
  return brazilian_date
}

export default formatBrazilianDate;