
function convertBits(data,fromBits,toBits,padding){
  let uintArr = new Array();

  data.forEach(function(value){
    uintArr.push(value);
  })

  let acc = 0;
  let bits = 0;
  let ret = new Array();
  let maxv = (1 << toBits) - 1;
  let maxAcc = (1 << (fromBits + toBits -1)) - 1;
  uintArr.forEach(function(value){
    acc = ((acc << fromBits) | value) & maxAcc;
    bits += fromBits;
    while(bits >= toBits){
      bits -= toBits;
      ret.push((acc>>bits)&maxv);
    }
  });

  if(padding){
    if(bits>0){
      ret.push((acc<<(toBits-bits))&maxv);
    }
  } else if( (bits >= fromBits) || (((acc<<(toBits-bits))&maxv) != 0)){
    return Error("encoding padding error");
  }
  return new Buffer(ret);
}

var data = new Buffer('0076a04053bda0a88bda5177b86a15c3b29f559873','hex');
var converted = convertBits(data,8,5,true);


console.log(data);
console.log(converted);
console.log(convertBits(converted,5,8,true));
// data.forEach(function(value){
//   console.log(value+',');
// })
//
// converted.forEach(function(value){
//   console.log(value+',');
// })
