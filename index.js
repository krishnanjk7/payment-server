let http = require('http');
let express = require('express');
let mongoose = require('mongoose');
const bodyParser = require("body-parser");

const Schema = mongoose.Schema;


const paymentDetails = new Schema({
  creditCardNumber: { type: String, required: true, trim: true },
  cardholder: { type: String, required: true, trim: true },
  securityCode: { type: String, trim: true },
  expirationDate: { type: Date, required: true,  },
  amount: { type: String, trim: true },
  createdAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: new Date() }
});

let PaymentDetail = mongoose.model("payment", paymentDetails);

mongoose.connect(
'mongodb+srv://admin:admin@cluster0.pdtz5.mongodb.net/PaymentService?retryWrites=true&w=majority',
).then(function(){
		console.log('db is connected connected');
}).catch(function(e){
	console.log('db connection failed');
	console.log(e);
});

let app = express();


app.use(
  bodyParser.json({
    limit: "1mb"
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "1mb",
    extended: true
  })
);

app.get('/', function(req,res){
	
	res.status(200);
	res.send('Server Started');
	console.log('Server Started');
});

app.get('/list', async function(req,res){
	
	let temp = await PaymentDetail.find(function(err,data)
	{
		if(!err)  return data;
	});
	res.status(200);
	res.send(JSON.stringify(temp));
});

app.post('/add',function(req,res){
	
		
		try {
			let user = new PaymentDetail({
			  creditCardNumber: req.body.creditCardNumber,
			  cardholder: req.body.cardholder,
			  securityCode: req.body.securityCode,
			  expirationDate: req.body.expirationDate,
			  amount: req.body.amount
			});
			user
			  .save()
			  .then(function(result) {
				  res.status(200);
				  res.send({status:true});
				console.log("Payment Added");
			  })
			  .catch(function(error) {
				res.status(500);
				res.send({status:false, msg: 'server error'});
			  });
		} catch (ex) {
			 res.status(500);
			 res.send({status:false, msg: 'server error'});
		}
		
	
});

let server = http.createServer(app);

server.listen(3001,'0.0.0.0');
