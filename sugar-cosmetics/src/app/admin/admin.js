import React, {useState, useEffect} from 'react';
import Header from './admin-layout/header';
import {Routes, Route} from 'react-router-dom';
import './admin.css'

import AdminDashboard from './dashboard/dashboard';
import Sidebar from './admin-layout/sidenav';
import UserManagement from './user-management/admin_user';

import { Col, Row } from 'antd';
import CreateUser from './user-management/create_user';
import BrandManagement from './product-management/admin_brand';
import BrandItem from './product-management/admin_brand_item';
import CategoryManagement from './product-management/admin_category';
import CategoryItem from './product-management/admin_category_item';
import ProductItem from './product-management/product_item';
import ProductManagement from './product-management/admin_product';
import SkinTypeManagement from './product-management/admin_skin_type';
import SkinTypeItem from './product-management/skin_type_item';
import DiscountManagement from './product-management/admin_discount';
import DiscountItem from './product-management/discount_item';

export default function Admin(){

    const [tab, setTab] = useState('/admin');

    return (
        <div>
            <div className='header-admin'>
                <Header/>
            </div>
            <Row className='admin-content'>
                <Col span={5} className='menu-admin'>
                    <Sidebar tab={tab} setTab={setTab}/>
                </Col>
                <Col span={17} className='admin-content-container'>
                    <Routes>
                        <Route path="/" element={<AdminDashboard/>}></Route>

                        <Route path="/user" element={<UserManagement/>}></Route>
                        <Route path='/user/:id/:type' element={<CreateUser/>}></Route>

                        <Route path='/brand' element={<BrandManagement/>}></Route>
                        <Route path='/brand/:id/:type' element={<BrandItem/>}></Route>

                        <Route path='/category' element={<CategoryManagement/>}></Route>
                        <Route path='/category/:id/:type' element={<CategoryItem/>}></Route>

                        <Route path="/product" element={<ProductManagement/>}></Route>
                        <Route path='/product/:id/:type' element={<ProductItem/>}></Route>

                        <Route path="/skin-type" element={<SkinTypeManagement/>}></Route>
                        <Route path='/skin-type/:id/:type' element={<SkinTypeItem/>}></Route>
                        
                        <Route path="/discount" element={<DiscountManagement/>}></Route>
                        <Route path='/discount/:id/:type' element={<DiscountItem/>}></Route>

                    </Routes>
                </Col>
            </Row>
        </div>
    );
}