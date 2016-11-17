#include <gio/gio.h>
#include <NetworkManager.h>

#include "supplicant.h"

GDBusProxy *proxy;

void wpas_scan ()
{
	int i;
	GVariantBuilder builder;
	GError *error = NULL;
	GVariant *ret;
	char **paths;

	/* Scan params */
	/* Use passive to scan while an interface is in use */
	g_variant_builder_init(&builder, G_VARIANT_TYPE_VARDICT);
	g_variant_builder_add(&builder, "{sv}", "Type", g_variant_new_string("passive"));

	/* Call Scan D-Bus method */
	ret = g_dbus_proxy_call_sync (proxy,
	                              "Scan",
	                              g_variant_new("(a{sv})", &builder),
	                              G_DBUS_CALL_FLAGS_NONE, -1,
	                              NULL, &error);
	if (!ret) {
		g_dbus_error_strip_remote_error (error);
		g_print ("ListConnections failed: %s\n", error->message);
		g_error_free (error);
		return;
	}
}



void wpas_dbus_setup ()
{
	// Setup
#if !GLIB_CHECK_VERSION (2, 35, 0)
	/* Initialize GType system */
	g_type_init ();
#endif

	/* Create a D-Bus proxy; NM_DBUS_* defined in nm-dbus-interface.h */
	proxy = g_dbus_proxy_new_for_bus_sync (G_BUS_TYPE_SYSTEM,
	                                       G_DBUS_PROXY_FLAGS_NONE,
	                                       NULL,
										   WPAS_DBUS_SERVICE,
										   WPAS_DBUS_PATH,
										   WPAS_DBUS_INTERFACE,
	                                       NULL, NULL);
	g_assert (proxy != NULL);
}

void wpas_dbus_destroy ()
{
	g_object_unref (proxy);
}
