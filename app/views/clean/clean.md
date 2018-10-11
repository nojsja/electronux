### 包缓存路径
------------
[ubuntu]  
/var/cache/apt/archives

[manjaro]  
/var/cache/pacman/pkg

### 应用日志
-----------
[ubuntu]  
/var/log/

[manjaro]  
/var/log/

### 应用缓存
-----------
[ubuntu]  
~/.cache

[manjaro]  
~/.cache

### 垃圾桶
-----------
[ubuntu]  
~/.local/share/Trash/files

[manjaro]  
~/.local/share/Trash/files

### 系统清理命令
-----------
[ubuntu]  
sudo apt clean  
sudo apt autoclean  
sudo apt autoremove  

[manjaro]  
sudo pacman -R $(pacman -Qdtq)
