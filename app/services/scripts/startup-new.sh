#!/bin/bash

# targetDir=/home/nojsja/.config/autostart/

targetDir=""
name=""
comment=""
exec=""
hidden="false"

while [ -n "$1" ]; do
  case "$1" in
    --dir | -d )
      targetDir="$2"
      shift
    ;;
    --name | -n )
      name="$2"
      shift
    ;;
    --comment | -c )
      comment="$2"
      shift
    ;;
    --exec | -e )
      exec="$2"
      shift
    ;;
  esac
  shift;
done

if [ -z "$targetDir" -o -z "$name" -o -z "$exec" ]; then
  exit 1
fi

touch $targetDir/"$name.desktop"

sed -i "/^Name=/d" $targetDir/"$name.desktop"
sed -i "/^Comment=/d" $targetDir/"$name.desktop"
sed -i "/^Exec=/d" $targetDir/"$name.desktop"
sed -i "/^Hidden=/d" $targetDir/"$name.desktop"

echo "Name=$name" >> $targetDir/"$name.desktop"
echo "Comment=$comment" >> $targetDir/"$name.desktop"
echo "Exec=$exec" >> $targetDir/"$name.desktop"
echo "Hidden=$hidden" >> $targetDir/"$name.desktop"

exit 0
