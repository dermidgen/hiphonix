/* ympd
   (c) 2013-2014 Andrew Karpow <andy@ndyk.de>
   This project's homepage is: http://www.ympd.org
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; version 2 of the License.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc.,
   Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

   hiphonix
   (c) 2016 Hiphonix http://www.hiphonix.com
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#include "http_server.h"

#define BUFSIZE 128

int file_exists(const char* filename){
    struct stat buffer;
    int exist = stat(filename,&buffer);
    if(exist == 0)
        return 1;
    else // -1
        return 0;
}

void send_artwork(struct mg_connection *c)
{
  char command[256];
  char path[256];
  // char *cmd = "ffmpeg -i '/home/dgraham/Music/Pink Floyd - Another Brick in the Wall, III.mp3' -loglevel panic -f mjpeg pipe:1 | cat -";
  char buf[BUFSIZE];
  FILE *fp;

  // printf("Fetching artwork\n");
  snprintf(path, sizeof(path), "%s", c->uri + 8);
  snprintf(command, sizeof(command), "ffmpeg -i '%s' -loglevel panic -f mjpeg pipe:1 | cat -", (char * restrict)path);
  // printf("Path: %s\n", (const char * restrict)path);
  // printf("CMD: %s\n", (const char * restrict)command);

  // printf("Fetching album artwork\n");
  // printf("URI: %s",(const char * restrict)c->uri);
  // printf("\n");

  if (file_exists(path)) {
    if ((fp = popen(command, "r")) == NULL) {
        printf("Error opening pipe!\n");
    }

    if (fp) {
      mg_send_header(c, "Content-Type", "image/jpeg");
      
      while ((fread(buf, 1, sizeof(buf), fp)) > 0) {
        mg_send_data(c, buf, sizeof(buf));
      }

      mg_send_data(c,"\r\n",2);
      if(pclose(fp))  {
        printf("Command not found or exited with error status\n");
      }
    }
  } else {
    mg_send_status(c, 404);
    mg_printf_data(c, "Not Found");
  }

}

int callback_http(struct mg_connection *c)
{
  const struct embedded_file *req_file;

  // If it's root - or a real file find it
  // or handle routes for album art
  if(!strcmp(c->uri, "/"))
    req_file = find_embedded_file("/index.html");
  else
    req_file = find_embedded_file(c->uri);

  if(req_file)
  {
    // Return the embedded file
    mg_send_header(c, "Content-Type", req_file->mimetype);
    mg_send_data(c, req_file->data, req_file->size);

    return MG_TRUE;
  }
  else if (!strncmp(c->uri, "/artwork", strlen("/artwork")))
  {
    // Return an album art file
    send_artwork(c);

    return MG_TRUE;
  }
  else
  {
    // Default to hitting index.html

    // We let the client determine routes and the client
    // will 404 if the route is not available.
    // The client is a JavaScript (React) application "index.html"
    req_file = find_embedded_file("/index.html");
    mg_send_header(c, "Content-Type", req_file->mimetype);
    mg_send_data(c, req_file->data, req_file->size);

    return MG_TRUE;
  }

  // Unreachable
  mg_send_status(c, 404);
  mg_printf_data(c, "Not Found");
  return MG_TRUE;
}
