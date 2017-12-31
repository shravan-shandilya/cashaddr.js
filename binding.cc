#include <nan.h>
#include "cashaddr.h"

using v8::String;
using v8::Object;


void encode(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() < 2) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsString()) {
    Nan::ThrowTypeError("Prefix must be a string");
    return;
  }

  if (!info[1]->IsUint8Array()) {
    Nan::ThrowTypeError("Payload must be a Uint8Array");
    return;
  }

  String::Utf8Value prefixUtf8(info[0]->ToString());
  const std::string prefix = std::string(*prefixUtf8);

  uint32_t payloadLength = (uint32_t) node::Buffer::Length(info[1]->ToObject());
  uint8_t *rawPayload = (uint8_t*) node::Buffer::Data(info[1]->ToObject());
  const std::vector<uint8_t> payload(rawPayload,rawPayload+payloadLength);

  std::string encodedData = cashaddr::Encode(prefix,payload);
  info.GetReturnValue().Set(Nan::New(encodedData).ToLocalChecked());
}

void decode(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsString()) {
    Nan::ThrowTypeError("Encoded data must be a string");
    return;
  }

  String::Utf8Value encodedUtf8(info[0]->ToString());
  const std::string encoded = std::string(*encodedUtf8);

  std::pair<std::string, std::vector<uint8_t>> rawDecoded = cashaddr::Decode(encoded);

  v8::Local<v8::Object> decoded = Nan::New<v8::Object>();
  v8::Local<v8::String> prefix = Nan::New<v8::String>(rawDecoded.first).ToLocalChecked();
  v8::Local<v8::Object> payload = Nan::NewBuffer(reinterpret_cast<char*>(rawDecoded.second.data()),(uint32_t)rawDecoded.second.size()).ToLocalChecked();
  decoded->Set(Nan::New("prefix").ToLocalChecked(), prefix);
  decoded->Set(Nan::New("payload").ToLocalChecked(), payload);

  info.GetReturnValue().Set(decoded);
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("encode").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(encode)->GetFunction());
  exports->Set(Nan::New("decode").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(decode)->GetFunction());
}

NODE_MODULE(addon, Init)
