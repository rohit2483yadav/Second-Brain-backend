import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "./config"
import { authMiddleware } from "./authMiddleware";
import {random} from "./utils"
import cors from "cors"


const app=express();
app.use(cors());

import {User,Content, Link } from "./db";
app.use(express.json());

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['POST', 'GET', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true // Allow cookies to be sent with the request
// }));



app.post("/signup", async (req,res)=>{
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    // console.log(req.body);
    const username=req.body.username;
    const password=req.body.password;

    try{
        await User.create({
            username:username,
            password:password
        })
    
        res.json({
            message : "you are signedup"
        })
    }
    catch{
        res.status(403).json({
            message:"duplicate data"
        })
    }
    

})

app.post("/signin",async function(req,res){
    const username  =req.body.username;
    const password  = req.body.password;
    
    const user = await User.findOne({
        username:username,
        password:password
    }) 

    if(user){
        const token:String =jwt.sign({
            id: user._id
        },JWT_SECRET) 

        res.json({
            token:token
        })
    }else{
        res.status(404).json({
            message:"incorrect credentials"
        })
    }
    
})

app.post("/content",authMiddleware,function(req,res){
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    // console.log(req.body);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    
    const now=new Date();
    const day = now.getDate();
    const year=now.getFullYear();
    const monthIndex=now.getMonth();
    const month = months[monthIndex];
    
    const date=(`${day} ${month},${year}` );
    

    let minute=now.getMinutes();
    let hours=now.getHours();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    const zeroforminute= minute<10 ?"0" :"";
    const zeroforhour= hours<10 ?"0" :"";

    

    const time=(`${zeroforhour}${hours}:${zeroforminute}${minute} ${ampm}` );

    const link=req.body.link;
    const type=req.body.type;
    const title=req.body.title;
    
    // console.log(date);
    
    
    Content.create({
        link:link,
        type:type,
        title:title,
        date:date,
        time:time,
        //@ts-ignore
        userId:req.userId,
        
    })

    res.json({
        message:"content added"
    })
    
})

app.get("/content",authMiddleware,async function(req,res){
    //@ts-ignore
    const userId=req.userId;
    const content =await Content.find({
        userId : userId,
    }).populate("userId" ,"username")
    // console.log(userId);
    // console.log(content);
    
    res.json({
        content
    })
})

app.delete("/content/:contentId",authMiddleware,async function(req,res){
    const contentId=req.params.contentId;
    await Content.deleteOne({
        _id:contentId,
        //@ts-ignore
        userId:req.userId
    });

    // if (result) {
    //     return res.status(404).json({ message: "Content not found or unauthorized" });
    // }

    res.json({ message: "Content deleted successfully" });
})

app.post("/brain/share",authMiddleware,async function(req,res){
    const share=req.body.share;
    
    if(share){

        const existingLink=await Link.findOne({
            //@ts-ignore
            userId:req.userId
        })
        if(existingLink){
            res.json({
                hash:existingLink.hash,
            })
        }

        const hash=random(10);
        await Link.create({
            hash:hash,
            //@ts-ignore
            userId:req.userId
        })
        res.json({
            hash:hash,
        })
    }
    else{
        await Link.deleteOne({
            //@ts-ignore
            userId:req.userId
        })

        res.json({
            message:"link deleted"
        })
    }
    
    
})

app.get("/brain/:shareLink",async function(req,res){
    const hash =req.params.shareLink;
    const link =await Link.findOne({
        hash:hash
    })

    if(!link){ 
        res.status(411).json({
            message:"sorry incorrect input"
        })
        return
    }
     
    const content = await Content.find({
        userId:link.userId
    })
    
    const user = await User.findOne({
        _id:link.userId
    }) 

    if(!user){
        res.status(411).json({
            message:"user not found,error should ideally not happen"
        })
        return
    }
     

    res.json({
        user:user.username,
        content:content
    })
})



app.get("/content/youtube",authMiddleware, async function(req,res){
    const content=await Content.find({
        //@ts-ignore
        userId:req.userId,
        type:"youtube"
    })

    res.json({
        content
    })


})


app.get("/content/twitter",authMiddleware, async function(req,res){
    const content=await Content.find({
        //@ts-ignore
        userId:req.userId,
        type:"twitter"
    })

    res.json({
        content
    })


})

app.listen(3000);
 