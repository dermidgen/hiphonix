# Project Structure
This project is composed of git subtree refs.

```
git remote add -f hiphonix-player git@github.com:dermidgen/hiphonix-player
git remote add -f ympd git@github.com:dermidgen/ympd
git subtree add --prefix hiphonix-player hiphonix-player master
git subtree add --prefix ympd ympd hiphonix
git fetch hiphonix-player master
git fetch ympd hiphonix
git subtree pull --prefix hiphonix-player hiphonix-player master
git subtree pull --prefix ympd ympd master
```
