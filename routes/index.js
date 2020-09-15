// 載入express模組 
var express = require('express');
// 使用express.Router類別建構子來建立路由物件
var router = express.Router();

// 取得並列出Server端的ip，需在專案中安裝underscore模組: npm install underscore --save
var sip = require('underscore').chain(require('os').networkInterfaces()).values()
    .flatten().find({family: 'IPv4', internal: false}).value().address;
console.log('Server IP='+sip);

//************ 根據Client端利用GET送來之不同路由，回傳相對應的網頁 ************
// 回傳給Client端首頁及該網頁之標題
router.get('/', function(req, res) {
	res.render('index.ejs', {title:"專案首頁"});
});

// 回傳給Client端數學服務操作網頁及該網頁之標題
router.get('/math', function(req, res) {
	res.render('math.ejs', {title:"數學服務操作網頁"});
});

// 回傳給Client端BMI計算服務操作網頁及該網頁之標題
router.get('/bmi', function(req, res) {
	res.render('bmi.ejs', {title:"BMI計算服務操作網頁"});
});

//************** 建立可執行兩個數字加、減、乘、除4則運算之數學服務 *********************
// 當Client使用POST送來以下路由 /math/:num1/:num2/:op 請求時，此服務(匿名式函數)被執行
router.post('/math/:num1/:num2/:op', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); // 允許其他網站的網頁存取此服務
	
	//將具名參數值從路由網址中取出，並轉換成數值
	var num1 = Number(req.params.num1);
	var	num2 = Number(req.params.num2);
	var op = Number(req.params.op);
	var message;
	
	// 若n1不是數值或n2不是數值，則回傳提醒訊息(JSON格式)
	if(Number.isNaN(num1) || Number.isNaN(num2))
		value = "數字1或數字2不是數值";
	// 若op不是數值，則回傳提醒訊息(JSON格式)
	else if(Number.isNaN(op))
		value = "操作代號不是數值，操作代號1:加,2:減,3:乘,4:除";
	else
	{	try
		{
			// 通過數字及操作代碼符合格式的檢驗後，才開始進行計算
			switch(op)
			{
				case 1:
					value = num1 + num2;
					break;
				case 2:
					value = num1 - num2;
					break;
				case 3:
					value = num1 * num2;
					break;
				case 4:
					value = num1 / num2;
					value = value.toFixed(2); //限制小數點後只顯示2位，且變成string
					break;
				default:
					value = "操作代號須為1~4的整數：1:加,2:減,3:乘,4:除";
			};
		}
		catch(ex)
		{
			value = "數學運算時產生例外，原因如下：" + ex.toString();
		}
	}
	// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	res.set(
		{
			'charset': 'utf-8'  
		});
	//傳回一個鍵值對(key-value)的JSON資料給用戶端
	res.send( 
		{result: value}
	);	
});

//**************************** 建立BMI計算服務 *********************************************
// 當Client使用POST送來以下路由 /bmi 請求時(資料包含於請求本體body中)，此服務(匿名式函數)被執行
router.post('/bmi', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); // 允許其他網站的網頁存取此服務
	
	//將具名參數值從路由網址中取出，並轉換成數值
	var height = Number(req.body.height);
	var weight = Number(req.body.weight);
	
	// 若n1不是數值或n2不是數值，則回傳提醒訊息
	if(Number.isNaN(height) || Number.isNaN(weight))
		value = "身高或體重輸入值不是數字";
	else
	{	// 通過數字及操作代碼符合格式的檢驗後，才開始進行計算
		try
		{
			height = height/100;  // 轉換成公尺
			bmi = weight / ((height)*(height));
			value = bmi.toFixed(2); //限制小數點後只顯示2位，且變成string
		}
		catch(ex)
		{
			value = "計算BMI時產生例外，原因如下：" + ex.toString();
		}
	}
	// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	res.set(
		{
			'charset': 'utf-8'  
		});
	//傳回一個鍵值對(key-value)的JSON資料給用戶端
	console.log(value);
	res.send( 
		{result: value}
	);	
});

module.exports = router;