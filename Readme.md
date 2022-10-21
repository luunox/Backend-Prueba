<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD026 -->

# **Backend Prueba**

## Pasos para la ejecución

### 1. Tests en entorno local

#### &thinsp; 🪄 Ejecutar los siguientes comandos

* > $\textsf{\color{#0fc8c8}yarn \color{#c832c8}install}$</br>
    $\textsf{\color{#0fc8c8}yarn \color{#c832c8}tests}$

### 2. Para publicar en AWS

* Crear un usuario en `IAM`
* Seleccionar el tipo de acceso programático con llaves de acceso
* Darle los permisos necesarios para hacer el deploy a Lambda
* Una vez creado, copiar las claves de acceso `Access Key ID` y `Secret Access Key`
* Colocar las claves al archivo `.env` en las variables `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` respectivamente

#### &thinsp; 🪄 Ejecutar los siguientes comandos

* > $\textsf{\color{#0fc8c8}yarn \color{#c832c8}install}$</br>
    $\textsf{\color{#0fc8c8}yarn \color{#c832c8}deploy}$

## Click en la imagen te lleva al panel IAM

[![sparkles](src/images/AWS-IAM.gif "Ir al panel IAM de AWS")](https://console.aws.amazon.com/iamv2/home? )
