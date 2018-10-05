#!/bin/bash

# # 安装软件环境

# 所有需要安装的
all_install=()
all_available=(oh-my-zsh node atom vscode chrome wechat peek deepin-capture deepin-terminal easeMusic QQ albert whatever)

# -------- env install ---------- #

# 安装初始化环境
init_install() {
  local all=(curl wget axel git aria2 gcc make patch)
  local allStr=''
  for item in "${all[@]}"; do
    if [ -z "`pacman -Qs $item`" ]; then
      allStr="$allStr $item"
    fi
  done
  if [ -n "$allStr" ]; then
    echo ">>> init env install ... "
    sudo pacman -S --noconfirm "$allStr"
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
  sudo pacman -S --noconfirm zsh
  sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
  chsh -s /bin/zsh
}

# 安装node环境
i_node() {
  echo ">>> install node env ... "
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
  nvm install v10
}

# 安装印象笔记
i_whatever() {
  echo ">>> install node env ... "
  yaourt -S --noconfirm whatever
}

# 安装atom编辑器
i_atom() {
  echo ">>> install atom editor ..."
  sudo pacman -S --noconfirm atom
}

# 安装vscode编辑器
i_vscode() {
  echo ">>> install vscode ... "
  sudo pacman -S --noconfirm code
}

# 安装chrome浏览器
i_chrome() {
  echo ">>> install google-chrome ... "
  sudo pacman -S --noconfirm google-chrome
}

# 安装微信
i_wechat() {
  echo ">>> install wechat ..."
  yaourt -S --noconfirm electronic-wechat
}

# 安装Peek
i_peek() {
  echo ">>> install peek ..."
  yaourt -S --noconfirm peek
}

# 安装深度截图
i_deepin-capture() {
  echo ">>> install deepin-capture ... "
  yaourt -S --noconfirm deepin-screenshot
}

# 安装深度终端
i_deepin-terminal() {
  echo ">>> install deepin-terminal ... "
  yaourt -S --noconfirm deepin-terminal
}

# 安装ieaseMusic
i_easeMusic() {
  echo ">>> install ieaseMusic ... "
  yaourt -S --noconfirm iease-music
}

# 安装QQ
i_QQ() {
  echo ">>> install deepin-qq ... "
  yaourt -S --noconfirm deepin.com.qq.im
}

# 安装albert
i_albert() {
  echo ">>> install albert ... "
  sudo pacman -S --noconfirm albert
}

# 安装stacer
i_stacer() {
  echo ">>> install stacer ... "
  yaourt -S --noconfirm stacer
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
