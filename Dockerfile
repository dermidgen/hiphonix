FROM ubuntu:14.04

# Install.
RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential && \
  apt-get install -y software-properties-common && \
  apt-get install -y byobu curl git htop man unzip vim wget && \
  apt-get install -y mpd && \
  apt-get install -y cmake libmpdclient-dev && \
  rm -rf /var/lib/apt/lists/*

# Add files.
# ADD root/.scripts /root/.scripts

# Set environment variables.
# ENV HOME /root

# Define working directory.
# WORKDIR /root

# Define default command.
# CMD ["bash"]
