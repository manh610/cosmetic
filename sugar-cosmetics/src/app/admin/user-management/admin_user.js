import { Button, Table, Row, Tooltip } from 'antd';
import React, {useState, useEffect} from 'react';
import { createStyles } from 'antd-style';

import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import './admin_user.css';
import { useNavigate } from 'react-router-dom';

import userService from '../../service/user.service';

import { toast, ToastContainer } from 'react-toastify';

export default function UserManagement()
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
            title: 'Tài khoản',
            dataIndex: 'username',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
        },
        {
            title: 'Cấp bậc',
            dataIndex: 'userRank',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thọai',
            dataIndex: 'phone',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: '',
            dataIndex: 'edit',
        },
        {
            title: '',
            dataIndex: 'delete',
        },
    ]

    const [data, setData] = useState([]);

    const onClickEdit = (item) => {
        console.log(item);
        navigate(`/admin/user/${item.id}/edit`);
    }

    const processData = (data) => {
        var temp = JSON.parse(JSON.stringify(data));
        var count = 1;
        for ( var i = 0; i < temp.length; i++ ){
            temp[i]['stt'] = count++;
            temp[i]['fullName'] = temp[i].givenName + ' ' + temp[i].familyName;
            temp[i].edit = <Tooltip title='Sửa'><EditOutlined onClick={onClickEdit.bind(null, temp[i])} /></Tooltip>
            temp[i].delete = <Tooltip title='Xóa'><DeleteOutlined /></Tooltip>
        }
        setData(temp);
    }

    useEffect(()=>{
        searchUser();
    }, [])

    const searchUser = async () => {
        try {
            const response = await userService.search({});
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
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
                QUẢN LÝ NGƯỜI DÙNG
            </div>
            <Row className='mg-bt-15'>
                <Button onClick={() => navigate("/admin/user/0/add")} className='btn-add-user' type='primary' icon={<PlusOutlined />}>Thêm mới</Button>
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