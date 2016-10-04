#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <dbus/dbus-glib.h>
#include "connman.h"

GMainLoop *mainloop;
DBusGConnection *connection;

void connman_print_properties(GHashTable *hash)
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

void connman_properties_callback(DBusGProxy *proxy,
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
        connman_print_properties(hash);

    g_object_unref(proxy);

    g_main_loop_quit(mainloop);
}

void connman_get_properties(const char *path, const char *interface)
{
    DBusGProxy *proxy;

    printf("Connman get properties\n");
    proxy = dbus_g_proxy_new_for_name(connection, "net.connman",
                            path, interface);

    if (dbus_g_proxy_begin_call_with_timeout(proxy, "GetProperties",
                    connman_properties_callback, NULL, NULL,
                    120 * 1000, G_TYPE_INVALID) == FALSE) {
        g_printerr("Method call for retrieving properties failed\n");
        g_object_unref(proxy);
        return;
    }
}

void connman_wifi_join_callback(DBusGProxy *proxy,
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
    }

    printf("Connman wifi join callback\n");

    g_object_unref(proxy);

    g_main_loop_quit(mainloop);
}

void connman_wifi_join()
{
    DBusGProxy *proxy;
    GError *error = NULL;

#if !GLIB_CHECK_VERSION(2,35,0)
    g_type_init();
#endif
    mainloop = g_main_loop_new(NULL, FALSE);

    printf("DBUS Connecting to system\n");
    connection = dbus_g_bus_get(DBUS_BUS_SYSTEM, &error);
    if (error != NULL) {
        g_printerr("%s\n", error->message);
        g_error_free(error);
    }

    printf("DBUS Connected.\n");

    proxy = dbus_g_proxy_new_for_name(connection, "net.connman",
                            "/", "net.connman.Device");

    if (dbus_g_proxy_begin_call_with_timeout(proxy, "JoinNetwork",
                    connman_wifi_join_callback, NULL, NULL,
                    120 * 1000, G_TYPE_INVALID) == FALSE) {
        g_printerr("Method call for retrieving properties failed\n");
        g_object_unref(proxy);
        return;
    }

    g_main_loop_run(mainloop);

    dbus_g_connection_unref(connection);

    g_main_loop_unref(mainloop);

    return;
}

void connman_connect()
{
    GError *error = NULL;

#if !GLIB_CHECK_VERSION(2,35,0)
    g_type_init();
#endif
    mainloop = g_main_loop_new(NULL, FALSE);

    printf("DBUS Connecting to system\n");
    connection = dbus_g_bus_get(DBUS_BUS_SYSTEM, &error);
    if (error != NULL) {
        g_printerr("%s\n", error->message);
        g_error_free(error);
    }

    printf("DBUS Connected.\n");
    connman_get_properties("/", "net.connman.Manager");

    g_main_loop_run(mainloop);

    // dbus_g_connection_unref(connection);

    // g_main_loop_unref(mainloop);

    return;
}

void connman_disconnect()
{
    dbus_g_connection_unref(connection);
    g_main_loop_quit(mainloop);
    g_main_loop_unref(mainloop);
    printf("DBUS Disconnected\n");
    
    return;
}
