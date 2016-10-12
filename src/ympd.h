#ifndef __YMPD_H__
#define __YMPD_H__

#include "ympd/src/mongoose.h"
#include "ympd/src/mpd_client.h"

int is_ympd_request(struct mg_connection *c);
#endif
