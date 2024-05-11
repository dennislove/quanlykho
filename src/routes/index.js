import HomePage from "../pages/HomePage/HomePage"
import SignInClient from '../auth/sign-in'
import Product from "../pages/Product/Product"
import Profile from "../pages/Profile/Profile"
export const routes = [
   
    {
        path:'/',
        element:HomePage,
        isShowHeader: true,
    },
    {
        path:'/product',
        element:Product,
        isShowHeader: true,
    },
    {
        path:'/profile',
        element:Profile,
        isShowHeader: true,
    },
    {
        path:'/account-management',
        element:SignInClient,
        isShowHeader: true,
        protected: false
    },
    
]