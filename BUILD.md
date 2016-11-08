# Linux Build Instructions
Builds are intended for linux systems with device support for wireless
configuration via `connman` & `iw list`. While these are not build dependencies
they are expected to be available on the target system. Furthermore, there is
a runtime dependency on a properly configured and running `MPD` server.

See also the [ympd README](./ympd/README)

## Dependencies
 - libssl-dev
 - glibc-source
 - libdbus-glib-1-dev
 - libglib2.0-dev
 - libmpdclient 2: http://www.musicpd.org/libs/libmpdclient/
 - cmake 2.6: http://cmake.org/

## Builds
1. create build directory ```mkdir build; cd build```
2. create makefile ```cmake ..  -DCMAKE_INSTALL_PREFIX:PATH=/usr```
3. build ```make```
4. install ```sudo make install``` or just run with ```./hiphonix```
