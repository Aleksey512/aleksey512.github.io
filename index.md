TorchServe - это фреймворк с открытым исходным кодом для сервинга PyTorch моделей. Для запуска простой модели достаточно реализовать функции пре-процессинга и пост-процессинга.

Детальнее про фреймворк можно почитать в [документации](https://pytorch.org/serve/)

### Содержание
1. [Быстрое начало (Windows)](#fast-windows)
2. [Архивируем модель](#archive-model)
   1. Как Torchserve видит модели
   2. handler (обработчик)
   3. Пишем свой обработчик
   4. Утилиа torch-model-archiver
3. [Docker](https://docker.com)

##

---

##

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

<a if="mymodel"></a>[Скачиваем](https://www.kaggle.com/datasets/boliu0/melanoma-winning-models) и помещаем нашу модель (***9c_b7ns_1e_640_ext_15ep.pth***)
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
   
### 😊 Поздравляю сервер запущен

Что бы посмотреть какие модели у нас есть, в строке браузера наберите:

```djangourlpath
http://localhost:8081/models
```
Примерный вывод:
```JSON
{
   "model_name": "model", 
   "model_url": "model.pth"
}
```

Для того что бы отправить данные в нашу модель, необходимо отправить POST запрос, и в body указать флаг **file** = photo.jpg по адрессу:
```djangourlpath
http://localhost:8080/predictions/ИМЯ_МОДЕЛИ
```

Примерный вывод:

```JSON
{
  "melanoma": 0.91493821144104,
  "nevus": 0.005232867784798145
}
```

Этот флаг, как и отправляемые, получаемые данные можно изменять в файле обработчика модели (***handler.py***)

##

---

##

## <a id="archive-model"></a> 🚀 Архивируем модель

### Как TorchServe видит модели

TorchServe требует от пользователя перевести модели в свой формат. Данный формат предстоваляет из себя архив вида *.mar. Внутри которого есть все для успешной работы модели. 

Для перевода модели в архив, есть утилита **torch-model-archiver**

Для конвертации нам нужно:

* Модель в формате TorchServe/Onnx/др.;

* Скрипт, описывающий пайплайн работы модели.

Такой скрипт называется handler. В нем определяются основные этапы жизненного цикла модели (инициализация, предобработка, предсказание, постобработка и др.). 

### Handler

Сам обработчик представляет собой *.py файл, с классом [обработчика](https://pytorch.org/serve/custom_service.html#custom-handler-with-class-level-entry-point).
Для типовых задач они уже [предопределены](https://pytorch.org/serve/#default-handlers).

Разберем из чего состоит файл handler для нашей [модели](#mymodel)


Импорты выглядят так:
```python
# Input/Output
import io

# Сам торч, логи, доступ к ОС
import torch
import logging
import os

# Pillow, torcvision для работы с изображением
from PIL import Image
from torchvision import transforms

# Класс обработчика
from ts.torch_handler.base_handler import BaseHandler

# Архитектура нашей модели
from model import enetv2
```

Класс обработчика как говорилось выше состоит из инициализации, предобработки, предсказания, постобработки и др.

Инициализация:
```python
class ModelHandler(BaseHandler):
    
    def initialize(self, context):
        """Класс инициализации
        Args:
            context (context): Это объект JSON, содержащий информацию 
            относящуюся к параметрам артефактов модели
        """

        properties = context.system_properties
        self.manifest = context.manifest # Загружаем модель

        logger.info(f'Properties: {properties}') 
        logger.info(f'Manifest: {self.manifest}')

        self.device = torch.device('cpu')
        
        model_file = self.manifest["model"].get("modelFile", "") # Читаем файл модели

        if model_file: # Если файл модели существует
            self.model = enetv2(enet_type, n_meta_features=0, out_dim=out_dim)
            self.model = self.model.to(self.device)
            state_dict = torch.load(model_file, map_location=self.device)
            state_dict = {k.replace('module.', ''): state_dict[k] for k in state_dict.keys()}
            self.model.load_state_dict(state_dict, strict=True)
            self.model.eval()
            logger.info(f'Successfully loaded model from {model_file}')
        else:
            raise RuntimeError('Missing the model file')

        self.initialized = True # Инициализируем модель
```

Предобработка данных:
```python
    def preprocess(self, requests):

        data = requests[0] # Забираем тело запроса

        photo = data['file'] # Ищем {"file" : данные}
        
        logger.info(f'Received photo') # Выводим логи
        
        # Обработка изображения
        my_transforms = transforms.Compose([transforms.Resize(640),
                                            transforms.CenterCrop(640),
                                            transforms.ToTensor(),
                                            transforms.Normalize(
                                                [0.485, 0.456, 0.406],
                                                [0.229, 0.224, 0.225])])
        image = Image.open(io.BytesIO(photo))
        
        return my_transforms(image) # Возвращаем обработанное изображение
```

Предсказание: 
```python
    def inference(self, inputs):
        outputs = self.model(inputs.unsqueeze(0).to(self.device)) # Скармливаем данные с preprocess модели
        probabilities = outputs.softmax(1) # Получаем предсказание
        mel_prob, nv_prob = probabilities.data[0][6], probabilities.data[0][7]
        logger.info('Predictions successfully created.')

        return mel_prob.item(), nv_prob.item() # Возвращаем предсказания
```

Постобработка:
```python
    def postprocess(self, outputs):
        predictions = {'melanoma': outputs[0], 'nevus': outputs[1]}
        logger.info(f'PREDICTED LABELS: {predictions}')

        return [predictions] # Возвращаем обработанное предсказание, для дальнейшей отправке пользователю в виде JSON
```