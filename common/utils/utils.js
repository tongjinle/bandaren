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

const handleChangeDict = function (dict={},key='name'){
  console.log(dict);
  if (!dict.hasOwnProperty(key)){
    console.log(123);
    dict[key] = {
      userId: key,
      count:1
    }
  }else{
    let curCount = dict[key].count;
    dict[key].count = curCount + 1;
    console.log(dict);
  }
  return dict 
}

module.exports = {
  handleDict,
  handleChangeDict
}