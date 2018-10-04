#!/bin/bash

# # 检查安装项

all_installed='' # 已安装
all_uninstalled='' # 未安装
all_check=() # 所有检查项
all_available=(oh-my-zsh node atom vscode chrome wechat peek deepin-capture deepin-terminal easeMusic QQ albert) # 所有可获取

whoami="`whoami`"

# 开始逐个检查安装情况
do_check() {
  for item in "${all_check[@]}"; do
    c_"$item"
    if [ "$?" == "1" ]; then
      all_installed="$item $all_installed"
    else
      all_uninstalled="$item $all_uninstalled"
    fi
  done
  echo
  echo "installed: ${all_installed[@]}"
  echo "uninstalled: ${all_uninstalled[@]}"
}

# -------- software install ---------- #

# 安装oh-my-zsh
c_oh-my-zsh() {
  echo ">>> check on-my-zsh ... "
  local isInstalled=0
  if [ -n "`pacman -Qs zsh`" ]; then
    if [ -e "/home/$whoami/.oh-my-zsh" ]; then
      isInstalled=1
    fi
  fi

  return $isInstalled
}

# 安装node环境
c_node() {
  echo ">>> check node env ... "
  local isInstalled=0

  if [ -e "`which node`" ]; then
    isInstalled=1
  fi

  return $isInstalled
}

# 安装atom编辑器
c_atom() {
  echo ">>> check atom editor ..."
  local isInstalled=0

  if [ -e "`which atom`" ]; then
    isInstalled=1
  fi

  return $isInstalled
}

# 安装vscode编辑器
c_vscode() {
  echo ">>> check vscode ... "
  local isInstalled=0

  if [ -e "`which code`" ]; then
    isInstalled=1
  fi

  return $isInstalled
}

# 安装chrome浏览器
c_chrome() {
  echo ">>> check google-chrome ... "
  local isInstalled=0
  if [ -e "`which google-chrome`" -o -e "`which google-chrome-stable`" ]; then
    isInstalled=1
  fi

  return $isInstalled
}

# 安装微信``
c_wechat() {
  echo ">>> check wechat ..."
  local isInstalled=0

  if [ -e "`which electronic-wechat`" ]; then
    isInstalled=1
  fi

  return $isInstalled
}


# 安装Peek
c_peek() {
  echo ">>> check peek ..."
  local isInstalled=0
  if [ -n "`yaourt -Qs peek`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装深度截图
c_deepin-capture() {
  echo ">>> check deepin-capture ... "
  local isInstalled=0
  if [ -n "`yaourt -Qs deepin-screenshot`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装深度终端
c_deepin-terminal() {
  echo ">>> check deepin-terminal ... "
  local isInstalled=0
  if [ -n "`yaourt -Qs deepin-terminal`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装ieaseMusic
c_easeMusic() {
  echo ">>> check ieaseMusic ... "
  local isInstalled=0
  if [ -n "`yaourt -Qs iease-music`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装QQ
c_QQ() {
  echo ">>> check deepin-qq ... "
  local isInstalled=0
  if [ -n "`yaourt -Qs deepin.com.qq.im`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装albert
c_albert() {
  echo ">>> check albert ... "
  local isInstalled=0
  if [ -n "`pacman -Qs albert`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# 安装stacer
c_stacer() {
  echo ">>> check stacer ... "
  local isInstalled=0
  if [ -n "`yaourt -Qs stacer`" ]; then
      isInstalled=1
  fi

  return $isInstalled
}

# --------- MAIN -------- #
i=0
while [ -n "$1" ]; do
  inArray=$(echo "${all_available[@]}" | grep -wq "$1" && echo 'yes' || echo 'no')
  if [ "$inArray" == 'yes' ]; then
    all_check[$i]="$1"
    i=$[ $i + 1 ]
  fi
  shift
done

do_check
