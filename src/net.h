#define MAX_SIZE 1024 * 100

#define NET_CMDS(X) \
    X(NET_SCAN) \
    X(NET_LIST) \
    X(NET_CONNECT) \
    X(NET_DISCONNECT) \
    X(NET_RESET)

enum net_cmd_ids {
    NET_CMDS(GEN_ENUM)
};

enum net_conn_states {
    NET_DISCONNECTED,
    NET_FAILURE,
    NET_CONNECTED,
    NET_RECONNECT,
    NET_DISCONNECT
};
