#!/bin/bash

# # 卸载指定的软件

# 所有需要取消安装的
all_install=()
all_available=(oh-my-zsh node atom whatever vscode chrome wechat peek deepin-capture deepin-terminal easeMusic QQ albert)
whoami="`whoami`"
release=`cat /etc/issue | awk -F ' ' '{print $1}'`

# -------- env install ---------- #

# 开始逐个取消安装
do_uninstall() {
  for (( i = 0; i < ${#all_install[@]}; i++ )); do
    u_${all_install[$i]};
  done
}

# -------- software install ---------- #

# 取消安装oh-my-zsh
u_oh-my-zsh() {
  echo ">>> uninstall on-my-zsh ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove zsh -y
  else
    sudo pacman -R --noconfirm zsh
  fi
  chsh -s /bin/bash
}

# 取消安装node环境
u_node() {
  echo ">>> uninstall node env ... "
  nvm uninstall v10
  rm "/home/$whoami/.nvm" -rf
}

# 取消安装atom编辑器
u_atom() {
  echo ">>> uninstall atom editor ..."
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove atom -y
  else
    sudo pacman -R --noconfirm atom
  fi
}

# whatever
u_whatever() {
  echo ">>> uninstall whatever ..."
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- whatever"
  else
    sudo pacman -R --noconfirm whatever
  fi
}

# 取消安装vscode编辑器
u_vscode() {
  echo ">>> uninstall vscode ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- vscode"
  else
    sudo pacman -R --noconfirm visual-studio-code-bin
  fi
}

# 取消安装chrome浏览器
u_chrome() {
  echo ">>> uninstall google-chrome ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove google-chrome-stable -y
  else
    sudo pacman -R --noconfirm google-chrome
  fi
}

# 取消安装微信
u_wechat() {
  echo ">>> uninstall wechat ..."
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- wechat"
  else
    yaourt -R --noconfirm electronic-wechat
  fi
}

# 取消安装Peek
u_peek() {
  echo ">>> uninstall peek ..."
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove peek -y
    sudo add-apt-repository -r ppa:peek-developers/stable -y
    sudo apt update
  else
    yaourt -R --noconfirm peek
  fi
}

# 取消安装深度截图
u_deepin-capture() {
  echo ">>> uninstall deepin-capture ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove deepin-screenshot -y
  else
    yaourt -R --noconfirm deepin-screenshot
  fi
}

# 取消安装深度终端
u_deepin-terminal() {
  echo ">>> uninstall deepin-terminal ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove deepin-terminal -y
  else
    yaourt -R --noconfirm deepin-terminal
  fi
}

# 取消安装ieaseMusic
u_easeMusic() {
  echo ">>> uninstall ieaseMusic ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- iease-music"
  else
    yaourt -R --noconfirm iease-music
  fi
}

# 取消安装QQ
u_QQ() {
  echo ">>> uninstall deepin-qq ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- QQ"
  else
    yaourt -R --noconfirm deepin.com.qq.im
  fi
}

# 取消安装albert
u_albert() {
  echo ">>> uninstall albert ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove albert -y
    sudo add-apt-repository -r ppa:noobslab/macbuntu -y
    sudo apt update
  else
    sudo pacman -R --noconfirm albert
  fi
}

# 取消安装stacer
u_stacer() {
  echo ">>> uninstall stacer ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt remove stacer -y
    sudo add-apt-repository -r ppa:oguzhaninan/stacer -y
    sudo apt update
  else
    yaourt -R --noconfirm stacer
  fi
}

# --------- MAIN -------- #
i=0
while [ -n "$1" ]; do
  inArray=$(echo "${all_available[@]}" | grep -wq "$1" && echo 'yes' || echo 'no')
  if [ "$inArray" == 'yes' ]; then
    all_install[$i]="$1"
    i=$[ $i + 1 ]
  fi
  shift
done

do_uninstall
