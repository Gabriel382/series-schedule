function formatSQLdate(prevDate){

  // Quebrando a data em várias partes
  var p = prevDate.toString().slice(4,15).split(' ');

  // var monthNumber = p[1] - 1;
  // var month = '';

  // // Formatando mês por extenso:
  // switch(monthNumber){
  //   case 1: 
  //     month = 'Jan';
  //     break;
  //   case 2:
  //     month = 'Fev';
  //     break;
  //   case 3:
  //     month = 'Mar';
  //     break;
  // }

  // Criando nova data com as partes coletas
  var date = p[1]+'/'+p[0]+'/'+p[2];

  return date;
}

export default formatSQLdate;