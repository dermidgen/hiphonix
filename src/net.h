#ifndef __NET_H__
#define __NET_H__

#include "ympd/src/mongoose.h"

#define MAX_SIZE 1024 * 100

#define GEN_ENUM(X) X,
#define GEN_STR(X) #X,
#define NET_CMDS(X) \
    X(NET_EHLO) \
    X(NET_SCAN) \
    X(NET_LIST) \
    X(NET_CONNECT) \
    X(NET_DISCONNECT) \
    X(NET_RESET)

enum net_cmd_ids {
    NET_CMDS(GEN_ENUM)
};

enum net_conn_states {
    NET_DISCONNECTED,
    NET_FAILURE,
    NET_CONNECTED,
    NET_RECONNECT
};

int is_net_request(struct mg_connection *c);
int callback_net(struct mg_connection *c);

// DBusMessage *sendMethodCall(void);

#define WPAS_DBUS_SERVICE   "fi.epitest.hostap.WPASupplicant"
#define WPAS_DBUS_PATH      "/fi/w1/wpa_supplicant1/Interfaces/1"
#define WPAS_DBUS_INTERFACE "fi.w1.wpa_supplicant1.Interface"

#define WPAS_DBUS_PATH_INTERFACES   WPAS_DBUS_PATH "/Interfaces"
#define WPAS_DBUS_IFACE_INTERFACE   WPAS_DBUS_INTERFACE ".Interface"

#define WPAS_DBUS_NETWORKS_PART "Networks"
#define WPAS_DBUS_IFACE_NETWORK WPAS_DBUS_INTERFACE ".Network"

#define WPAS_DBUS_BSSIDS_PART   "BSSIDs"
#define WPAS_DBUS_IFACE_BSSID   WPAS_DBUS_INTERFACE ".BSSID"

#endif
