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

#include "http_server.h"

#define BUFSIZE 128
#define MAXSIZE 2048

struct artwork_file find_artwork_file()
{
  struct artwork_file p = {"cover.jpg", NULL, "image/jpeg", (size_t)0};
  char *cmd = "ffmpeg -i '/media/sda1/Johnny Paycheck/Johnny Paycheck - 11 Months And 29 Days.mp3' -loglevel panic -f mjpeg pipe:1 | cat -";
  char buf[BUFSIZE];
  unsigned char *response_buf = (unsigned char *) malloc(MAXSIZE);
  FILE *fp;
  // strcpy( p.name, "cover.jpg" );

  if ((fp = popen(cmd, "r")) == NULL) {
      printf("Error opening pipe!\n");
  }

  // response_buf[0] = 0;
  if (fp) {
    while (fread(buf, sizeof(unsigned char), BUFSIZE, fp)) {
      memcpy(response_buf + sizeof(response_buf), buf, BUFSIZE);
    }

    if(pclose(fp))  {
      printf("Command not found or exited with error status\n");
    }
  }

  p.data = response_buf;
  p.size = sizeof(response_buf);
  free(response_buf);
  return p;
}

int callback_http(struct mg_connection *c)
{
  const struct embedded_file *req_file;
  struct artwork_file art_file;

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
  else if (!strcmp(c->uri, "/artwork"))
  {
    art_file = find_artwork_file();
    // Return an album art file
    mg_send_header(c, "Content-Type", art_file.mimetype);
    mg_send_data(c, art_file.data, art_file.size);

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
