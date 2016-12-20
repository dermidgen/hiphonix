#include <gio/gio.h>

#include "gdbus/proxy.h"
#include "supplicant.h"

// Leaving this block as an example of sync calls
//static void wpas_scan_sync()
//{
//	GVariantBuilder builder;
//	GError *error = NULL;
//	GVariant *ret;
//
//	/* Scan params */
//	/* Use passive to scan while an interface is in use */
//	g_variant_builder_init(&builder, G_VARIANT_TYPE_VARDICT);
//	g_variant_builder_add(&builder, "{sv}", "Type", g_variant_new_string("passive"));
//
//	/* Call Scan D-Bus method */
//	ret = g_dbus_proxy_call_sync (wpas_dbus_proxy,
//	                              "Scan",
//	                              g_variant_new("(a{sv})", &builder),
//	                              G_DBUS_CALL_FLAGS_NONE, -1,
//	                              NULL, &error);
//	if (!ret) {
//		g_dbus_error_strip_remote_error (error);
//		g_print ("Scan failed: %s\n", error->message);
//		g_error_free (error);
//		return;
//	}
//}

// Stubs for getting interfaces in case we need to do this dynamically
// It seems that rpi2 always sets our wifi dongle as Interfaces/3
//static void wpas_get_interfaces()
//{
//
//}

static void scan_request_cb (GDBusProxy *proxy, GAsyncResult *result, gpointer user_data)
{
	GError *error = NULL;

	g_dbus_proxy_call_finish (proxy, result, &error);
	if (g_error_matches (error, G_IO_ERROR, G_IO_ERROR_CANCELLED))
		return;

	if (error) {
		g_print ("Scan failed: %s\n", error->message);
	}

	g_print("Scan Done\n");
}

static void wpas_scan_async()
{
	GVariantBuilder builder;
	GError *error = NULL;

	/* Scan params */
	/* Use passive to scan while an interface is in use */
	g_variant_builder_init(&builder, G_VARIANT_TYPE_VARDICT);
	g_variant_builder_add(&builder, "{sv}", "Type", g_variant_new_string("passive"));

	/* Call Scan D-Bus method */
	g_dbus_proxy_call (wpas_dbus_proxy,
	                   "Scan",
	                   g_variant_new("(a{sv})", &builder),
	                   G_DBUS_CALL_FLAGS_NONE,
					   -1,
					   NULL,
	                   (GAsyncReadyCallback) scan_request_cb,
					   &error);

}

void wpas_scan()
{
	wpas_scan_async();
}
