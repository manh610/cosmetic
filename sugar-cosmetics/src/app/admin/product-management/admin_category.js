import { Button, Table, Row, Tooltip } from 'antd';
import React, {useState, useEffect} from 'react';
import { createStyles } from 'antd-style';

import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import './admin_product_wrapper.css';
import { useNavigate } from 'react-router-dom';

import categoryService from '../../service/category.service';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CategoryManagement()
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
            title: 'Cấp bậc',
            dataIndex: 'offset',
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'path',
        },
        {
            title: '',
            dataIndex: 'edit',
        },
    ]

    const [data, setData] = useState([])

    const onClickEdit = (item) => {
        console.log(item);
        navigate(`/admin/category/${item.id}/edit`);
    }

    const processData = (data) => {
        var temp = JSON.parse(JSON.stringify(data));
        var count = 1;
        for ( var i = 0; i < temp.length; i++ ){
            temp[i]['stt'] = count++;
            // temp[i]['fullName'] = temp[i].givenName + ' ' + temp[i].familyName;
            temp[i].edit = <Tooltip title='Sửa'><EditOutlined onClick={onClickEdit.bind(null, temp[i])} /></Tooltip>
            temp[i].delete = <Tooltip title='Xóa'><DeleteOutlined /></Tooltip>
        }
        setData(temp);
    }

    useEffect(()=>{
        searchCategory();
    }, [])

    const searchCategory = async () => {
        try {
            const response = await categoryService.search({});
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
            <div className='admin-title'>
                QUẢN LÝ DANH MỤC SẢN PHẨM 
            </div>
            <Row className='mg-bt-15'>
                <Button onClick={() => navigate("/admin/category/0/add")} className='btn-admin-add' type='primary' icon={<PlusOutlined />}>Thêm mới</Button>
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