//express서버 만들기
const express = require('express');
const cors = require("cors");
 //mysql부르기
 const mysql = require("mysql")
//서버생성 -----> express()호출
const app = express(); // 서버를 만들어줌
//프로세서의 주소 포트번호 지정 
const port = 8080;

const multer = require("multer");
console.log(multer)

//서버의 upload를 클라이언트 접근가능하도록 설정 / 이미지로 접근 가능
app.use("/upload", express.static("upload"));
//통신하기위한 데이터포멧 json
//json 형식의 데이터를 처리할수 있도록 설정
app.use(express.json()); //use 사용할거다 제이슨 데이터
//브라우저의 cors이슈를 막기위해 사용하는 코드
app.use(cors());
//diskStroage()----------> 파일을 저장할때의 모든 제어 기능을 제공 ///multer설정 (multer = 파일 업로드를 담당함)
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'upload/');     ///함수고 업로드파일이 담긴다 근데 암호화상태로 담김
    },
    filename: (req, file, cb) => {  //여기서 암호화된 파일명을 원본 파일명으로 바꿔줌
        const newFilename = file.originalname;
        cb(null, newFilename);
    }
})
//get요청시 응답 app.get(경로, 콜백함수)

//파일요청시 파일이 저장될 경로와 파일이름 지정
const upload = multer({storage: storage});

app.post('/upload', upload.single('file'), (req, res)=> {
    res.send({
        imageUrl: req.file.filename
    })
});




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
    conn.query(`select*from products`, 
    function(error, result, fields){
        res.send(result)
    });
})
//addProduct post요청이 오면 처리
//req =>요청하는 객체 res =>응답하는 객체
app.post("/addProduct",async (req, res) => {
    //console.log(req)
    const { p_name, p_price, p_desc, p_img, p_quantity} = req.body;  //밑에 줄 매개변수 3개 넣어줌
    conn.query("insert into products(p_name, p_price, p_desc, p_img, p_quantity) values(?,?,?,?,?)",
    [p_name, p_price, p_desc, p_img, p_quantity],
    (err, result, fields)=>{
        res.send("ok");
    })
})

//삭제요청시 처리하기
app.delete('/delProduct/:id', async (req, res)=> {  //파람스라는 객체에 :id들어감
    //console.log(req);//요청객체
    const {id} = req.params;
    conn.query(`delete from products where p_id=${id}`, (err, rerult, fieelds)=>{
        res.send("ok")
    })

})



app.get("/products/:id", (req, res)=>{
    const params = req.params  //{id: 2}
    const {id} = params;
    conn.query(`select*from products where p_id=${id}`, 
    function(error, result, fields){
        res.send(result)
    });
    
})
//서버를 구동
app.listen(port, ()=>{
    console.log('서버가 돌아가고 있습니다.');
})
