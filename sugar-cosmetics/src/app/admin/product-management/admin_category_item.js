import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import categoryService from '../../service/category.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Input, Row, Col, Upload, Checkbox, Select } from 'antd';

import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const { TextArea } = Input;

export default function CategoryItem(){
    // toast.configure()
    const { id, type } = useParams();
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [offset, setOffset] = useState(1);
    const [path, setPath] = useState('');
    const [parentId, setParentId] = useState(false);
    const [description, setDes] = useState('');
    const [image, setImage] = useState('');
    const [list, setList] = useState([]);

    const processData = (data) => {
        setCode(data.code);
        setName(data.name);
        setOffset(data.offset);
        setPath(data.path);
        setDes(data.description);
        setParentId(data.parentId);
        setImage(data.image);
        if (data.image != '' && data.image != null) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'data:image/jpeg;base64,'+data.image
            }])
        }
    }

    const initCategory = async () => {
        if ( type == 'add' )
            return;
        try {
            const response = await categoryService.getById(id);
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const searchCategory = async () => {
        try {
            const response = await categoryService.search({});
            if (response.status) {
                var temp = JSON.parse(JSON.stringify(response.data));
                for ( var i = 0; i < temp.length; i++) {
                    temp[i].value = temp[i].id;
                    temp[i].label = temp[i].name;
                }
                setList(temp);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
            console.log(error);
        }
    }

    useEffect(() => {
        initCategory();
        searchCategory();
    }, []);

    const onSubmit = () => {
        var data = {
            code: code,
            name: name,
            offset: offset,
            path: path,
            description: description,
            icon: null,
            parentId: parentId,
            image: fileList.length > 0 ? image  : ''
        }
        save(data);
    };

    const save = async (data) => {
        try {
            if (type === 'add') {
                const response = await categoryService.create(data);
                if (response.status) {
                    toast.success(`Thêm mới danh mục ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/category');
                    }, 2000)
                } else {
                    toast.error('Thêm mới danh mục thất bại', 'FAIL');
                }
            } else {
                const response = await categoryService.update(id, data);
                if (response.status) {
                    toast.success(`Cập nhật danh mục ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/category');
                    }, 2000)
                } else {
                    toast.error('Cập nhật danh mục thất bại');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const back = () => {
        navigate("/admin/category")
    };

    const [fileList, setFileList] = useState([]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
        src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
        });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess('ok');
        }, 1000);
    
        const reader = new FileReader();
        reader.onload = (e) => {
          const [, base64Image] = e.target.result.split(',');
          setImage(base64Image);
        };
        reader.readAsDataURL(file);
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
                {type === 'add' ? 'THÊM MỚI DANH MỤC SẢN PHẨM' : 'CẬP NHẬT DANH MỤC SẢN PHẨM'}
            </div>
            <Row className='category-account'>
                <Col span={10}>
                    <p className='field-label'>Ký hiệu <span className='require-icon'>*</span></p>
                    <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Cấp bậc</p>
                    <Input value={offset} onChange={(e) => setOffset(e.target.value)} type='number'></Input>

                    <p className='field-label'>Đường dẫn</p>
                    <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder='Nhập đường dẫn'></Input>

                    <p className='field-label'>Mô tả</p>
                    <TextArea value={description} onChange={(e) => setDes(e.target.value)} rows={3} placeholder='...'></TextArea>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Tên <span className='require-icon'>*</span></p>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Nhập tên'></Input>

                    <p className='field-label'>Danh mục cấp cha</p>
                    <Select
                        style={{width: '100%'}}
                        options={list}
                        value={parentId}
                    />

                    <p className='field-label'>Biểu tượng</p>
                    <Input placeholder="Nhập biểu tượng"></Input>

                    <ImgCrop rotationSlider className='upload-img'>
                        <Upload
                            customRequest={customRequest }
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Col>
            </Row>
            
            <Row className='admin-btn-container'>
                <Button onClick={back} className='btn-back' size='large' icon={<ArrowLeftOutlined />}>Quay lại</Button>
                <Button onClick={onSubmit} type='primary' size='large' icon={<CheckOutlined />}>Lưu</Button>
            </Row>
        </div>
    );
};