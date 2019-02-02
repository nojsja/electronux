#!/bin/bash

# # 检查安装项 ------------ 多线程版本 - 目前应用数量级别下减少了 1.5s 左右的查询时间

export all_installed='' # 已安装
export all_uninstalled='' # 未安装
all_check=() # 所有检查项
all_available=(oh-my-zsh node atom vscode chrome whatever wechat peek deepin-capture deepin-terminal easeMusic QQ albert) # 所有可获取

whoami="`whoami`"
release=`cat /etc/issue | awk -F ' ' '{print $1}'`

# 开始逐个检查安装情况
do_check() {
  tmp_fifofile="/tmp/$$.fifo"
  mkfifo $tmp_fifofile      # 新建一个fifo类型的文件
  exec 6<>$tmp_fifofile      # 将fd6指向fifo类型
  rm $tmp_fifofile
  thread=${#all_check[@]} # 此处定义线程数

  for ((i=0;i<$thread;i++)); do
    echo
  done >&6

  for item in "${all_check[@]}"; do
    read -u6
    {
      c_"$item"
      echo >&6
    } &
  done
  wait
  exec 6>&- # 关闭df6

  # echo -n "${all_installed[@]} | ${all_uninstalled[@]}"
}

# -------- software install ---------- #

checkCode() {
  local isInstalled="$1"
  local item="$2"
  if [ "$isInstalled" -eq 1 ]; then
    echo -n \"$item\":\"true\",
  else
    echo -n \"$item\":\"false\",
  fi
}


# 安装oh-my-zsh
c_oh-my-zsh() {
  # echo ">>> check on-my-zsh ... "
  local isInstalled=0

  if [ -n "`which zsh`" ]; then
    if [ -e "/home/$whoami/.oh-my-zsh" ]; then
      isInstalled=1
    fi
  fi

  checkCode $isInstalled 'oh-my-zsh'

  return $isInstalled
}

# 安装node环境
c_node() {
  # echo ">>> check node env ... "
  local isInstalled=0

  if [ -e "`which node`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'node'

  return $isInstalled
}

# 安装atom编辑器
c_atom() {
  # echo ">>> check atom editor ..."
  local isInstalled=0

  if [ -e "`which atom`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'atom'

  return $isInstalled
}

# whatever
c_whatever() {
  # echo ">>> check whatever ..."
  local isInstalled=0

  if [ "$release" == "Ubuntu" ]; then
    if [ -n "`which whatever`" ]; then
      isInstalled=1
    fi
  elif [ -n "`yaourt -Qs whatever`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'whatever'

  return $isInstalled
}

# 安装vscode编辑器
c_vscode() {
  # echo ">>> check vscode ... "
  local isInstalled=0

  if [ -e "`which code`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'vscode'

  return $isInstalled
}

# 安装chrome浏览器
c_chrome() {
  # echo ">>> check google-chrome ... "
  local isInstalled=0
  if [ -e "`which google-chrome`" -o -e "`which google-chrome-stable`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'chrome'

  return $isInstalled
}

# 安装微信``
c_wechat() {
  # echo ">>> check wechat ..."
  local isInstalled=0

  if [ -e "`which electronic-wechat`" ]; then
    isInstalled=1
  fi

  checkCode $isInstalled 'wechat'

  return $isInstalled
}


# 安装Peek
c_peek() {
  # echo ">>> check peek ..."
  local isInstalled=0
  if [ -n "`which peek`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'peek'

  return $isInstalled
}

# 安装深度截图
c_deepin-capture() {
  # echo ">>> check deepin-capture ... "
  local isInstalled=0
  if [ -n "` which deepin-screenshot`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'deepin-capture'

  return $isInstalled
}

# 安装深度终端
c_deepin-terminal() {
  # echo ">>> check deepin-terminal ... "
  local isInstalled=0
  if [ -n "`which deepin-terminal`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'deepin-terminal'

  return $isInstalled
}

# 安装ieaseMusic
c_easeMusic() {
  # echo ">>> check ieaseMusic ... "
  local isInstalled=0
  if [ "$release" == "Ubuntu" ]; then
    isInstalled=0
  elif [ -n "`yaourt -Qs iease-music`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'easeMusic'

  return $isInstalled
}

# 安装QQ
c_QQ() {
  # echo ">>> check deepin-qq ... "
  local isInstalled=0
  if [ "$release" == "Ubuntu" ]; then
    isInstalled=0
  elif [ -n "`yaourt -Qs deepin.com.qq.im`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'QQ'

  return $isInstalled
}

# 安装albert
c_albert() {
  # echo ">>> check albert ... "
  local isInstalled=0
  if [ -n "`which albert`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'albert'

  return $isInstalled
}

# 安装stacer
c_stacer() {
  # echo ">>> check stacer ... "
  local isInstalled=0
  if [ -n "`which stacer`" ]; then
      isInstalled=1
  fi

  checkCode $isInstalled 'stacer'

  return $isInstalled
}

# --------- FUNC -------- #
inArray() {
  local target="$1"
  local inArray=$(echo "${all_available[@]}" | grep -wq "$target" && echo 1 || echo 0)

  return $inArray;
}

# --------- MAIN -------- #
i=0
while [ -n "$1" ]; do
  # inArray=$(echo "${all_available[@]}" | grep -wq "$1" && echo 'yes' || echo 'no')
  inArray "$1"
  if [ "$?" -eq 1 ]; then
    all_check[$i]="$1"
    i=$[ $i + 1 ]
  fi
  shift
done

do_check
