#!/bin/bash

dir=""
file=""

# 检查传参
check() {
  if [ -z "$dir" -o -z "$file" ]; then
    exit 1
  fi
  if [ ! -e "$dir/$file" ]; then
    exit 1
  fi
}

# 修改文件
setKV() {
  local k="$1"
  local v="$2"
  sed -i "/^$k=/d" $dir/$file
  echo "$k=$v" >> $dir/$file
}

while [ -n "$1" ]; do
  case "$1" in
    --dir | -d )
      dir="$2"
      shift
    ;;
    --file | -f )
      file="$2"
      shift
    ;;
    --key-value | -kv )
      check
      setKV "$2" "$3"
      shift
      shift
    ;;
  esac
  shift
done
