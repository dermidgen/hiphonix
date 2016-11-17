
diskutil list
# note card's /dev/disk#

curl -O https://github.com/dermidgen/hiphonix-dev/releases/download/v1.2.1/hiphonix-v1.2.1.zip

sudo dd bs=1m if=hiphonix-v1.2.1.img of=/dev/rdisk1
