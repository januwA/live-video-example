# LiveVideoExample

## Run Client
```sh
λ ng s -o --port 4200
λ ng s -o --port 4300
```
开启一个客户端`http://localhost:4200/`, `-o`选项自动打开浏览器, `--port`选项指定端口号

## Run Server
```sh
λ ng s api
```
访问`http://localhost:3333/api/hello`

## 需要的依赖(当然我已经装好了)
```sh
λ npm i --save @nestjs/websockets @nestjs/platform-socket.io
λ npm i --save-dev @types/socket.io

λ npm i socket.io-client // 客户端
```