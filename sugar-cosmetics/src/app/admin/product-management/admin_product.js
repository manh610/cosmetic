import { Button, Table, Row, Tooltip } from 'antd';
import React, {useState, useEffect} from 'react';
import { createStyles } from 'antd-style';

import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import './admin_product_wrapper.css';
import { useNavigate } from 'react-router-dom';

import productService from '../../service/product.service';

import { toast, ToastContainer } from 'react-toastify';

export default function ProductManagement()
{

    const useStyle = createStyles(({ css, token }) => {
        const { antCls } = token;
        return {
          customTable: css`
            ${antCls}-table {
              ${antCls}-table-container {
                ${antCls}-table-body,
                ${antCls}-table-content {
                  scrollbar-width: thin;
                  scrollbar-color: #eaeaea transparent;
                  scrollbar-gutter: stable;
                }
              }
            }
          `,
        };
    });

    const navigate = useNavigate();

    const { styles } = useStyle();

    const column = [
        {
            title: 'STT',
            dataIndex: 'stt'
        },
        {
            title: 'Ký hiệu',
            dataIndex: 'code',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brandName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Xuất xứ',
            dataIndex: 'madeIn',
        },
        {
            title: '',
            dataIndex: 'edit',
        },
    ]

    const [data, setData] = useState([]);

    const onClickEdit = (item) => {
        console.log(item);
        navigate(`/admin/product/${item.id}/edit`);
    }

    const processData = (data) => {
        var temp = JSON.parse(JSON.stringify(data));
        var count = 1;
        for ( var i = 0; i < temp.length; i++ ){
            temp[i]['stt'] = count++;
            temp[i].status = temp[i].status == 'STOCK' ? 'Còn hàng':'Hết hàng';
            temp[i].edit = <Tooltip title='Sửa'><EditOutlined onClick={onClickEdit.bind(null, temp[i])} /></Tooltip>
            temp[i].delete = <Tooltip title='Xóa'><DeleteOutlined /></Tooltip>
        }
        setData(temp);
    }

    useEffect(()=>{
        searchProduct();
    }, [])

    const searchProduct = async () => {
        try {
            const response = await productService.search({});
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
            console.log(error);
        }
    }

    return (
        <div className=''>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='admin-title'>
                QUẢN LÝ SẢN PHẨM 
            </div>
            <Row className='mg-bt-15'>
                <Button onClick={() => navigate("/admin/product/0/add")} className='btn-admin-add' type='primary' icon={<PlusOutlined />}>Thêm mới</Button>
                <Button icon={<ReloadOutlined />}>Tải lại</Button>
            </Row>
            <Table 
                className={styles.customTable}
                columns={column}
                dataSource={data}
                pagination={{
                    defaultPageSize: 5
                }}
            />
        </div>
    );
}