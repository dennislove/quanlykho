import HomePage from "../pages/HomePage/HomePage"
import SignInClient from '../auth/sign-in'
import Product from "../pages/Product/Product"
import Profile from "../pages/Profile/Profile"
import ImportProduct from "../pages/ImportProduct/ImportProduct"
import ManagementAccount from "../pages/Account/ManagementAccount"
import SignUp from "../admin/Account/SignUp"
import FormExport from "../pages/ExportProduct/FormExport"
import CmdExport from "../pages/ExportProduct/CmdExport"
import CmdImport from "../pages/ImportProduct/CmdImport"
import Category from "../pages/Category/Category"
import EditProduct from "../pages/Product/EditProduct"
import Supplier from "../pages/Supplier/Supplier"
import Locations from "../pages/Location/Locations"
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
        path:'/lenh-nhap-hang',
        element:CmdImport,
        isShowHeader: true,
    },
    {
        path:'/phieu-xuat-hang',
        element:FormExport,
        isShowHeader: true,
    },
    {
        path:'/xuat-hang',
        element:CmdExport,
        isShowHeader: true,
    },
    {
        path:'/categories',
        element:Category,
        isShowHeader: true,
    },
    {
        path:'/locations-store',
        element:Locations,
        isShowHeader: true,
    },
    {
        path:'/suppliers',
        element:Supplier,
        isShowHeader: true,
    },
    {
        path:'/product/edit/:id',
        element:EditProduct,
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