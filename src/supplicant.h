/*
 * supplicant.h
 *
 *  Created on: Nov 16, 2016
 *      Author: dgraham
 */

#ifndef SRC_SUPPLICANT_H_
#define SRC_SUPPLICANT_H_

#define WPAS_DBUS_SERVICE   "fi.w1.wpa_supplicant1"
#define WPAS_DBUS_INTERFACE "fi.w1.wpa_supplicant1"
#define WPAS_DBUS_PATH      "/fi/w1/wpa_supplicant1"

#define WPAS_DBUS_PATH_INTERFACES   WPAS_DBUS_PATH "/Interfaces/"
#define WPAS_DBUS_IFACE_INTERFACE   WPAS_DBUS_INTERFACE ".Interface"

#define WPAS_DBUS_NETWORKS_PART "Networks"
#define WPAS_DBUS_IFACE_NETWORK WPAS_DBUS_INTERFACE ".Network"

#define WPAS_DBUS_BSSIDS_PART   "BSSIDs"
#define WPAS_DBUS_IFACE_BSSID   WPAS_DBUS_INTERFACE ".BSSID"

void wpas_scan();

#endif /* SRC_SUPPLICANT_H_ */
