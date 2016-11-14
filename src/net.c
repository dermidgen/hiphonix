
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <libgen.h>

#include "net.h"
#include "connman.h"
#include "config.h"
#include "ympd/src/json_encode.h"

const char * net_cmd_strs[] = {
    NET_CMDS(GEN_STR)
};

static inline enum net_cmd_ids get_cmd_id(char *cmd)
{
    for(int i = 0; i < sizeof(net_cmd_strs)/sizeof(net_cmd_strs[0]); i++)
        if(!strncmp(cmd, net_cmd_strs[i], strlen(net_cmd_strs[i])))
            return i;

    return -1;
}

int is_net_request(struct mg_connection *c)
{
    enum net_cmd_ids cmd_id = get_cmd_id(c->content);
    
    if (cmd_id == -1)
        return MG_FALSE;
    else
        return MG_TRUE;
}

char* cmd_exec(char *cmd)
{
    int MAX_LINE = 1024;
    char resbuf_cat[MAX_LINE];
    char response_charbuf[MAX_SIZE];
    FILE *fp;
   
    fp = popen(cmd, "r");

    if (fp == NULL) {
        strcat(response_charbuf, "Command Failed");
        return (char *)strdup(response_charbuf);
    }

    response_charbuf[0] = 0;
    while(fgets(resbuf_cat, MAX_LINE, fp) != NULL) {
        strcat(response_charbuf, resbuf_cat);
    }

    pclose(fp);

    response_charbuf[strlen(response_charbuf) - 1] = '\0';
    return (char *)strdup(response_charbuf);
}

// static void scan_callback(int result, GSupplicantInterface *interface, void *user_data)
// {
//     printf("Scan complete");
// }

// static DBusMessage *sendMethodCall(void)
// {
//     DBusPendingCall *pending;
//     DBusMessage *reply;
//     DBusMessage *methodcall = dbus_message_new_method_call(WPAS_DBUS_SERVICE, WPAS_DBUS_PATH, WPAS_DBUS_IFACE_INTERFACE, "ApScan");

//     if (!dbus_connection_send_with_reply(conn, methodcall, &pending, -1))//Send and expect reply using pending call object
//     {
//         printf("failed to send message!\n");
//     }
//     dbus_connection_flush(conn);
//     dbus_message_unref(methodcall);
//     methodcall = NULL;

//     dbus_pending_call_block(pending);//Now block on the pending call
//     reply = dbus_pending_call_steal_reply(pending);//Get the reply message from the queue
//     dbus_pending_call_unref(pending);//Free pending call handle
//     assert(reply != NULL);

//     if(dbus_message_get_type(reply) ==  DBUS_MESSAGE_TYPE_ERROR)    {
//         printf("Error : %s",dbus_message_get_error_name(reply));
//             dbus_message_unref(reply);
//             reply = NULL;
//     }

//     printf("Got dbus reply");
//     return reply;
//     // g_supplicant_interface_scan((GSupplicantInterface *)"fi.epitest.hostap.WPASupplicant", NULL, scan_callback, NULL);
// }

int callback_net(struct mg_connection *c)
{
    enum net_cmd_ids cmd_id = get_cmd_id(c->content);
    size_t n = 0;

    char wsres[MAX_SIZE];
    char *resbuf;

    // GSupplicantInterface *interface = g_supplicant_network_get_interface("wifi");

    if(cmd_id == -1)
        return MG_TRUE;

    switch(cmd_id)
    {
        case NET_EHLO:
            resbuf = (char *)cmd_exec("echo \\\"HelloWorld\\\"");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"ehlo\", \"data\": %s}", resbuf);
            break;
        case NET_SCAN:
            resbuf = (char *)cmd_exec("iw dev wlan0 scan ap-force > /dev/null && echo \\\"Scanned\\\"");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"scanned\", \"data\": %s}", resbuf);
            break;
        case NET_LIST:
            resbuf = (char *)cmd_exec("echo \"[`iw dev wlan0 scan ap-force | grep SSID | cut -d ' ' -f 2 | sed -e 's/\\(.*\\)/\"\\1\"/' | tr \"\n\" \",\" | sed 's/,$//'`]\"");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"networks\", \"data\": %s}", resbuf);
            break;
        case NET_CONNECT:
            resbuf = (char *)cmd_exec("echo \\\"Joining\\\"");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"connect\", \"data\": %s}", resbuf);
            // connman_connect();
            // connman_wifi_join();
            // connman_disconnect();
            break;
        case NET_DISCONNECT:
            resbuf = (char *)cmd_exec("connmanctl");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"disconnect\", \"data\": %s}", resbuf);
            break;
        case NET_RESET:
            resbuf = (char *)cmd_exec("connmanctl");
            n = snprintf(wsres, MAX_SIZE, "{\"type\":\"reset\", \"data\": %s}", resbuf);
            break;
    }

    // printf("resbuf %s\n", resbuf);

    // printf("wres %s\n", wsres);
    // printf("n %i\n", (int)n);
    mg_websocket_write(c, 1, wsres, n);

    free(resbuf);

    return MG_TRUE;
}
