const handleDict = function(list=[],key='name'){
  let dict = {};
  list.forEach(el => {
    if (!dict.hasOwnProperty(el[key])) {
      dict[el[key]] = {};
    }
    dict[el[key]] = el;
  })
  return dict;
}

module.exports = {
  handleDict
}