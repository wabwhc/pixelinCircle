import dot from "./dot.js";

class app{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.resize();

        this.dots = [];
        //dot의 크기
        this.radius = 4;
        this.pixelSize = this.radius * 2;


        //이미지에 대한 정보
        this.imgPos = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        }
        this.isLoaded = false;
        this.image = new Image();
        this.image.src = 'jstreet6.jpg';
        this.image.onload = () => {
            this.isLoaded = true;
            this.drawImage();
        }
         
        window.addEventListener('resize', this.resize.bind(this));

        //마우스를 중심으로 이동
        this.canvas.addEventListener('mousemove', (e) => this.drawInCircle(e));
        //휠로 dot크기 조절
        this.canvas.addEventListener('wheel', (e) => {
            if(e.deltaY <= -100){
                this.radius += 1;
                this.pixelSize = this.radius * 2;
                this.resize();
            }else if(e.deltaY >= 100){
                if(this.radius !== 3){
                    this.radius -= 1;
                    this.pixelSize = this.radius * 2;
                    this.resize();
                }
            }
        })
    }

    resize(){
        this.dots = [];
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if(this.isLoaded){
            this.drawImage();
        }
    }

    drawImage(){
        //이미지 크기 조절
        this.stageRatio = this.width / this.height;
        this.imgRatio = this.image.width / this.image.height;

        this.imgPos.width = this.width;
        this.imgPos.height = this.height;

        if(this.imgRatio < this.stageRatio){
            this.imgPos.width = Math.round(
                this.image.width * (this.height / this.image.height)
            );
            this.imgPos.x = Math.round(
                (this.width - this.imgPos.width) / 2
            );
        }else{
            this.imgPos.height = Math.round(
                this.image.height * (this.width / this.image.width)
            );
            this.imgPos.y = Math.round(
                (this.height - this.imgPos.height) / 2
            );
        }
        //이미지 그리기
        this.ctx.drawImage(
            this.image,
            0, 0,
            this.image.width, this.image.height,
            this.imgPos.x, this.imgPos.y,
            this.imgPos.width, this.imgPos.height,
        );
        //이미지의 색 가져오기
        this.imgData = this.ctx.getImageData(this.imgPos.x, this.imgPos.y, this.imgPos.width, this.imgPos.height);
        //이미지는 지움
        this.ctx.clearRect(0, 0, this.width, this.height);
        //dot만들기
        this.makedot();
    }

    makedot(){
        //this.col, this.row dot 위치
        this.col = Math.ceil(this.imgPos.width / this.pixelSize);
        this.row = Math.ceil(this.imgPos.height / this.pixelSize);
        for(let i = 0; i < this.row; i++){
            const y = (i + 0.5) * this.pixelSize;
            const pixelY = Math.max(Math.min(y, this.imgPos.height - this.radius), 0);

            for(let j = 0; j < this.col; j++){
                const x = (j + 0.5) * this.pixelSize;
                const pixelX = Math.max(Math.min(x, this.imgPos.width - this.radius), 0);

                const pixelIndex = (pixelX + pixelY * this.imgPos.width) * 4;
                const red = this.imgData.data[pixelIndex + 0];
                const green = this.imgData.data[pixelIndex + 1];
                const blue = this.imgData.data[pixelIndex + 2];

                const Dot = new dot(
                    this.imgPos.x + x, this.imgPos.y + y,
                    this.radius,
                    red, green, blue, this.canvas, this.ctx
                );
                Dot.draw(this.ctx)
                this.dots.push(Dot);
            }
        }
    }

    drawInCircle(e){
        this.ctx.clearRect(0, 0, this.width, this.height);
        //보여줄 크기 조절
        let eCircle = this.imgPos.width > this.imgPos.height ? this.imgPos.height / 5 : this.imgPos.width / 5; 
        let pixelDistance = Math.ceil(eCircle / this.pixelSize);
        //마우스 위치 계산
        let ex = 0;
        let ey = 0;
        let Eindex = 0;
        ey = Math.ceil((e.clientY - this.imgPos.y) / this.pixelSize);
        ex = Math.ceil((e.clientX - this.imgPos.x) / this.pixelSize);
        if(ey < 0){
            ey = 0;
        }else if(ey > this.row){
            ey = this.row;
        }
        if(ex < 0){
            ex = 0;
        }else if(ex > this.col){
            ex = this.col;
        }
        //모든 pixel을 검사하면 너무 느려짐; 범위 구해서 범위 안에 있는 pixel만 검사
        for(let i = ey - pixelDistance; i <= ey + pixelDistance; i++){
            for(let j = ex - pixelDistance; j <= ex + pixelDistance; j++){
                Eindex = i * this.col + j;
                try{
                    if(this.collside(this.dots[Eindex].x, this.dots[Eindex].y, e.clientX, e.clientY) <= eCircle){
                        this.dots[Eindex].opacity = 1;
                    }
                    this.dots[Eindex].draw(this.ctx);
                }catch(e){

                }
            }
        }
        
    }

    collside(x1, y1, x2, y2){
        const distance = Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
        return distance;
    }
}

window.onload = () => {
    new app();
}