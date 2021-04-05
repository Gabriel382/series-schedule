function formatTMDBdate(prevDate){

  // Quebrando a data em várias partes
  if(prevDate)
  {
    var p = prevDate.toString().split('-');

  // var monthNumber = p[1];
  // var month = '';

  // Formatando mês por extenso:
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
  //   case 4:
  //     month = 'Abr';
  //     break;
  //   case 5:
  //     month = 'Mai';
  //     break;
  //   case 6:
  //     month = 'Jun';
  //     break;
  //   case 7:
  //     month = 'Jul';
  //     break;
  //   case 8:
  //     month = 'Ago';
  //     break;
  // }

  // Criando nova data com as partes coletas
  var date = p[2]+'/'+p[1]+'/'+p[0];

    return date;
  }
  else return '';
}


export default formatTMDBdate;