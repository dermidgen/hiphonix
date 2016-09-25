[![Build Status](https://travis-ci.org/dermidgen/hiphonix.svg)](https://travis-ci.org/dermidgen/hiphonix) 
Hiphonix
========
The hi-fi hub for audiophiles http://www.hiphonix.com

This project is based on the kickass [ypmd](http://www.ympd.org) project. Our project extends [ypmd](https://github.com/notandy/ympd) with a new UI, new features and device configuration for Linux.

**Note:** This project is intended only to run only on Hiphonix supported devices. Features & configuration beyond what is offered by `ympd` may not work on all systems. 

## Run flags
```
Usage: ./hiphonix [OPTION]...

 -h, --host <host>          connect to mpd at host [localhost]
 -p, --port <port>          connect to mpd at port [6600]
 -w, --webport [ip:]<port>  listen interface/port for webserver [8080]
 -u, --user <username>      drop priviliges to user after socket bind
 -V, --version              get version
 --help                     this help
```

For further options and run flags see: [ympd README](./ympd/README.md)

## WebSocket API
See [API.md](./API.md)

## Linux Build Instructions
See [BUILD.md](./BUILD.md)

## License & Copyright
GPLv3 - See [LICENSE](./LICENSE)
GPLv2 - See [ympd LICENSE](./ympd/LICENSE)

### Copyright

2016 Hiphonix

[ympd](http://www.ympd.org) Copyright 2013-2014 <andy@ndyk.de>
