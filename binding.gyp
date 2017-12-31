{
  "targets": [
    {
      "target_name": "cashaddr",
      "sources": [ "binding.cc","cashaddr.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
