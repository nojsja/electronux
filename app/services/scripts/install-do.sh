#!/bin/bash

# # 安装软件环境

# 所有需要安装的
all_install=()
all_available=(oh-my-zsh node atom vscode chrome wechat peek deepin-capture deepin-terminal easeMusic QQ albert whatever)
release=`cat /etc/issue | awk -F ' ' '{print $1}'`

# -------- env install ---------- #

install() {
  if [ "$release" == "Ubuntu" ]; then
    sudo apt install "$@" -y
  else
    sudo pacman -S --noconfirm "$@"
  fi
}

# 安装初始化环境
init_install() {
  local all=(curl wget axel git aria2 gcc make patch yaourt)
  local allStr=''
  for item in "${all[@]}"; do
    if [ -z "`which $item`" ]; then
      allStr="$allStr $item"
    fi
  done
  if [ -n "$allStr" ]; then
    echo ">>> init env install ... "
    install  "$allStr"
  fi
}

# 开始逐个安装
do_install() {
  init_install
  for (( i = 0; i < ${#all_install[@]}; i++ )); do
    i_${all_install[$i]};
  done
}

# -------- software install ---------- #

# 安装oh-my-zsh
i_oh-my-zsh() {
  echo ">>> install on-my-zsh ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt install zsh -y
  else
    sudo pacman -S --noconfirm zsh
  fi
  sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
  chsh -s /bin/zsh
}

# 安装node环境
i_node() {
  echo ">>> install node env ... "
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
  nvm install v12
  npm config set registry https://registry.npm.taobao.org
}

# 安装印象笔记
i_whatever() {
  echo ">>> install node env ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- whatever"
  else
    yaourt -S --noconfirm whatever
  fi
}

# 安装atom编辑器
i_atom() {
  echo ">>> install atom editor ..."
  if [ "$release" == "Ubuntu" ]; then
    sudo apt install atom -y
  else
    sudo pacman -S --noconfirm atom
  fi
}

# 安装vscode编辑器
i_vscode() {
  echo ">>> install vscode ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- vscode"
  else
    sudo pacman -S --noconfirm code
  fi
}

# 安装chrome浏览器
i_chrome() {
  echo ">>> install google-chrome ... "
  if [ "$release" == "Ubuntu" ]; then
     sudo apt install google-chrome-stable -y
  else
    sudo pacman -S --noconfirm google-chrome
  fi
}

# 安装微信
i_wechat() {
  echo ">>> install wechat ..."
  if [ "$release" == "Ubuntu" ]; then
     echo "Ubuntu -- wechat"
  else
    yaourt -S --noconfirm electronic-wechat
  fi
}

# 安装Peek
i_peek() {
  echo ">>> install peek ..."
  if [ "$release" == "Ubuntu" ]; then
    sudo add-apt-repository -r ppa:peek-developers/stable -y
    sudo add-apt-repository ppa:peek-developers/stable -y
    sudo apt update
    sudo apt install peek -y
  else
    yaourt -S --noconfirm peek
  fi
}

# 安装深度截图
i_deepin-capture() {
  echo ">>> install deepin-capture ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo apt install deepin-screenshot -y
  else
    yaourt -S --noconfirm deepin-screenshot
  fi
}

# 安装深度终端
i_deepin-terminal() {
  echo ">>> install deepin-terminal ... "
    if [ "$release" == "Ubuntu" ]; then
      sudo apt install deepin-terminal -y
    else
      yaourt -S --noconfirm deepin-terminal
    fi
}

# 安装ieaseMusic
i_easeMusic() {
  echo ">>> install ieaseMusic ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- iease-music"
  else
    yaourt -S --noconfirm iease-music
  fi
}

# 安装QQ
i_QQ() {
  echo ">>> install deepin-qq ... "
  if [ "$release" == "Ubuntu" ]; then
    echo "Ubuntu -- QQ"
  else
    yaourt -S --noconfirm deepin.com.qq.im
  fi
}

# 安装albert
i_albert() {
  echo ">>> install albert ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo add-apt-repository -r ppa:noobslab/macbuntu -y
    sudo add-apt-repository ppa:noobslab/macbuntu -y
    sudo apt update
    sudo apt install albert -y
  else
    sudo pacman -S --noconfirm albert
  fi
}

# 安装stacer
i_stacer() {
  echo ">>> install stacer ... "
  if [ "$release" == "Ubuntu" ]; then
    sudo add-apt-repository -r ppa:oguzhaninan/stacer -y
    sudo add-apt-repository ppa:oguzhaninan/stacer -y
    sudo apt update
    sudo apt install stacer -y
  else
    yaourt -S --noconfirm stacer
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

do_install
