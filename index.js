//express서버 만들기
const express = require('express');
const cors = require("cors");
 //mysql부르기
 const mysql = require("mysql")
//서버생성 -----> express()호출
const app = express();
//프로세서의 주소 포트번호 지정
const port = 8080;
//통신하기위한 데이터포멧 json
//json 형식의 데이터를 처리할수 있도록 설정
app.use(express.json()); //use 사용할거다 제이슨 데이터
//브라우저의 cors이슈를 막기위해 사용하는 코드
app.use(cors());
//get요청시 응답 app.get(경로, 콜백함수)
//연결선 만들기
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "shopping"
})

//연결하기
conn.connect();


app.get("/products", (req, res)=>{
    conn.query("select*from products", function(error, result, fields){
        res.send(result)
    });
})
app.get("/products/:id", (req, res)=>{
    const params = req.params  //{id: 2}
    const {id} = params;
    res.send(`id는 ${id}이다.`)
})
//서버를 구동
app.listen(port, ()=>{
    console.log('서버가 돌아가고 있습니다.');
})
