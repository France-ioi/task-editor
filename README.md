# task-editor
A visual editor to create tasks of all kinds


## Install

Copy the config file ``.env.example`` :

```sh
cp .env.example .env
```

and update it as needed. For the variables ``BLOCKLY_API_URL`` and ``BLOCKLY_IMAGES_URL`` make sure that you don't use file protocol (e.g. file:///, but use instead http:// etc.). For testing purposes you can set up a local static server that serve the necessaries files or you can place them somewhere where you can refer to them with a relative path. For the webserver, for example here is chrome extension [web server for chrome](https://github.com/kzahel/web-server-chrome).

Now proceed to install:


```sh
npm install
```

Start in dev mode
```sh
npm run dev
```

Start in production mode
```sh
npm run build
npm run start
```
