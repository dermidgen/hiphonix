#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include <getopt.h>
#include <sys/time.h>
#include <pthread.h>

#include "config.h"
#include "ympd/src/mongoose.h"
#include "ympd/src/http_server.h"
#include "ympd/src/mpd_client.h"
#include "connman.h"
#include "net.h"

extern char *optarg;

int force_exit = 0;

void bye()
{
    force_exit = 1;
}

static int server_callback(struct mg_connection *c, enum mg_event ev) {
    switch(ev) {
        case MG_CLOSE:
            mpd_close_handler(c);
            return MG_TRUE;
        case MG_REQUEST:
            if (c->is_websocket) {
                c->content[c->content_len] = '\0';
                if(c->content_len && is_mpd_request(c)) {
                    return callback_mpd(c);
                } else if(c->content_len && is_net_request(c)) {
                    return callback_net(c);
                } else {
                    return MG_TRUE;
                }
            } else
#ifdef WITH_DYNAMIC_ASSETS
                return MG_FALSE;
#else
                return callback_http(c);
#endif
        case MG_AUTH:
            return MG_TRUE;
        default:
            return MG_FALSE;
    }
}

int main(int argc, char **argv)
{
    int n, option_index = 0;
    struct mg_server *server = mg_create_server(NULL, server_callback);
    unsigned int current_timer = 0, last_timer = 0;
    char *run_as_user = NULL;
    char const *error_msg = NULL;
    char *webport = "8080";

    atexit(bye);
#ifdef WITH_DYNAMIC_ASSETS
    mg_set_option(server, "document_root", SRC_PATH);
#endif

    mpd.port = 6600;
    strcpy(mpd.host, "127.0.0.1");

    static struct option long_options[] = {
        {"host",         required_argument, 0, 'h'},
        {"port",         required_argument, 0, 'p'},
        {"webport",      required_argument, 0, 'w'},
        {"user",         required_argument, 0, 'u'},
        {"version",      no_argument,       0, 'v'},
        {"help",         no_argument,       0,  0 },
        {0,              0,                 0,  0 }
    };

    while((n = getopt_long(argc, argv, "h:p:w:u:v",
                long_options, &option_index)) != -1) {
        switch (n) {
            case 'h':
                strncpy(mpd.host, optarg, sizeof(mpd.host));
                break;
            case 'p':
                mpd.port = atoi(optarg);
                break;
            case 'w':
                webport = strdup(optarg);
                break;
            case 'u':
                run_as_user = strdup(optarg);
                break;
            case 'v':
                fprintf(stdout, "hiphonix  %d.%d.%d\n"
                        "Copyright (C) 2016 Hiphonix\n"
                        "built " __DATE__ " "__TIME__ " ("__VERSION__")\n",
                        YMPD_VERSION_MAJOR, YMPD_VERSION_MINOR, YMPD_VERSION_PATCH);
                return EXIT_SUCCESS;
                break;
            default:
                fprintf(stderr, "Usage: %s [OPTION]...\n\n"
                        " -h, --host <host>\t\tconnect to mpd at host [localhost]\n"
                        " -p, --port <port>\t\tconnect to mpd at port [6600]\n"
                        " -w, --webport [ip:]<port>\tlisten interface/port for webserver [8080]\n"
                        " -u, --user <username>\t\tdrop priviliges to user after socket bind\n"
                        " -V, --version\t\t\tget version\n"
                        " --help\t\t\t\tthis help\n"
                        , argv[0]);
                return EXIT_FAILURE;
        }

        if(error_msg)
        {
            fprintf(stderr, "Mongoose error: %s\n", error_msg);
            return EXIT_FAILURE;
        }
    }

    error_msg = mg_set_option(server, "listening_port", webport);
    if(error_msg) {
        fprintf(stderr, "Mongoose error: %s\n", error_msg);
        return EXIT_FAILURE;
    }

    /* drop privilges at last to ensure proper port binding */
    if(run_as_user != NULL) {
        error_msg = mg_set_option(server, "run_as_user", run_as_user);
        free(run_as_user);
        if(error_msg)
        {
            fprintf(stderr, "Mongoose error: %s\n", error_msg);
            return EXIT_FAILURE;
        }
    }

    // connman_connect();

    while (!force_exit) {
        mg_poll_server(server, 200);
        current_timer = time(NULL);
        if(current_timer - last_timer)
        {
            last_timer = current_timer;
            mpd_poll(server);
        }
    }

    // connman_disconnect();
    mpd_disconnect();
    mg_destroy_server(&server);

    return EXIT_SUCCESS;
}