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

<!-- ABOUT THE PROJECT -->

Rotas:

```
    
  - POST /create-card
    - Rota para a empresa cadastrar um cartão novo para um empregado
    - headers: {
        "x-api-key": "string"
    }
    - body: {
        "employeeId": number,
        "type": "groceries" | "restaurant" | "transport" | "education" | "health"
    }

 - POST /create-virtual-card
    - Rota para a empresa cadastrar um cartão virtual novo para um empregado
    - body: {
    	"originalCardId": number,
    	"password": string
    } 
    
 - POST /delete-virtual-card
    - Rota para a empresa cadastrar um cartão virtual novo para um empregado
    - body: {
    	"id": number,
    	"password": string
    }
    
- POST /activate-card
    - Rota para o(a) empregado(a) ativar um cartão
    - body: {
        "id": number,
        "securityCode": string,
        "password": string
    }
    
- POST /recharge-card
    - Rota para a empresa recarregar o cartão de um(a) empregado(a)
    - body: {
        "cardId": number,
        "amount": number
    }
    
- POST /buy
    - Rota para o(a) empregado(a) fazer uma compra usando um cartão
    - body: {
        "cardId": 1,
        "password": "1234",
        "amount": 10000,
        "businessId": 1
    }
    
- GET /transactions-card
    - Rota para o(a) empregado(a) acessar saldo atual e histórico de recarga e uso do cartão
    - headers: {
	"id": string
    }
    
- POST /block-card
    - Rota para o(a) empregado(a) bloquear um cartão
    - body: {
        "id": number,
        "password": string
    }
    
- POST /unblock-card
    - Rota para o(a) empregado(a) bloquear um cartão
    - body: {
        "id": number,
        "password": string
    }
    
- POST /payment
    - Rota para lançar os pagamentos efetuados pelo cartão
    - body: {
        "cardId": number,
        "password": string,
	"businessId": number,
        "amount": number
    }
    
- POST /payment-online
    - Rota para lançar os pagamentos efetuados pelo cartão virtual
    - body: {
        "number": number,
        "cardholderName": string,
        "expirationDate": string,
        "securityCode": string,
	"businessId": number,
        "amount": number
    }
```


### Tecnologias Utilizadas

![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

<!-- CONTACT -->

### Contato

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Mail][mail-shield]][mail-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/pedro-ivo-brum-cinelli//
[mail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[mail-url]: mailto:cinelli.dev@gmail.com
