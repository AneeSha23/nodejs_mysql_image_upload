const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const multer = require('multer')

const app = express()



app.use(cors())
app.use(express())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/uploads',express.static('uploads'))


// -------------------DB Connection starts------------------------------

let db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'profile',
    port:3306
})
// check connection
db.connect((err)=>{
    if(err){console.log("Database not connected...\n\n",err)}
    else{console.log("DB connected successfully.....")}
}) 
// -------------------DB Connection ends------------------------------------






// ------------------------multer connection starts -------------------------

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({
                storage:storage,      // storage: storage => keyword:var_name
                limits:{
                    fileSize: 1024*1024*5
                },
                fileFilter:(req,file,cb)=>{
                    if (
                        file.mimetype == 'image/png' ||
                        file.mimetype == 'image/jpg' ||
                        file.mimetype == 'image/jpeg' ||
                        file.mimetype == 'image/jfif'
                      ) {
                        cb(null, true)
                      } else {
                        cb(null, false)
                        return cb(new Error('Only .png, .jpg, .jfif and .jpeg format allowed!'))
                      }
                }
            
            
            })

// ------------------------multer connection ends ----------------------------






// get all data

app.get('/',(req,res)=>{
    let qr='select * from details'
    db.query(qr,(err,result)=>{
        if(err){
            res.status(400).send(err)
            console.log("cannot get data",err)
        }
        else{
            res.status(200).send(result)
            console.log("get data=>\n")
        }
    })
})

// get index page
app.get('/index',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})


// create new data

// index.html image upload input's name and single('name') should be same
app.post('/',upload.single('profile'),(req,res)=>{
    const url=req.protocol + "://" + req.get('host')
    // console.log(url)

    const file = req.file
    // console.log(req)
    if(!file){
        res.send("data not posted")
    }
    else{
   
       let proname= req.body.name
       let age= req.body.age
       let place=req.body.place
       let profilesrc= url + '/uploads/' + file.filename
    
       let qr = `INSERT INTO details(name,age, place, image) VALUES ('${proname}','${age}','${place}',?)`
       db.query(qr,[profilesrc],(err,result)=>{
        if(err){
            res.status(400).send(err)
            console.log("cannot post data",err)
        }
        else{
            res.status(200).send(result)
            console.log("post data=>\n\n",result)
        }
       })
    }
   
})

// get By id
app.get('/:id',(req,res)=>{
    let Id = req.params.id;
    let qr = `select * from details where id=${Id}`
    db.query(qr,(err,result)=>{
        if(err){
            res.status(400).send(err)
            console.log("cannot get data of id " + Id ,err)
        }
        else{
            res.status(200).send(result)
        }
    })
})



// update existing data
// app.post('/:id',upload.single('profile'),(req,res)=>{
//     const url=req.protocol + "://" + req.get('host')
//     console.log(url)

//     const file = req.file
//     if(!file){res.send("data not updated")}
//     else{
//         let Id = req.params.id
//        let proname= req.body.name
//        let age= req.body.age
//        let place=req.body.place
//        let profilesrc= url + '/uploads/' + file.filename
    
    
//     let qr = `update details set name='${proname}',age='${age}',place='${place}',image='${profilesrc} where id=${Id}`

//     db.query(qr,(err,result)=>{
//         if(err){
//             res.send(err)
//             console.log("cannot update data",err)
//         }
//         else{
//             res.send(result)
//         }
//     })
// }
    
// })


// app.put('/:id',upload.single('profile'),(req,res)=>{
//     const url=req.protocol + "://" + req.get('host')
//     console.log(url)

//     const file = req.file
//     // if(!file){res.send({"message":"data not updated"})}
//     // else{
//        let Id = req.params.id
//        let proname= req.body.name
//        let age= req.body.age
//        let place=req.body.place
//        let profilesrc= url + '/uploads/' + file.filename
    
//     let qr = `update details set name='${proname}',age='${age}',place='${place}',image=? where id=${Id}`
//     db.query(qr,[profilesrc],(err,result)=>{
//         if(err){
//             res.status(400).send(err)
//             console.log("cannot update data",err)
//         }
//         else{
//             res.status(200).send(result)
//             console.log("put data=>\n\n",result)
//         }
//        })
//     // }
   
// })




// delete data

app.delete('/:id',(req,res)=>{
    let Id=req.params.id
    let qr=`delete from details  where id=${Id}`
    db.query(qr,(err,result)=>{
        if(err){
            res.status(400).send(err)
            console.log("cannot delete data",err)
        }
        else{
            res.status(200).send(result)
            console.log("data deleted successfully",result)
        }
    })
})


app.post('/:id',upload.single('profile'),(req,res)=>{
    const url=req.protocol + "://" + req.get('host')
    console.log(url)

    const file = req.file
    // console.log(req)
    if(!file){
        res.send({"message":"data not updated"})
    }
    else{
        let gId=req.params.id
       let proname= req.body.name
       let age= req.body.age
       let place=req.body.place
    //    let profilesrc=req.file.filename 
       let profilesrc= url + '/uploads/' + file.filename
    
       let qr = `update details set name='${proname}',age='${age}',place='${place}',image=? where id=${gId}`       
       db.query(qr,[profilesrc],(err,result)=>{
        if(err){
            res.status(400).send(err)
            console.log("cannot update data",err)
        }
        else{
            res.status(200).send(result)
            console.log("update data=>\n\n",result)
        }
       })
    }
   
})






const port = 4400

app.listen(port,()=>{
    console.log("App listening at port " + port + ".....")
})