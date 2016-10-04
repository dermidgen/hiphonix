#ifndef __NET_CONNMAN_H__
#define __NET_CONNMAN_H__

#include <dbus/dbus-glib.h>

void connman_print_properties(GHashTable *hash);
void connman_properties_callback(DBusGProxy *proxy,
                DBusGProxyCall *call, void *user_data);
void connman_get_properties(const char *path, const char *interface);
void connman_wifi_join();
void connman_connect();
void connman_disconnect();

#endif
