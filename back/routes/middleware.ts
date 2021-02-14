import { Request,Response,NextFunction } from 'express';


const isLoggedIn = (req:Request,res:Response,next:NextFunction) => {
    if(req.isAuthenticated()){
        next()
    }else{
        res.status(401).send('로그인이 필요')
    }
}

const isNotLoggedIn = (req:Request,res:Response,next:NextFunction) => {
    if(!req.isAuthenticated()){
        next()
    }else{
        res.status(401).send('로그아웃이 필요')
    }
}

export{isLoggedIn,isNotLoggedIn}
