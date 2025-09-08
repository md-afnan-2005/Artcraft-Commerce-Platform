import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";



const app = express();
const port = 3000;
const saltRounds = 15;

let type;
var byte1;
let cat1;
let var1;
let view1;
var data2;
let put;
let total;
let fat1;
var rav;
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie:{
      maxAge:1000*60*60,
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "craftmen",
  password: "5166",
  port: 5432,
});
db.connect();

app.get("/", async(req, res) => {

  const random=await db.query("select * from products");
     const input=random.rows;
     let Sampleproducts=[];
     for(var n=0; n<10; n++){
        const input1=Math.floor(input.length*Math.random())+1;
        const result2=await db.query("select * from products where productid=$1",[input1]);
        const sample=result2.rows[0];
        Sampleproducts.push(sample);
     }
  const result2=await db.query("select * from artisans where artisanid<=$1",[6]);
    const Sampleartisans=result2.rows;
  res.render("craftmen.ejs",{Sampleproducts:Sampleproducts,Sampleartisans:Sampleartisans})
});

app.get("/home",(req,res) =>{
  res.render("home.ejs")
});



app.post("/sign",(req,res) =>{
  res.redirect("/home")
})

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.get("/craftmen",async (req,res) =>{
  if (req.isAuthenticated()) {
    const name=req.user.name;
     const email=req.user.email;
     type=req.user.type;
    const result2=await db.query("select * from artisans where artisanid<=$1",[6]);
    const Sampleartisans=result2.rows;
    const random=await db.query("select * from products");
     const input=random.rows;
     let proarray=[];
     for(var a=0; a<10; a++){
        const input1=Math.floor(input.length*Math.random())+1;
        const result4=await db.query("select * from products where productid=$1",[input1]);
        const sample=result4.rows[0];
        proarray.push(sample);
     }
        res.render("craftmen.ejs",{reg:name,Sampleproducts:proarray,type:type,Sampleartisans:Sampleartisans});
        
      } else {
        res.redirect("/login");
        
      }
});


app.get("/product",async (req,res) =>{
     const result=await db.query("select * from products where productid=$1",[var1]);
     const products=result.rows[0];
     const artid=products.artisanid;
     const result1=await db.query("select * from artisans where artisanid=$1",[artid]);
     const artdetails=result1.rows[0];
     const random=await db.query("select * from products");
     const input=random.rows;
     let randarray=[];
     for(var i=0; i<8; i++){
        const input1=Math.floor(input.length*Math.random())+1;
        const result2=await db.query("select * from products where productid=$1",[input1]);
        const sample=result2.rows[0];
        randarray.push(sample);
     }
     res.render("product.ejs",{products:products,artdetails:artdetails,rand:randarray,reg:type});
     
 
 });


 app.get("/cart", async(req,res) =>{
  if(req.isAuthenticated()){
  const input=req.user.id;
   const result=await db.query("select productid from cart where id=$1",[input]);
    const data=result.rows;
    const random=await db.query("select * from products");
     const input1=random.rows;
    let rand=[];
     for(var l=0; l<8; l++){
        const input2=Math.floor((input1.length)*Math.random())+1;
        //console.log(`product id on ${input2}`);
        const result2=await db.query("select * from products where productid=$1",[input2]);
        const sample=result2.rows[0];
        rand.push(sample);
     }
    let data3=[];
   for (var j=0; j<data.length; j++){
    data2=result.rows[j].productid;
     const result1=await db.query("select * from products where productid=$1",[data2]);
     const choice=result1.rows[0];
     data3.push(choice);
  }

  
   res.render("cart.ejs",{cartproducts:data3,rand:rand,reg:type});
}
else{
  res.redirect("/login")
}
 });


 app.post("/cart",async(req,res) =>{
  if(req.isAuthenticated()){
  const quantity=req.body.quantity;
  const input=req.body.cart;
  const data=req.user.id;
  //console.log(`product input is ${input}`)
   await db.query("insert into cart(id,productid) values($1,$2)",[data,input])
   await db.query("update cart set quantity=$1 where (id=$2 AND productid=$3)",[quantity,data,input]);
  res.redirect("/cart");
  }else{
    res.redirect("/login");
  }
 });


 app.post("/cartdelete", async(req,res) =>{
  const input=req.user.id;
  const productid=parseInt(req.body.del);
 // console.log(`id is on ${productid}`);
  await db.query("delete from cart where (id=$1 AND productid=$2)",[input,productid]);
  res.redirect("/cart");
 });

