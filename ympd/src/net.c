
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <libgen.h>

#include "net.h"
#include "config.h"
#include "json_encode.h"

const char * net_cmd_strs[] = {
    NET_CMDS(GEN_STR)
};


static inline enum net_cmd_ids get_cmd_id(char *cmd)
{
    printf("Entering net_cmd_ids\n");
    for(int i = 0; i < sizeof(net_cmd_strs)/sizeof(net_cmd_strs[0]); i++)
        if(!strncmp(cmd, net_cmd_strs[i], strlen(net_cmd_strs[i])))
            return i;

    return -1;
}

int callback_net(struct mg_connection *c)
{
    printf("Entering callback_net\n");
    enum net_cmd_ids cmd_id = get_cmd_id(c->content);
    size_t n = 0;

    FILE *fp;
    char wsres[10000];
    char resbuf[10000];
    char resbuf_cat[10000];

    if(cmd_id == -1)
        return MG_TRUE;

    printf("Entering callback_net:cmd_switch %i\n", cmd_id);
    switch(cmd_id)
    {
        case NET_EHLO:
            printf("Calling hello world\n");
            fp = popen("echo \"Hello World\"", "r");
            break;
        case NET_SCAN:
            fp = popen("iw list", "r");
            // while() {
            //     fgets(resbuf, 1024, fp);
            // }
            break;
        case NET_LIST:
            fp = popen("iw list", "r");
            break;
        case NET_CONNECT:
            fp = popen("connman []", "r");
            break;
        case NET_DISCONNECT:
            fp = popen("connman []", "r");
            break;
        case NET_RESET:
            fp = popen("connman []", "r");
            break;
    }

    // if(fp == NULL) {
    //     resbuf = "Command Failed";
    // }

    resbuf[0] = 0;
    while(fgets(resbuf_cat, 1024, fp) != NULL) {
        strcat(resbuf,resbuf_cat);
    }

    printf("Response %s\n", resbuf);
    n = snprintf(wsres, MAX_SIZE, "{\"type\":\"net\", \"data\": \"%s\"}", resbuf);
    mg_websocket_write(c, 1, wsres, n);

    

    // /* close */
    pclose(fp);
    return MG_TRUE;
}
