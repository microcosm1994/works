function Snake (canvas) {
    this.e = canvas
    this.canvas = {
        width: canvas.width,
        height: canvas.height
    }
    this.ctx = canvas.getContext('2d')
    this.state = {
        timer: null, // 定时器
        startX: 30, // 起始X坐标
        startY: 10, // 起始Y坐标
        body: [], // 身体坐标
        size: 10, // 大小
        length: 3, // 长度
        moveDirection: 'right', // 前进方向
        moveSpeed: 10, // 移动速度
        food: { // 食物的坐标
            x: 0,
            y: 0
        },
        score: 0, // 分数
    }
    this.getPoint()
    this.init(this.state.startX, this.state.startY)
    this.getScore()
    this.listener()
}

Snake.prototype = {
    // 初始化蛇的初始坐标
    init (x, y) {
        for (let i = 0; i < this.state.length; i++) {
            let snake = {
                x: x - this.state.size * i,
                y: y
            }
            this.state.body[i] = snake
        }
        this.create(this.state.body)
    },
    // 创建一个贪吃蛇
    create (body) {
        let ctx = this.ctx
        ctx.fillStyle = '#fff'
        this.clear()
        for (let i = 0; i < body.length; i++) {
            let snake = {
                x: body[i].x,
                y: body[i].y
            }
            ctx.fillRect(snake.x, snake.y, this.state.size, this.state.size)
            this.state.body[i] = snake
        }
    },
    // 开始
    start () {
        this.getPoint()
        this.init(this.state.startX, this.state.startY)
        this.getScore()
        this.run()
        this.control()
    },
    // 让蛇运动起来
    run () {
        let speed = this.state.moveSpeed * 10 // 运行速度
        clearInterval(this.state.timer) // 清除定时器，防止定时器叠加
        this.state.timer = null
        this.state.timer = setInterval(() => {
            this.clear()
            this.direction(this.state.moveDirection)
            this.create(this.state.body)
            this.food()
            this.eat()
            this.borderTest()
            this.getScore()
        }, speed)
    },
    // 控制
    control () {
        let self = this
        document.onkeyup = function (e) {
            // 保存按下按键之前的方向
            let direction = self.state.moveDirection
            switch (e.keyCode) {
                // top
                case 38:
                    self.state.moveDirection = 'top'
                    break
                // bottom
                case 40:
                    self.state.moveDirection = 'bottom'
                    break
                // left
                case 37:
                    self.state.moveDirection = 'left'
                    break
                // right
                case 39:
                    self.state.moveDirection = 'right'
                    break
            }
            // 调用判断方向合法的函数
            setTimeout(() => {
                self.checkDirection(direction)
            }, 10)
        }
    },
    // 判断方向是否合法
    // 判断按下按键之前和按下按键之后的方向，如果这俩个方向相反则游戏结束
    checkDirection (rules) {
        let arr = [['top', 'bottom'], ['left', 'right']]
        let direction = this.state.moveDirection
        if (rules === direction) return false
        for (let i of arr) {
            // 判断相反方向是否在同一数组，如果同时存在则游戏结束
            if (i.includes(rules) && i.includes(direction)) {
                this.gameOver()
            }
        }
    },
    // 方向
    direction (direction) {
        if (!direction) {
            direction = this.state.direction
        }
        switch (direction) {
            case 'top':
                this.moveTop()
                break
            case 'bottom':
                this.moveBottom()
                break
            case 'left':
                this.moveLeft()
                break
            case 'right':
                this.moveRight()
                break
        }
    },
    // 向上移动
    moveTop () {
        let head = this.state.body[0]
        this.state.body[0] = {
            x: this.state.body[0].x,
            y: this.state.body[0].y - this.state.size
        }
        this.move(head)
    },
    // 向下移动
    moveBottom () {
        let head = this.state.body[0]
        this.state.body[0] = {
            x: this.state.body[0].x,
            y: this.state.body[0].y + this.state.size
        }
        this.move(head)
    },
    // 向左移动
    moveLeft () {
        let head = this.state.body[0]
        this.state.body[0] = {
            x: this.state.body[0].x - this.state.size,
            y: this.state.body[0].y
        }
        this.move(head)
    },
    // 向右移动
    moveRight () {
        let head = this.state.body[0]
        this.state.body[0] = {
            x: this.state.body[0].x + this.state.size,
            y: this.state.body[0].y
        }
        this.move(head)
    },
    // 移动
    // 先保存蛇头坐标，然后再让蛇头向前移动一次，然后从蛇的第二节身体开始遍历，让后一节身体的坐标等于前一节身体的坐标
    move (head) {
        let temp = null
        for (let i = 1; i < this.state.body.length; i++) {
            temp = this.state.body[i]
            this.state.body[i] = head
            head = temp
        }
    },
    // 清除画布
    clear () {
        let ctx = this.ctx
        ctx.clearRect(0 , 0 , this.canvas.width , this.canvas.height)
    },
    // 获取食物坐标
    getPoint () {
        // 获取在canvas中的随机x坐标值
        let x = Math.round(Math.random() * this.canvas.width)
        // 获取在canvas中的随机y坐标值
        let y = Math.round(Math.random() * this.canvas.height)
        this.state.food = {
            x: x % 10 === 0 ? x : x - x % 10,
            y: y % 10 === 0 ? y : y - y % 10
        }
    },
    // 绘制食物
    food () {
        let ctx = this.ctx
        let x = this.state.food.x
        let y = this.state.food.y
        ctx.fillStyle = '#fff'
        ctx.fillRect(x, y, this.state.size, this.state.size)
    },
    // 吃食物
    eat () {
        let food = this.state.food // 食物的坐标
        let snake = this.state.body[0] // 蛇头坐标
        // 判断🐍头坐标是否与食物坐标相同
        if (food.x === snake.x && food.y === snake.y) {
            this.state.score++ // 分数加1
            this.getPoint() // 重新生成一个食物
            this.add() // 添加一节身体
        }
    },
    // 添加一节身体
    add () {
        // 倒数第一节身体坐标
        let old = this.state.body[this.state.body.length - 1]
        // 倒数第二节身体坐标
        let old2 = this.state.body[this.state.body.length - 2]
        let x = old.x - old2.x // 计算x坐标值
        let y = old.y - old2.y // 计算y坐标值
        // 新身体的坐标
        let n = {
            x: old.x + x,
            y: old.y + y
        }
        // 添加
        this.state.body.push(n)
    },
    // 边界检测
    borderTest () {
        let snake = this.state.body[0]
        let border = {
            x: this.canvas.width,
            y: this.canvas.height
        }
        if (snake.x > border.x || snake.x < 1 || snake.y > border.y || snake.y < 1) {
            this.gameOver()
        }
    },
    // gameOver
    gameOver () {
        let ctx = this.ctx
        let x = this.canvas.width / 2
        let y = this.canvas.height / 2
        let text = 'Game Over'
        ctx.font = '100px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText(text, x, y)
        clearInterval(this.state.timer)
        this.state.timer = null
        this.state.moveDirection = 'right'
    },
    // 绘制分数
    getScore () {
        let ctx = this.ctx
        let textWidth = ctx.measureText(this.state.score).width
        let x = this.canvas.width - textWidth
        ctx.font = '24px Georgia'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'right'
        ctx.fillText(this.state.score, x, 20)
    },
    // 点击事件
    listener () {
        let canvas = this.e
        let x = 0
        let y = 0
        canvas.addEventListener('click', (e) => {
            x = e.pageX - canvas.getBoundingClientRect().left
            y = e.pageY - canvas.getBoundingClientRect().top
        })
    },
}

