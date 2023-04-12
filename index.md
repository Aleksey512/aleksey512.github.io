### Содержание
1. [Быстрое начало (Windows)](#fast-windows)

---

## <a id="fast-windows"></a>🚀 Быстрое начало (Windows)


### **Забрать [репозиторий с Torchserve](https://github.com/Aleksey512/Torchserve)**

* С помощью командной строки

```shell
git clone https://github.com/Aleksey512/Torchserve.git

# Или если есть SSH ключ

git clone git@github.com:Aleksey512/Torchserve.git 
```
 
* С помощью IDE (На примере [PyCharm](https://www.jetbrains.com/ru-ru/pycharm/))
 
![Photo](img/screenIDE.png)

### **Установить [Docker](https://www.docker.com/)**

Для него понадобится установить wsl2
 
Для этого открывам PowerShell с правами администратора и выполняем команду

 ```shell
 wsl --install
```

Подробный процесс установки описан на сайте [Microsoft](https://docs.microsoft.com/ru-ru/windows/wsl/install-win10), там же указаны минимальные требования.

Далее устанавливаем сам **[Docker](https://www.docker.com/)**, следуя инструкции на сайте

### Предварительная подготовка

[Скачиваем](https://www.kaggle.com/datasets/boliu0/melanoma-winning-models) и помещаем нашу модель (***9c_b7ns_1e_640_ext_15ep.pth***)
в папку ***model_dir*** и переименовываем модель в ***model.pth***

### Запуск

1. Запускаем DockerDesktop ![DockerDesktop](img/DockerDesktop.png)
2. Запускаем PowerShell
3. Переходим в папку с проектом
    ```shell
    cd путь/до/папки/
    ```
4. Выполняем команду
    ```
    docker compose up --build   
   ```

---