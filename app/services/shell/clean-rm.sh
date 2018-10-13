#!/bin/bash

# du命令获取所有待检查目录输出 #
rm_dir() {
  sudo /usr/bin/rm "$@" -rf
}

rm_dir "$@"