////
app.get("/buy",async(req,res) =>{
  if(req.isAuthenticated()){
     total=req.body.total;
    const input=req.user.id;
     const result=await db.query("select productid from cart where id=$1",[input]);
      const data=result.rows;
      //console.log(Productid on ${data[0].productid});
      let data4=[];
     for (var f=0; f<data.length; f++){
      data2=result.rows[f].productid;
       const result1=await db.query("select * from products where productid=$1",[data2]);
       const choice=result1.rows[0];
       data4.push(choice);
    }
    const result3=await db.query("select * from address where id=$1",[input]);
    const address=result3.rows[0];
   
   
    var date=new Date();
   const month=date.getMonth()+1;
   const day=date.getDate()+4;
   const day2=date.getDate();
   const year=date.getFullYear();
   const venom=day+"/" +month + "/"+ year;
   const venom2=day2+"/" +month + "/"+ year;
   if(fat1!=undefined){
    const result5=await db.query("select * from products where productid=$1",[fat1]);
    const buypro=result5.rows[0];
    res.render("buy.ejs",{buypro:buypro,address:address,venom:venom,venom2:venom2})
   }
   else{
   res.render("buy.ejs",{cartproducts:data4,address:address,venom:venom,venom2:venom2});
   }
  }
  else{
    res.redirect("/login");
  }
});


app.post("/buy", async(req,res) =>{
   fat1=req.body.buy2;
   console.log(`product on id2 no ${fat1}`);
   res.redirect("/buy")
})


app.post("/address",async(req,res) =>{
  const id=req.user.id;
  const country=req.body.country;
  const name=req.body.name;
  const mobile=req.body.contact;
  const pincode=req.body.pincode;
  const flat=req.body.flat;
  const area=req.body.area;
  const landmark=req.body.landmark;
  const town=req.body.town;
  const state=req.body.state;
 await db.query("insert into address values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
     [id,country,name,mobile,pincode,flat,area,landmark,town,state]);
  res.redirect("/buy");
});


app.get("/checkout", async(req,res) =>{
  const input=req.user.id;
   const result=await db.query("select * from address where id=$1",[input]);
   const delivery=result.rows[0];

   const result1=await db.query("select * from carddetails where id=$1",[input]);
   const details=result1.rows[0];
   if(put!=undefined){
     res.render("checkout.ejs",{delivery:delivery,carddetails:details,sub:put})
   }
   else{
    res.render("checkout.ejs",{delivery:delivery,carddetails:details});
   }
});


app.post("/checkout", async(req,res) =>{
  const input=req.user.id;
  const bank=req.body.bank;
  const type=req.body.type;
  const cardnumber=req.body.name;
  const name=req.body.nick;
  const expiry=req.body.contact;
  await db.query("insert into carddetails values($1,$2,$3,$4,$5,$6)",[input,bank,type,cardnumber,name,expiry]);
  res.redirect("/checkout");
});


app.post("/verify",(req,res) =>{
  put=req.body.ver;
  //console.log(`pro is on ${put}`)
    res.redirect("/checkout")
});


app.get("/confirm", async(req,res) =>{
  const input=req.user.id;
  const result=await db.query("select productid from cart where id=$1",[input]);
  const input1=result.rows;
  const result1=await db.query("select * from address where id=$1",[input]);
  const input2=result1.rows[0];
  let data7=[];
 for(var b=0; b<result.rows.length; b++){
    const first=result.rows[b].productid;

    const result3=await db.query("select * from products where productid=$1",[first]);
    const second=result3.rows[0];
    data7.push(second);
 }
    var date=new Date();
   const month=date.getMonth()+1;
   const day=date.getDate()+ 4;
   const year=date.getFullYear();

     const venom=day+"/" +month + "/"+ year;

    const result4=await db.query("select * from carddetails where id=$1",[input]);
    const card=result4.rows[0]
    if(fat1!=undefined){
      const result5=await db.query("select * from products where productid=$1",[fat1]);
      const buypro=result5.rows[0];
      res.render("confirm.ejs",{buypro:buypro,venom:venom,address:input2,price:total,put:put,card:card})
     }
     else{
      res.render("confirm.ejs",{cartpro:data7,venom:venom,address:input2,price:total,put:put,card:card});
     }
});


