import HomePage from "../pages/HomePage/HomePage"
import SignInClient from '../auth/sign-in'
import Product from "../pages/Product/Product"
import Profile from "../pages/Profile/Profile"
import ImportProduct from "../pages/Product/ImportProduct"
import SignUpClient from "../auth/sign-up"
import ManagementAccount from "../pages/Account/ManagementAccount"
import SignUp from "../admin/Account/SignUp"
export const routes = [
   
    {
        path:'/admin',
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
        path:'/nhap-hang',
        element:ImportProduct,
        isShowHeader: true,
    },
    {
        path:'/admin/api/sign-up',
        element:SignUp,
        isShowHeader: false,
        protected: false

    },
    {
        path:'/sign-in',
        element:SignInClient,
        isShowHeader: false,
        protected: false

    },
    {
        path:'/account-management',
        element:ManagementAccount,
        isShowHeader: true,
        protected: false
    },
    
]