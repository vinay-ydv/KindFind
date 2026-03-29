import User from "../models/user.model.js"



export const getCurrentUser=async (req,res)=>{
    try {
        let id=req.userId 
        // console.log(id) 
        const user=await User.findById(id).select("-password")
        if(!user){
            return res.status(400).json({message:"user does not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({message:"get current user or profile fetch error"})
    }
}



// export const getprofile=async (req,res)=>{
//     try {
//         let {userName}=req.params
//         let user=await User.findOne({userName}).select("-password")
//         if(!user){
//             return res.status(400).json({message:"userName does not exist"})
//         }
//         return res.status(200).json(user)
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:`get profile error ${error}`})
//     }
// }

