var vm = new Vue({
    el: `#calculator`,
    data(){
        return {
            //式expression, 答えanswer
            expression: "",
            answer: ""
        };
    },
    methods: {
        //Acボタン
        btnAc(){
            this.expression = "";
            this.answer = "";
        },
        //Delボタン
        btnDel(){
            if(this.answer === "")this.expression = this.expression.substring(0, this.expression.length-1);
        },
        //=ボタン
        btnEqual(){
            if(this.expression !== "")this.answer = this.expressionParser(this.expression);
        },
        //+ - * / ( ) ボタン
        btnOp(key){
            if(isNaN(this.answer)){
                this.expression = key;
                this.answer = "";
            }else if(this.answer !== ""){
                this.expression = this.answer + key;
                this.answer = "";
            }else this.expression += key;
        },
        //数値、小数点のボタン
        btnNum(key){
            if(this.answer !== ""){
                this.expression = "";
                this.answer = "";
            }
            this.expression += key;
        },
        //式expressionを解析して結果を返す関数
        expressionParser(expression){
            // 演算子を入れるためのスタック
            let ops = [];
            // 数字を入れるためのスタック
            let nums = [];
            //数字を文字列で保存する変数
            let numString = "";
            let i = 0;
            while(i < expression.length){
                let curr = expression[i] + "";
                //最初の文字が符号、または ( の後に符号が続く場合
                if(this.getPriority(curr) === 1 && (i == 0 || expression[i-1] === "(")){
                    numString += expression[i];
                }
                //小数点が連続する場合 >> ERROR
                else if(curr === "." && expression[i-1] === ".")return NaN;
                //currが小数点、または数字の場合(指数表記eにも対応)
                else if(curr === "." || !isNaN(curr) || curr === "e" || expression[i-1] === "e"){
                    numString += curr;
                    // )の後に数値が続く場合はNaN
                    if(expression[i-1] === ")")return NaN;
                }
                //演算子が連続する場合(符号)
                else if(this.getPriority(expression[i-1]) >= 1 && this.getPriority(curr) >= 1){
                    //+ または - の後に * または /　が続く場合　>> ERROR
                    if(this.getPriority(curr) === 2)return NaN;
                    //* または /　の後に + または - が続く場合
                    else if(this.getPriority(expression[i-1]) === 2){
                        numString += curr;
                    }
                    //+ または - の後に + または - が続く場合
                    else{
                        // ++ または -- の場合
                        if(numString[numString.length-1] === curr){
                            numString = numString.substring(0,numString.length-1);
                            numString += "+";
                        }
                        //+- または -+ の場合
                        else{
                            numString = numString.substring(0,numString.length-1);
                            numString += "-";
                        }
                    }
                }
                //currが演算子の場合
                else{
                    if(numString !== ""){
                        nums.push(numString);
                        numString = "";
                    }
                    //opsにデータがある、かつcurrが "(" でない場合
                    if(ops.length > 0 && curr !== "("){
                        //currが ")" の場合
                        if(curr === ")"){
                            // "(" が来るまで計算
                            while(ops[ops.length-1] !== "("){
                                this.calculate(nums, ops);
                            }
                            // "(" をpop
                            ops.pop();
                        }else{
                            while(this.getPriority(curr) <= this.getPriority(ops[ops.length-1])){
                                this.calculate(nums, ops);
                                if(ops.length <= 0)break;
                            }
                        }
                    }
                    //数値の後に ( が続く場合、乗算とみなす
                    else if(curr === "(" && !isNaN(expression[i-1])){
                        ops.push("*");
                    }
                    if(curr !== ")")ops.push(curr);
                }
                i++;
            }
            if(numString !== ""){
                nums.push(numString);
            }
            //スタックが空になるまで計算する
            while(ops.length > 0){
                this.calculate(nums, ops);
            }
            return Number(nums[0]) >= Number.MAX_VALUE ? NaN : Number(nums[0]);
        },
        //数値numの小数点以下の桁数をdigitsに丸めて返す関数
        significantFigures(num, digits){
            return Math.floor(num * Math.pow(10,digits)) / Math.pow(10,digits);
        },
        //数値のスタックnumsと演算子のスタックopsを受け取り、四則演算をする関数
        calculate(nums, ops){
            let right = Number(nums.pop());
            let left = Number(nums.pop());
            let op = ops.pop();
            let value = 0;
            switch(op){
                case "+" : value = left + right; break;
                case "-" : value = left - right; break;
                case "*" : value = left * right; break;
                case "/" : value = left / right; break; 
            }
            //小数点以下の桁数を14桁にする
            value = this.significantFigures(value, 14);
            //numsにpush
            nums.push(value.toString());
        },
        //演算子operatorを受け取り、優先順位を返す関数
        getPriority(operator){
            let hashmap = {
                "/" : 2,
                "*" : 2,
                "+" : 1,
                "-" : 1
            }
            return hashmap[operator] !== undefined ? hashmap[operator] : 0;
        },
        //マウスイベントを登録する関数
        mouseEvent(){
            this.$el.addEventListener("mouseover", function(){
                event.currentTarget.classList.remove("calculator-mouseleave");
                event.currentTarget.classList.add("calculator-mouseover");
            })
            this.$el.addEventListener("mouseleave", function(){
                event.currentTarget.classList.remove("calculator-mouseover");
                event.currentTarget.classList.add("calculator-mouseleave");
            })
        },
        //キーボード入力を可能にする関数
        keyEvent(){
            let body = document.getElementsByTagName("body").item(0);
            //各ボタンをidで取得
            let btnAc = document.getElementById("btnAc");
            let btnDel = document.getElementById("btnDel");
            let btnOpeningParentheses = document.getElementById("btnOpeningParentheses");
            let btnClosingParentheses = document.getElementById("btnClosingParentheses");
            let btnDivision = document.getElementById("btnDivision");
            let btnMultiplication = document.getElementById("btnMultiplication");
            let btnSubtraction = document.getElementById("btnSubtraction");
            let btnAddition = document.getElementById("btnAddition");
            let btnEqual = document.getElementById("btnEqual");
            let btnPoint = document.getElementById("btnPoint");
            //キーと対応する各ボタンを連想配列に格納
            let keyMap = {
                "c" : btnAc,
                "Backspace" : btnDel,
                "(" : btnOpeningParentheses,
                ")" : btnClosingParentheses,
                "/" : btnDivision,
                "*" : btnMultiplication,
                "-" : btnSubtraction,
                "+" : btnAddition,
                "=" : btnEqual,
                "." : btnPoint
            };
            //キーを押した時
            body.addEventListener("keydown", function(event){
                let key = event.key;
                //keyMapにkeyが存在すれば、対応するボタンにclickイベントを発火
                if(key in keyMap){
                    keyMap[key].dispatchEvent(new Event("click"));
                    keyMap[key].classList.remove("bg-trans");
                    keyMap[key].classList.add("button-active");
                }
                //keyに対応する数字ボタンにclickイベントを発火
                if(0 <= Number(key) && Number(key) <= 9){
                    let btnNum = document.getElementById(`btn${key}`);
                    btnNum.dispatchEvent(new Event("click"));
                    btnNum.classList.remove("bg-trans");
                    btnNum.classList.add("button-active");
                }
            })
            //キーを離した時
            body.addEventListener("keyup", function(event){
                let key = event.key;
                if(key in keyMap){
                    keyMap[key].classList.add("bg-trans");
                    keyMap[key].classList.remove("button-active");
                }
                if(0 <= Number(key) && Number(key) <= 9){
                    let btnNum = document.getElementById(`btn${key}`);
                    btnNum.classList.add("bg-trans");
                    btnNum.classList.remove("button-active");
                }
            })
        }
    }
})
vm.mouseEvent();
vm.keyEvent();
