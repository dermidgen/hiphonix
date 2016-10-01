#ifndef __NET_CONNMAN_H__
#define __NET_CONNMAN_H__

#include <dbus/dbus-glib.h>

void print_properties(GHashTable *hash);
void properties_callback(DBusGProxy *proxy,
                DBusGProxyCall *call, void *user_data);
void get_properties(const char *path, const char *interface);

#endif
