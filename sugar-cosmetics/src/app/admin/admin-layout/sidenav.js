import React, { useState } from 'react';
import {
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  HomeOutlined,
  UserOutlined,
  ShakeOutlined,
  ProductOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const items = [
  { key: '/admin', icon: <HomeOutlined />, label: 'Trang chủ' },
  { key: '/admin/user', icon: <UserOutlined />, label: 'Quản lý người dùng' },
  {
    key: 'sub1',
    label: 'Quản lý sản phẩm',
    icon: <ProductOutlined />,
    children: [
      { key: '/admin/brand', label: 'Thương hiệu' },
      { key: '/admin/category', label: 'Danh mục' },
      { key: '/admin/product', label: 'Sản phẩm' },
      { key: '/admin/skin-type', label: 'Loại da' },
    ],
  },
  {
    key: 'sub2',
    label: 'Quản lý khuyến mại',
    icon: <ShakeOutlined />,
    children: [
      { key: '/admin/discount', label: 'Mã giảm giá' },
    ],
  },
  { key: '/admin/order', icon: <DesktopOutlined />, label: 'Quản lý đơn hàng' },
  { key: '11', icon: <PieChartOutlined />, label: 'Báo cáo thống kê' },
];

export default function Sidebar({tab, setTab}) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const navigate = useNavigate();

  const selectTab = (val) => {
    navigate(val);
    setTab(val);
  }

  return (
    <div style={{ width: 256 }}>
      <Menu
        onClick={(e) => selectTab(e.key)}
        defaultSelectedKeys={[tab]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        items={items}
      />
    </div>
  );
};
