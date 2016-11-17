#include <gio/gio.h>

#include "gdbus/proxy.h"
#include "supplicant.h"

void wpas_scan ()
{
	GVariantBuilder builder;
	GError *error = NULL;
	GVariant *ret;

	/* Scan params */
	/* Use passive to scan while an interface is in use */
	g_variant_builder_init(&builder, G_VARIANT_TYPE_VARDICT);
	g_variant_builder_add(&builder, "{sv}", "Type", g_variant_new_string("passive"));

	/* Call Scan D-Bus method */
	ret = g_dbus_proxy_call_sync (wpas_dbus_proxy,
	                              "Scan",
	                              g_variant_new("(a{sv})", &builder),
	                              G_DBUS_CALL_FLAGS_NONE, -1,
	                              NULL, &error);
	if (!ret) {
		g_dbus_error_strip_remote_error (error);
		g_print ("Scan failed: %s\n", error->message);
		g_error_free (error);
		return;
	}
}
