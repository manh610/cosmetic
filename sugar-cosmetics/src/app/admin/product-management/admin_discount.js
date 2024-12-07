import { Button, Table, Row, Tooltip } from 'antd';
import React, {useState, useEffect} from 'react';
import { createStyles } from 'antd-style';

import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import './admin_product_wrapper.css';
import { useNavigate } from 'react-router-dom';

import discountService from '../../service/discount.service';

import { toast, ToastContainer } from 'react-toastify';

export default function DiscountManagement()
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
            title: 'Thời gian bắt đầu',
            dataIndex: 'startDate',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endDate',
        },
        {
            title: 'Loại mã',
            dataIndex: 'discountType',
        },
        {
            title: '',
            dataIndex: 'edit',
        },
    ]

    const [data, setData] = useState([]);

    const onClickEdit = (item) => {
        console.log(item);
        navigate(`/admin/discount/${item.id}/edit`);
    }

    const processData = (data) => {
        var temp = JSON.parse(JSON.stringify(data));
        var count = 1;
        for ( var i = 0; i < temp.length; i++ ){
            temp[i]['stt'] = count++;
            temp[i].edit = <Tooltip title='Sửa'><EditOutlined onClick={onClickEdit.bind(null, temp[i])} /></Tooltip>
            temp[i].delete = <Tooltip title='Xóa'><DeleteOutlined /></Tooltip>
        }
        setData(temp);
    }

    useEffect(()=>{
        searchDiscount();
    }, [])

    const searchDiscount = async () => {
        try {
            const response = await discountService.search({});
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
                QUẢN LÝ MÃ GIẢM GIÁ
            </div>
            <Row className='mg-bt-15'>
                <Button onClick={() => navigate("/admin/discount/0/add")} className='btn-admin-add' type='primary' icon={<PlusOutlined />}>Thêm mới</Button>
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