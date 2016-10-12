#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

#include "ympd/src/mongoose.h"
#include "ympd/src/mpd_client.h"

const char * ympd_cmd_strs[] = {
    MPD_CMDS(GEN_STR)
};

static inline enum mpd_cmd_ids get_cmd_id(char *cmd)
{
    for(int i = 0; i < sizeof(ympd_cmd_strs)/sizeof(ympd_cmd_strs[0]); i++)
        if(!strncmp(cmd, ympd_cmd_strs[i], strlen(ympd_cmd_strs[i])))
            return i;

    return -1;
}

int is_ympd_request(struct mg_connection *c)
{
    enum mpd_cmd_ids cmd_id = get_cmd_id(c->content);
    
    if (cmd_id == -1)
        return MG_FALSE;
    else
        return MG_TRUE;
}
