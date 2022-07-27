<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/picinelli/projeto-valex">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f355.svg" alt="Logo" width="100">
  </a>

<h3 align="center">Projeto - Valex (BACK-END)</h3>
  <h4 align="center"> 
	🚀 Concluído! 🚀
  </h4>
  <p align="center">
    API de cartões de benefícios (criação, recarga, ativação, processamento das compras).
    <br />
    <a href="https://github.com/picinelli/projeto-valex/tree/main/src"><strong>Código TS»</strong></a>
</div>

## Sumário

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Rotas](#rotas)
- [Tecnologias Utilizadas](#tecnologias)
- [Contato](#contato)

## Introdução

Uma API de cartões de benefícios. A API será responsável pela criação, recarga, ativação, assim como o processamento das compras.

## Instalação

```
git clone https://github.com/picinelli/projeto-shortly.git

npm install

change start script on package.json to: "start": "node src/server.js",

npm start

```

## Rotas

- **POST /create-card** </br>
  **Esta é uma rota autenticada** </br>
  Deve receber um corpo (body) no formato seguinte e criar o cartão 
  ```
  {
    employeeId: number,
    type: "groceries" | "restaurant" | "transport" | "education" | "health"
  }
	```
  Deve responder um corpo (body) com o CVV do cartão.

- **POST /create-virtual-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e criar o cartão virtual 
  ```
  {
    originalCardId: number,
    password: string
  }
	```
  Deve responder um corpo (body) com o CVV do cartão.
  
- **POST /delete-virtual-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e deletar o cartão virtual 
  ```
  {
    id: number,
    password: string
  }
	```

- **POST /activate-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e ativar o cartão 
  ```
  {
    id: number,
    securityCode: string,
    password: string
  }
	```
	
- **POST /block-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e bloquear o cartão 
  ```
  {
    id: number,
    password: string
  }
	```
	
- **POST /unblock-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e desbloquear o cartão 
  ```
  {
    id: number,
    password: string
  }
	```
	
- **POST /payment** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e armazenar o valor do pagamento 
  ```
  {
    cardId: number,
    password: string,
    businessId: number,
    amount: number
  }
	```
	
- **POST /payment-online** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e armazenar o valor do pagamento (online)
  ```
  {
    number: string,
    cardholderName: string,
    expirationDate: string,
    securityCode: string,
    businessId: number,
    amount: number
  }
	```
	
- **POST /recharge-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve receber um corpo (body) no formato seguinte e armazenar o valor da recarga
  ```
  {
    cardId: number,
    amount: number
  }
	```
	
- **GET /transactions-card** </br>
  Esta não é uma rota autenticada. </br>
  Deve responder um corpo (body) no formato seguinte
  ```
  {
    balance: number,
    transactions: [...],
    recharges: [...]
  }
	```


## Tecnologias
 
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

<!-- CONTACT -->

## Contato

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Mail][mail-shield]][mail-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/pedro-ivo-brum-cinelli//
[mail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[mail-url]: mailto:cinelli.dev@gmail.com