app.get("/pay",(req,res) =>{
  res.render("pay.ejs");
  
});


app.post("/order", async(req,res) =>{
  var user_id=req.user.id;
  const totalamount=req.body.tot;
  var date=new Date();
  const month=date.getMonth()+1;
   const day=date.getDate();
   const year=date.getFullYear();
  
   const venom=day+"/"+month+"/"+year;
   
  await db.query("insert into orders(id,totalamount) values($1,$2)",[user_id,totalamount]);
 
  const result1=await db.query("select * from cart where id=$1",[user_id]);
  const cat2=result1.rows;
  let data8=[];
 for(var d=0; d<result1.rows.length; d++){
    const first=result1.rows[d].productid;
    const result3=await db.query("select * from products where productid=$1",[first]);
    const second=result3.rows[0];
    data8.push(second);
 }
 //const result5=await db.query("select * from orders where id=$1",[user_id]);
 const result5=await db.query("select * from orders order by orderid DESC LIMIT 1");
 var cat5=result5.rows[0].orderid;
 if(fat1!=undefined){
   const result6=await db.query("select * from products where productid=$1",[fat1]);
   const log=result6.rows[0];
   const log2=log.productid;
   const log3=1;
   const log4=parseInt(log.price);
   await db.query("insert into orderdetails(orderid,productid,quantity,price) values($1,$2,$3,$4)",[cat5,log2,log3,log4]) ;
 }
 else{
  for(var z=0; z<data8.length; z++){
  let cat6=data8[z].productid;
  let cat8=parseInt(data8[z].price);
  const result4=await db.query("select * from cart where (id=$1 AND productid=$2)",[user_id,cat6]);
  const cat7=result4.rows[0].quantity;
  await db.query("insert into orderdetails(orderid,productid,quantity,price) values($1,$2,$3,$4)",[cat5,cat6,cat7,cat8]) ;
 };
}
res.redirect("/pay");
});


app.get("/yourorders", async(req,res) =>{
  if(req.isAuthenticated()){
  const input=req.user.id;
  const result=await db.query("select * from orders where id=$1",[input]);
  let carry=[];
  let pull=[];
  let call=[];
  for(var l=0; l<result.rows.length; l++){
    const carry1=result.rows[l];
    carry.push(carry1);
    const carry2=carry1.orderid;
   const result1=await db.query("select * from orderdetails where orderid=$1",[carry2]);
   const carry3=result1.rows[0];
   pull.push(carry3);
   const productid=carry3.productid;
   const result2=await db.query("select * from products where productid=$1",[productid]);
   const carry4=result2.rows[0];
   call.push(carry4);
  };
  //console.log(`order id on ${pull[0].orderid}`)
  //console.log(`product order on ${call[0].title}`)
  res.render("yourorders.ejs",{orders:carry,orderdetails:pull,products:call});
}else{
  res.redirect("/login");
}
});

app.post("/productorder", async(req,res) =>{
  var1=parseInt(req.body.product);
  console.log(`Product on userid ${var1}`);
  res.redirect("/product"); 
});

app.get("/types", async(req,res) =>{
  const result=await db.query("select * from products where category=$1",[rav]);
  const carry3=result.rows;
  res.render("types.ejs",{types:carry3,reg:type})
});


app.post("/types",async(req,res) =>{
  rav=req.body.types;
  res.redirect("/types");
})

app.post("/productpage",(req,res) =>{
  var1=parseInt(req.body.green);
 // console.log(`Product on userid ${var1} `);
  res.redirect("/product");
});


app.get("/profilepage2",async(req,res) =>{
    const result=await db.query("select * from artisans where artisanid=$1",[view1]);
    const artisans=result.rows[0];
    const artid=artisans.artisanid;
    const result1=await db.query("select * from products where artisanid=$1",[artid]);
    const productdetails=result1.rows;
    res.render("artisanprofilepage.ejs",{artisan:artisans,productdetails:productdetails,reg:type});
});


app.post("/productartisan",(req,res) =>{
  view1=parseInt(req.body.artisian);
  console.log(`product artisian on ${view1}`);
  res.redirect("/profilepage2");
})

app.post("/profilepage1",(req,res) =>{
  view1=parseInt(req.body.yellow);
  res.redirect("/profilepage2");
});


