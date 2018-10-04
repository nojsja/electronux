#!/bin/bash

pacmanSource="/etc/pacman.conf"


# config
config() {
  # # 配置软件源
  echo ">>> import archlinuxcn source ... "
  sudo sed -i "/archlinuxcn/, /mirrors.ustc.edu.cn/d" $pacmanSource
  echo "[archlinuxcn]" >> $pacmanSource
  echo "SigLevel = Optional TrustedOnly" >> $pacmanSource
  echo 'Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch' >> $pacmanSource

  # # 导入GPG Key
  echo ">>> import GPG Key ... "
  sudo pacman -Syy
  sudo pacman -S archlinuxcn-keyring

}

# check
check() {
  local isConfigured=0

  [ -n "`sed '/archlinuxcn/p' $pacmanSource`" ] && isConfigured=1

  return $isConfigured
}

while [ -n "$1" ]; do
  case "$1" in
    --config )
      config
    ;;
    --check )
      check
      exit "$?"
    ;;
  esac
done
