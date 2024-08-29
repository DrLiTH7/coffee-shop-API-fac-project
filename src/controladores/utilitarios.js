function validarCampos(objeto) {
  for (let propriedade in objeto) {
    if (objeto[propriedade] === null || objeto[propriedade] === undefined) {
      return false;
    }
  }
  return true;
}
function validarData(string) {
  var date = new Date(string);
  return date instanceof Date && !isNaN(date);
}
module.exports = {
  validarCampos,
  validarData,
};
