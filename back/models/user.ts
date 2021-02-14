import { Model, DataTypes } from 'sequelize';
import {dbType} from './index';
import {sequelize} from './sequelize';
import Post from './post';

class User extends Model {
    public readonly id!:number;
    public nickname!:string;
    public userId!:string;
    public password?:string;
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

    public readonly Posts?: Post[];
    public readonly Followers?:User[];
    public readonly Followings?:User[];
    
}

User.init({
    nickname:{
        type:DataTypes.STRING(20),
    },
    userId:{
        type:DataTypes.STRING(20),
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING(100),
        allowNull:false,
    }
},{
    sequelize,
    modelName:'User',
    tableName:'user',
    charset:'utf8',
    collate:'utf8_general_ci',
})

User.toString

export const associate = (db:dbType) => {

}

export default User;