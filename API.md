# WebSocket API
The Hiphonix service is a lightweight embedded server for the Hiphonix Player Device. It provides a Mongoose WebSocket API for the Hiphonix Player Client to implement, allowing command & control over the following subsystems:

 * MPD via `libmpdclient`
 * Wifi
   - `iw` via `libnl`
   - `connman` via `DBUS`
 * System
   - Power
   - Configuration Reset/Restore
   - Update

This project is inspired by the very cool [ympd](http://github.com/notandy/ympd) project.

## Commands

### MPD (ympd compat)
 * MPD_API_GET_OUTPUTS
 * MPD_API_GET_BROWSE,(int) page,(string) path
    Usage: MPD_API_GET_BROWSE,0,/
 * MPD_API_SEARCH,(string) search
    Usage: MPD_API_SEARCH,radiohead
 * MPD_API_GET_QUEUE
 * MPD_API_SAVE_QUEUE
 * MPD_API_ADD_TRACK,(string) path
    Usage: MPD_API_ADD_TRACK,/
 * MPD_API_ADD_PLAY_TRACK
 * MPD_API_ADD_PLAYLIST
 * MPD_API_RM_TRACK
 * MPD_API_PLAY_TRACK
 * MPD_API_SET_PLAY
 * MPD_API_SET_PAUSE
 * MPD_API_SET_NEXT
 * MPD_API_SET_PREV
 * MPD_API_SET_SEEK,(int) trackId,(int) seekTime
    Usage: MPD_API_SET_SEEK,1,1
 * MPD_API_SET_VOLUME,(int) level
    Usage: MPD_API_SET_VOLUME,100
 * MPD_API_TOGGLE_RANDOM
 * MPD_API_TOGGLE_CONSUME
 * MPD_API_TOGGLE_SINGLE
 * MPD_API_TOGGLE_CROSSFADE
 * MPD_API_TOGGLE_REPEAT
 * MPD_API_TOGGLE_OUTPUT
 * MPD_API_SET_MPDHOST
 * MPD_API_SET_MPDPASS
 * MPD_API_UPDATE_DB

### Networking
 * NL_SCAN
 * NL_LIST
 * NL_JOIN
 * NL_DISCONNECT
 * NL_RESET

### System
 * SYS_RESTART
 * SYS_RESET
 * SYS_UPGRADE

## Events

### MPD (ympd compat)
 * status
   - { type: "status", data: "..." }
