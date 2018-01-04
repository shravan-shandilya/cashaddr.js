// var temp = new Buffer('026cd2247e2b72e68084723825dbf3d570b80415fee37b51b069f316f955d169cc','hex');
// var binding = require('./build/Release/cashaddr');
//
// var addresses = [
//   '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
//   '1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR',
//   '16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb',
//   '3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC',
//   '3LDsS579y7sruadqu11beEJoTjdFiFCdX4',
//   '31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw'
// ];
//
// var encodings = [
//   'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
//   'bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy',
//   'bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r',
//   'bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq',
//   'bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e',
//   'bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37'
// ];
// for(let i=0;i<encodings.length;i++){
//   var decoded = binding.decode(encodings[i]);
//   console.log("encoded:"+encodings[i]);
//   console.log("decoded:"+decoded.payload.toString('hex'));
//   console.log("address:"+addresses[i]);
//   console.log("****************************************")
// }

var ca = require('.');

var hash = new Buffer([
  118, 160, 64,  83, 189,
  160, 168, 139, 218, 81,
  119, 184, 106, 21, 195,
  178, 159, 85,  152, 115
]);
console.log(hash);
let encoded = ca.encodeCashAddr(ca.prefixes.mainnet,'P2PKH',hash);
console.log(encoded);
let decoded = ca.decodeCashAddr(encoded);
console.log(decoded);

let mOld = '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu';
let mNew = 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a';
console.log('mOld:'+mOld);
console.log('mNew:'+mNew);
console.log('conv:'+(ca.convertToBech32(mOld)));

mOld = '3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC';
mNew = 'bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq';
console.log('mOld:'+mOld);
console.log('mNew:'+mNew);
console.log('conv:'+(ca.convertToBech32(mOld)));
