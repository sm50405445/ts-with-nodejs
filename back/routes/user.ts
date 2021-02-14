import { IUser } from './../types/index.d';
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import {isLoggedIn} from './middleware';
import User from '../models/user';
import { Request,Response,NextFunction } from 'express';
import passport = require('passport');
import Post from '../models/post';

const router = express.Router();

router.get('/',isLoggedIn,(req,res)=>{
    const user = req.user!.toJSON() as User;
    delete user.password;
    return res.json(user);
})

router.post('/',async(req,res,next)=>{
    try{
        const exUser = await User.findOne({
            where:{
                userId:req.body.userId
            }
        })

        if(exUser){
            return res.status(403).send('이미 사용중인 아이디입니다');
        }

        const hashedPassword = await bcrypt.hash(req.body.password,12);
        const newUser = await User.create({
            nickname:req.body.nickname,
            userId:req.body.userId,
            password:hashedPassword,
        });
        return res.status(200).json(newUser);
    }
    catch(err){
        console.error(err);
        next(err)
    }
})

router.post('/login',(req,res,next)=> {

    passport.authenticate('local',(err:Error,user:User,info:{message:string})=> {
        if(err){
            console.error(err);
            return next(err)
        }
        if(info){
            return res.status(401).send(info.message);
        }
        return req.login(user,async(loginErr:Error)=>{
            try{
                if(loginErr)
                    return next(loginErr)

                const fullUser = await User.findOne({
                    where:{id:user.id},
                    include:[{
                        model:Post,
                        as:'Posts',
                        attributes:['id']
                    },{
                        model:User,
                        as:'Followings',
                        attributes:['id']
                    },{
                        model:User,
                        as:'Followers',
                        attributes:['id']
                    }],
                    attributes:{
                        exclude:['password'],
                    }
                })
                return res.json(fullUser);
            }
            catch(err){
                console.error(err);
                return next(err)
            }
        })
    })(req,res,next);
});


router.post('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session!.destroy(()=>{
        res.send('logout 성공')
    });
})

router.get('/:id',async(req,res,next)=>{
    try{
        const user = await User.findOne({
            where:{id:parseInt(req.params.id,10)},
            include:[{
                model:Post,
                as:'Posts',
                attributes:['id']
            },{
                model:User,
                as:'Followings',
                attributes:['id']
            },{
                model:User,
                as:'Followers',
                attributes:['id'] 
            }],
            attributes:["id","nickname"]
        })
        if(!user)
            return res.status(404).send('no user');

        const jsonUser = user.toJSON() as IUser;
        jsonUser.PostCount = jsonUser.Posts?jsonUser.Posts.length:0;
        jsonUser.FollowingCount = jsonUser.Followings?jsonUser.Followings!.length:0;
        jsonUser.FollowerCount = jsonUser.Followers?jsonUser.Followers!.length:0;
    }
    catch(err){
        console.error(err);
        return next(err)
    }
})

router.get('/:id/followings',isLoggedIn,async(req,res,next)=>{
    try{
        const user = await User.findOne({
            where:{id:parseInt(req.params.id,10) || (req.user && req.user.id) || 0}
        })
        if(!user) return res.status(404).send('no user')
        const follower = await user.getFollowings({
            attributes:['id','nickname'],
        })
    }
    catch(err){
        console.error(err);
        return next(err)
    }
})