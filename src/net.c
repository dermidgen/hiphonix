
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <libgen.h>

#include "net.h"
#include "config.h"
#include "json_encode.h"


static inline enum net_cmd_ids get_cmd_id(char *cmd)
{
    for(int i = 0; i < sizeof(net_cmd_strs)/sizeof(net_cmd_strs[0]); i++)
        if(!strncmp(cmd, net_cmd_strs[i], strlen(net_cmd_strs[i])))
            return i;

    return -1;
}

int callback_net(struct mg_connection *c)
{
    enum net_cmd_ids cmd_id = get_cmd_id(c->content);
    size_t n = 0;
    unsigned int uint_buf, uint_buf_2;
    int int_buf;
    char *p_charbuf = NULL, *token;

    FILE *fp;
    char *resbuf;

    if(cmd_id == -1)
        return MG_TRUE;

    switch(cmd_id)
    {
        case NET_EHLO:
            fp = popen("echo \"Hello World\"", "r");
            break;
        case NET_SCAN:
            fp = popen("iw list", "r");
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

    if(fp == NULL) {
        resbuf = "Command Failed";
    }


    /* Read the output a line at a time - output it. */
    while (fgets(resbuf, sizeof(resbuf), fp) != NULL) {
        // printf("%s", resbuf);
    }

    /* close */
    pclose(fp);    

    n = snprintf(resbuf, MAX_SIZE, "{\"type\":\"error\", \"data\": \"%s\"}");
    mg_websocket_write(c, 1, resbuf, n);

    return MG_TRUE;
}
