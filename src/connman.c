#include <dbus/dbus-glib.h>
#include "connman.h"

GMainLoop *mainloop;
DBusGConnection *connection;

void print_properties(GHashTable *hash)
{
    GValue *value;

    value = g_hash_table_lookup(hash, "State");
    if (value != NULL)
        g_print("State: %s\n", g_value_get_string(value));

    value = g_hash_table_lookup(hash, "OfflineMode");
    if (value != NULL)
        g_print("OfflineMode: %d\n", g_value_get_boolean(value));

    value = g_hash_table_lookup(hash, "Technologies");
    if (value != NULL) {
        gchar **list = g_value_get_boxed(value);
        guint i;

        g_print("Technologies:");
        for (i = 0; i < g_strv_length(list); i++)
            g_print(" %s", *(list + i));
        g_print("\n");
    }
}

void properties_callback(DBusGProxy *proxy,
                DBusGProxyCall *call, void *user_data)
{
    GHashTable *hash;
    GError *error = NULL;

    dbus_g_proxy_end_call(proxy, call, &error,
                dbus_g_type_get_map("GHashTable",
                        G_TYPE_STRING, G_TYPE_VALUE),
                    &hash, G_TYPE_INVALID);

    if (error != NULL) {
        g_printerr("%s\n", error->message);
        g_error_free(error);
    } else
        print_properties(hash);

    g_object_unref(proxy);

    g_main_loop_quit(mainloop);
}

void get_properties(const char *path, const char *interface)
{
    DBusGProxy *proxy;

    proxy = dbus_g_proxy_new_for_name(connection, "net.connman",
                            path, interface);

    if (dbus_g_proxy_begin_call_with_timeout(proxy, "GetProperties",
                    properties_callback, NULL, NULL,
                    120 * 1000, G_TYPE_INVALID) == FALSE) {
        g_printerr("Method call for retrieving properties failed\n");
        g_object_unref(proxy);
        return;
    }
}
