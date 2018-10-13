#!/bin/bash

# du命令获取所有待检查目录输出 #
du_dir() {
  sudo du -ah --max-depth=1 "$@"
}

# 格式化输出 # - 输出行之间的换行符号替换为'|'
stats_dir() {
  local stats=`du_dir "$@"`
  echo "$stats" | awk -F ' ' '{print $1$2}' | sed 's/\n/|/g' | sed ":label;N;s/\n/|/;b label"
}

stats_dir "$@"