app.get("/profile", async(req,res) =>{
  if(req.isAuthenticated()){
  const email=req.user.email;
  const input1=req.body.id;
 // console.log(Profile update run on ${cat1});

  if (cat1!=undefined){
    res.render("artisian.ejs",{reg:type});
    //console.log(Clicked);
  }
    const result=await db.query("select * from artisans where contactinfo=$1",[email]);
     const p1=result.rows[0];
     const id=p1.artisanid;
     const input=await db.query("select * from products where artisanid=$1",[id]);
     const getproducts=input.rows;

     if(p1.name!=null && p1.bio!=null){
      res.render("artisian.ejs",{profile:p1,getproducts:getproducts,reg:type});
     }
    else{
       res.render("artisian.ejs",{getproducts:getproducts,reg:type});
    }
    }
  
  else{
    res.redirect("/login");
   };
})

app.post("/profile" ,async(req,res) =>{
  if(req.isAuthenticated()){
    const email1=req.user.email;
    const name=req.body.name;
    const intro=req.body.intro;
    const contact=req.body.contact;
    const img=req.body.img;
    await db.query("update artisans set name=$1, bio=$2, profilepicture=$3 where contactinfo=$4",[name,intro,img,email1]);
    res.redirect("/craftmen");
   
  }
 
  else{
    res.redirect("/login");
   };
});



app.post("/Sprofile", async(req,res) =>{
   if(req.isAuthenticated()){
    res.redirect("/profile");
   }
   else{
    res.redirect("/login");
   }
  });


app.get("/createproduct", async(req,res) =>{
 /* const email=req.user.email;
  const result=await db.query("select * from artisans where contactinfo=$1",[email]);
  const p1=result.rows[0];
  const id=p1.artisanid;
  const input=await db.query("update products set ")*/
  if(req.isAuthenticated()){
   res.render("createproduct.ejs",{reg:type});
  }
  else{
    res.redirect("/login");
  }
});


app.post("/delete",async (req,res) =>{
  const id=req.body.delete;
  //console.log(Delete run on ${id})
  if(id!=undefined){
    await db.query("delete from products where productid=$1",[id]);
  }
  res.redirect("/craftmen")
});

/*
app.get("/update",(req,res) =>{
  res.redirect("/profile")
})
*/

app.post("/update",async (req,res) =>{
     byte1=req.body.dark;
  res.redirect("/createproduct");
});

app.post("/createproduct" ,async(req,res) =>{
  if(req.isAuthenticated()){
    const email=req.user.email;
    const result=await db.query("select * from artisans where contactinfo=$1",[email]);
    const input=result.rows[0];
    const id=input.artisanid;
    const title=req.body.title;
    const des=req.body.des;
    const price=req.body.price;
    const avail=req.body.avail;
    const image=req.body.image;
    const image1=req.body.image1;
    const image2=req.body.image2;
    const image3=req.body.image3;
    const category=req.body.category;
    const data1=req.body.blue;
   // console.log(new data on ${data1});
    if(byte1!=undefined){
      await db.query("update products set artisanid=$1,title=$2, description=$3, price=$4, availability=$5, images=$6,image1=$7,image2=$8,image3=$9 category=$10 where productid=$11",
      [id,title,des,price,avail,image,image1,image2,image3,category,byte1]);
    }
    else{
   await db.query("insert into products (artisanid,title,description,price,availability,images,image1,image2,image3,category) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[id,title,des,price,avail,image,image1,image2,image3,category]);
    }
   res.redirect("/craftmen");
  }
  else{
    res.redirect("/login");
  }
});


app.get("/allproducts", async(req,res) =>{
  const result=await db.query("select * from artisans");
  const input=result.rows;
  const result1=await db.query("select * from products");
  const input1=result1.rows;
  res.render("allproducts.ejs",{Sampleproducts:input1,Sampleartisans:input,reg:type});
})

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/craftmen",
    failureRedirect: "/login",
  })

);

app.post("/register", async (req, res) => {
  const name=req.body.name
  const email = req.body.username;
  const password = req.body.password;
 type=req.body.type;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (name,email, password,type) VALUES ($1, $2,$3,$4) RETURNING *",
            [name,email, hash,type]
          );
          
          if(type==="seller"){
             const result1=await db.query("insert into artisans (contactinfo) values($1)",[email]);
          }

          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/craftmen");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});



passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const type="users";
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});