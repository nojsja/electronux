#!/bin/bash

pacmanSource="/etc/apt/sources.list"

# # 配置国内软件源
config() {
  # 备份
  if [ ! -e /etc/apt/sources.list-bak ]; then
    echo ">> backup sources.list..."
    sudo cp $pacmanSource /etc/apt/sources.list-bak
  fi
  sudo rm /etc/apt/sources.list
  sudo echo '
    # for china users
    deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
    deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
    deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
  ' >> $pacmanSource
  sudo apt update;
  echo ">> done."
}

# check
check() {
  local isConfigured=1

  [ -n "`sed '/# for china users/p' -n $pacmanSource`" ] && isConfigured=0

  return $isConfigured
}

while [ -n "$1" ]; do
  case "$1" in
    --config )
      config
    ;;
    --check )
      check
      echo -n "$?"
    ;;
  esac
  shift
done
