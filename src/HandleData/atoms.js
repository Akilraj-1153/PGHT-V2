import { atom } from "recoil";

export const LoginState=atom({
    key:'LoginState',
    default:false
}
)




export const NavActiveState=atom({
    key:'NavActiveState',
    default:false
}
)

export const userData=atom({
    key:'userData',
    default:{}
}
)

// export const LoginGoogle=atom({
//     key:'LoginGoogle',
//     default:false
// }
// )


export const DisplayGoogleAlert=atom({
    key:'DisplayGoogleAlert',
    default:false
}
)

export const ProviderIds=atom({
    key:'ProviderIds',
    default:''
}
)

export const UserDetails=atom({
    key:"UserDetails",
    default:null
})

export const Imagestate=atom({
    key:"Imagestate",
    default:""
})

export const currentHabit=atom({
    key:"currentHabit",
    default:""
})

export const userEmail=atom({
    key:"userEmail",
    default:""
})

export const userName=atom({
    key:"userName",
    default:""
})

export const myHabits=atom({
    key:"myHabits",
    default:[]
})

export const selectedHabitsforReport=atom({
    key:"selectedHabitsforReport",
    default:null
})