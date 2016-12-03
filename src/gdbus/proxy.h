/*
 * proxy.h
 *
 *  Created on: Nov 17, 2016
 *      Author: dgraham
 */

#ifndef SRC_GDBUS_PROXY_H_
#define SRC_GDBUS_PROXY_H_

#define USE_CONNMAN 0
#define USE_NetworkManager 0

char *wpas_iface;
GDBusProxy *wpas_dbus_proxy;
GDBusProxy *nm_dbus_proxy;
GDBusProxy *connman_dbus_proxy;

void on_wpas_proxy_acquired (GDBusProxy *proxy, GAsyncResult *result, gpointer user_data);
void proxy_create_async(const char *service, const char *path, const char *interface, GAsyncReadyCallback callback);

void dbus_init();
void dbus_destroy();

#endif /* SRC_GDBUS_PROXY_H_ */
