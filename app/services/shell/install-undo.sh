#!/bin/bash

# # 卸载指定的软件

# 所有需要安装的
all_install=()
all_available=(oh-my-zsh node atom whatever vscode chrome wechat peek deepin-capture deepin-terminal easeMusic QQ albert)
whoami="`whoami`"

# -------- env install ---------- #

# 安装初始化环境
init_uninstall() {
  local all=(curl wget axel aria2 gcc make patch)
  local allStr=''
  for item in "${all[@]}"; do
    if [ -n "`pacman -Qs $item`" ]; then
      allStr="$allStr $item"
    fi
  done
  if [ -n "$allStr" ]; then
    echo ">>> init env uninstall ... "
    sudo pacman -R --noconfirm "$allStr"
  fi
}

# 开始逐个安装
do_uninstall() {
  init_install
  for (( i = 0; i < ${#all_install[@]}; i++ )); do
    u_${all_install[$i]};
  done
}

# -------- software install ---------- #

# 安装oh-my-zsh
u_oh-my-zsh() {
  echo ">>> uninstall on-my-zsh ... "
  sudo pacman -R --noconfirm zsh
  chsh -s /bin/bash
}

# 安装node环境
u_node() {
  echo ">>> uninstall node env ... "
  nvm uninstall v10
  rm "/home/$whoami/.nvm" -rf
}

# 安装atom编辑器
u_atom() {
  echo ">>> uninstall atom editor ..."
  sudo pacman -R --noconfirm atom
}

# whatever
u_whatever() {
  echo ">>> uninstall whatever ..."
  pacman -R --noconfirm whatever
}

# 安装vscode编辑器
u_vscode() {
  echo ">>> uninstall vscode ... "
  sudo pacman -R --noconfirm code
}

# 安装chrome浏览器
u_chrome() {
  echo ">>> uninstall google-chrome ... "
  sudo pacman -R --noconfirm google-chrome
  sudo pacman -R --noconfirm google-chrome-stable
}

# 安装微信
u_wechat() {
  echo ">>> uninstall wechat ..."
  yaourt -R --noconfirm electronic-wechat
}

# 安装Peek
u_peek() {
  echo ">>> uninstall peek ..."
  yaourt -R --noconfirm peek
}

# 安装深度截图
u_deepin-capture() {
  echo ">>> uninstall deepin-capture ... "
  yaourt -R --noconfirm deepin-screenshot
}

# 安装深度终端
u_deepin-terminal() {
  echo ">>> uninstall deepin-terminal ... "
  yaourt -R --noconfirm deepin-terminal
}

# 安装ieaseMusic
u_easeMusic() {
  echo ">>> uninstall ieaseMusic ... "
  yaourt -R --noconfirm iease-music
}

# 安装QQ
u_QQ() {
  echo ">>> uninstall deepin-qq ... "
  yaourt -R --noconfirm deepin.com.qq.im
}

# 安装albert
u_albert() {
  echo ">>> uninstall albert ... "
  sudo pacman -R --noconfirm albert
}

# 安装stacer
u_stacer() {
  echo ">>> uninstall stacer ... "
  yaourt -R --noconfirm stacer
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
