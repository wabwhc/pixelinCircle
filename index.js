const express = require('express');
const app = express();
const multer = require('multer');
const nunjucks  = require('nunjucks');
const path = require('path');
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'njk');
nunjucks.configure('views', {
    express: app,
})
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
const upload = multer(
    {
      storage: 
        multer.diskStorage( //HDD에 저장
        {
          destination(//저장 위치 설정
            req, file, done
          ){
            done(null, 'uploads/');//에라가 null, uploads폴더에 파일 저장
          },
          filename(
            req, file, done // req 요청정보, file-업로드 파일정보, don() 업로드설정완료시 호출
          ){//abc.jpg
            //file: 업로드된 파일 정보
            const ext = path.extname(file.originalname) //jpg
            done(null, 
              path.basename(file.originalname, ext) //abc
              + Date.now() + ext
              )
          }
        }
      ), //저장공간, 저장방식
      limits: {fileSize : 5 * 1024 * 1024} //용량제한(바이트 단위), 5Mb
   
    }
);

app.post('/img', upload.single('img'), (req, res) => {
    if(req.file.filename === undefined){
        req.file.filename === "test"
    }
    res.render('index.html', {filename : req.file.filename})
})
app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/img.html')
})



app.listen(8080, () => {
    console.log('8080')
})