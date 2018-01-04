var binding = require('./build/Release/binding');
var bs58 = require('bs58');

var prefixes = {
  mainnet: "bitcoincash",
  testnet: "bchtest",
  regtest: "bchreg"
};

var oldNetPrefixes = {
  mainnet: {
    0: "P2PKH",
    5: "P2SH"
  },
  testnet: {
    111: "P2PKH",
    196: "P2SH"
  }
};

var types = {
  P2PKH : 0,
  P2SH : 1
};

//utility function for bech32 conversion
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

//encodes ripemd160 hash to cashaddr format
function encodeCashAddr(prefix,typeString,hash){
  if(!types.hasOwnProperty(typeString)){
    return new Error('Invalid type:'+typeString);
  }

  if(hash.length !== 20){
    return new Error('Invalid hash length:'+hash.length);
  }

  if((prefix !== prefixes.mainnet) && (prefix !== prefixes.testnet) && (prefix !== prefixes.regtest)){
    return new Error('Invalid prefix:'+prefix);
  }

  let versionByte = (types[typeString] << 3) | (hash.length*8 - 160)/32;
  versionByte = (versionByte.toString(16).length%2 === 1)?'0'+versionByte.toString(16):versionByte.toString(16);
  let payload = new Buffer(versionByte + hash.toString('hex'),'hex');
  return binding.encode(prefix,convertBits(payload,8,5,true));
}

//decodes cashaddr string to ripemd160 hash,preifx and type
function decodeCashAddr(cashAddrString){
  let decoded = binding.decode(cashAddrString);
  decoded.payload = convertBits(decoded.payload,5,8,true)
  let ret = {};
  ret.prefix = decoded.prefix;
  ret.type = Object.keys(types)[Object.values(types).indexOf(((decoded.payload[0] & 0x70) >> 3))]
  let hashSize = (160 + (decoded.payload[0] &  0x07) * 32)/8;
  ret.hash = decoded.payload.slice(1,hashSize+1);
  return ret;
}

//converts old address format to new address format
function convertToBech32(address){
  let mainnet = new RegExp('^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$');
  let testnet = new RegExp('^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}$');
  if((!mainnet.test(address)) && (!testnet.test(address))){
    return new Error('Invalid address:',address);
  }

  let meta = {};
  if(mainnet.test(address)){
    meta.net = 'mainnet';
    meta.netPrefix = oldNetPrefixes['mainnet'];
  }

  if(testnet.test(address)){
    meta.net = 'testnet';
    meta.netPrefix = oldNetPrefixes['testnet'];
  }

  let decoded = bs58.decode(address);
  return encodeCashAddr(prefixes[meta.net],meta.netPrefix[decoded[0]],decoded.slice(1,21));
}

//converts from new Bech32 format to old format
function convertFromBech32(cashAddress){
  let decoded = decodeCashAddr(cashAddress);
  if(decoded.prefix === pres)
}


module.exports = {
  encodeCashAddr:encodeCashAddr,
  decodeCashAddr:decodeCashAddr,
  prefixes:prefixes,
  convertToBech32:convertToBech32,
  convertFromBech32:convertFromBech32,
  types:types
};
