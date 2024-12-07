import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import skinTypeService from '../../service/skinType.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Input, Row, Col, Upload, Checkbox, Tooltip, Select, DatePicker } from 'antd';

import { ArrowLeftOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const { TextArea } = Input;

const SkinTypeItem = () => {
    // toast.configure()
    const { id, type } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(true);
    const [submitted, setSubmitted] = useState(false);


    const [name, setName] = useState('');
    const [description, setDes] = useState('');

    const processData = (data) => {
        setName(data.name);
        setDes(data.description);
    }

    const initSkinType = async () => {
        if ( type == 'add' )
            return;
        try {
            const response = await skinTypeService.getById(id);
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    
    useEffect(() => {
        initSkinType();
    }, []);

    const save = async (data) => {
        try {
            if (type === 'add') {
                const response = await skinTypeService.create(data);
                if (response.status) {
                    toast.success(`Thêm mới loại da ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/skin-type');
                    }, 1500)
                } else {
                    toast.error('Thêm mới loại da thất bại', 'FAIL');
                }
            } else {
                const response = await skinTypeService.update(id, data);
                if (response.status) {
                    toast.success(`Cập nhật loại da ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/skin-type');
                    }, 1500)
                } else {
                    toast.error('Cập nhật loại da thất bại');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const onSubmit = () => {
        var data = {
            name: name,
            description: description
        }
        save(data);
    };

    const back = () => {
        navigate("/admin/skin-type")
    };

    return (
        <div>
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
                {type == 'add' ? 'THÊM MỚI LOẠI DA' : 'CẬP NHẬT LOẠI DA'}
            </div>
            
            <Row>
                <p className='field-label'>Tên <span className='require-icon'>*</span></p>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Nhập tên'></Input>

                <p className='field-label'>Mô tả</p>
                <TextArea value={description} onChange={(e) => setDes(e.target.value)} rows={3} placeholder='...'></TextArea>
            </Row>
            
            <Row className='admin-btn-container'>
                <Button onClick={back} className='btn-back' size='large' icon={<ArrowLeftOutlined />}>Quay lại</Button>
                <Button onClick={onSubmit} type='primary' size='large' icon={<CheckOutlined />}>Lưu</Button>
            </Row>
        </div>
    );
};

export default SkinTypeItem;
