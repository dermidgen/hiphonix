/*
 * proxy.c
 *
 *  Created on: Nov 17, 2016
 *      Author: dgraham
 */

#include <gio/gio.h>
#include <NetworkManager.h>

#include "../supplicant.h"
#include "../connman.h"

GDBusProxy *wpas_dbus_proxy;
GDBusProxy *nm_dbus_proxy;
GDBusProxy *connman_dbus_proxy;

static void on_wpas_proxy_acquired (GDBusProxy *proxy, GAsyncResult *result, gpointer user_data)
{
	GError *error = NULL;

	wpas_dbus_proxy = g_dbus_proxy_new_for_bus_finish (result, &error);
	g_assert(wpas_dbus_proxy != NULL);

	g_print("WPA Suppplicant DBus Proxy Acquired\n");
}

static void proxy_create_async(const char *service, const char *path, const char *interface, GAsyncReadyCallback callback)
{
	GError *error = NULL;
	g_dbus_proxy_new_for_bus(G_BUS_TYPE_SYSTEM,
			                 G_DBUS_PROXY_FLAGS_NONE,
							 NULL,
							 service,
							 path,
							 interface,
							 NULL,
							 callback,
							 &error);
}

static GDBusProxy *proxy_create_sync(const char *service, const char *path, const char *interface)
{
	GDBusProxy *proxy;
	proxy = g_dbus_proxy_new_for_bus_sync(G_BUS_TYPE_SYSTEM,
                                          G_DBUS_PROXY_FLAGS_NONE,
                                          NULL,
			                              service,
			                              path,
			                              interface,
                                          NULL, NULL);
	g_assert(proxy != NULL);
	return proxy;
}

static void proxy_destroy(GDBusProxy *proxy)
{
	g_object_unref (proxy);
}

void dbus_init()
{
	// Setup
#if !GLIB_CHECK_VERSION (2, 35, 0)
	/* Initialize GType system */
	g_type_init ();
#endif

	proxy_create_async(
			           WPAS_DBUS_SERVICE,
                       WPAS_DBUS_PATH,
                       WPAS_DBUS_INTERFACE,
					   (GAsyncReadyCallback) on_wpas_proxy_acquired);

#if USE_NetworkManager > 0
	nm_dbus_proxy = proxy_create_sync(
                      NM_DBUS_SERVICE,
                      NM_DBUS_PATH,
                      NM_DBUS_INTERFACE);
#endif

#if USE_CONNMAN > 0
	connman_dbus_proxy = proxy_create_sync(
                      CONNMAN_DBUS_SERVICE,
					  CONNMAN_DBUS_PATH,
					  CONNMAN_DBUS_INTERFACE);
#endif
}

void dbus_destroy()
{
	proxy_destroy(wpas_dbus_proxy);
	proxy_destroy(nm_dbus_proxy);
	proxy_destroy(connman_dbus_proxy);
}
