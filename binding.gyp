{
  "targets": [
    {
      "target_name": "binding",
      "sources": [ "src/binding.cc","src/cashaddr.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
