#!/bin/bash

# targetDir=/home/nojsja/.config/autostart/
targetDir="$1"
allFiles=(`ls $targetDir`)
for file in ${allFiles[@]}; do
  echo -n "\"Comment_$file\"":"\"`sed -n '/^Name=/p' $targetDir/$file | awk -F '=' '{print $2}' | sed $'s/\"/\'/g' `\"",
  echo -n "\"Name_$file\"":"\"`sed -n '/^Name=/p' $targetDir/$file | awk -F '=' '{print $2}' | sed $'s/\"/\'/g'  `\"",
  echo -n "\"Exec_$file\"":"\"`sed -n '/^Exec=/p' $targetDir/$file | awk -F '=' '{print $2}' | sed $'s/\"/\'/g'  `\"",
  echo -n "\"Hidden_$file\"":"\"`sed -n '/^Hidden=/p' $targetDir/$file | awk -F '=' '{print $2}' | sed $'s/\"/\'/g' `\"",
done
