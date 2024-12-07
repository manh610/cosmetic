import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import productService from '../../service/product.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Input, Row, Col, Upload, Checkbox, Tooltip, Select, DatePicker } from 'antd';

import { ArrowLeftOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const { TextArea } = Input;

const ProductItem = () => {
    // toast.configure()
    const { id, type } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(true);
    const [submitted, setSubmitted] = useState(false);


    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [country, setCountry] = useState('');
    const [mall, setMall] = useState(false);
    const [description, setDes] = useState('');

    const processData = (data) => {
        setCode(data.code);
        setName(data.name);
        setSlogan(data.slogan);
        setCountry(data.country);
        setMall(data.mall);
        setDes(data.description);
    }

    const initProduct = async () => {
        if ( type == 'add' )
            return;
        try {
            const response = await productService.getById(id);
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    
    useEffect(() => {
        initProduct();
    }, []);

    const save = async (data) => {
        try {
            if (type === 'add') {
                const response = await productService.create(data);
                if (response.status) {
                    toast.success(`Thêm mới sản phẩm ${response.data.name} thành công`);
                    navigate('/admin/product');
                } else {
                    toast.error('Thêm mới sản phẩm thất bại', 'FAIL');
                }
            } else {
                const response = await productService.update(id, data);
                if (response.status) {
                    toast.success(`Cập nhật sản phẩm ${response.data.name} thành công`);
                    navigate('/admin/product');
                } else {
                    toast.error('Cập nhật sản phẩm thất bại');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const onSubmit = () => {
        var data = {
            code: code,
            name: name,
            logo: null,
            country: country,
            mall: mall,
            slogan: slogan,
            description: description,
            status: 'ACTIVE'
        }
        save(data);
    };

    const back = () => {
        navigate("/admin/product")
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
                {type == 'add' ? 'THÊM MỚI SẢN PHẨM' : 'CẬP NHẬT SẢN PHẨM'}
            </div>
            <Row className='product-account'>
                <Col span={10}>
                    <p className='field-label'>Ký hiệu <span className='require-icon'>*</span></p>
                    <Input value={code} onChange={((e) => setCode(e.target.value))} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Thương hiệu sản phẩm <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'MALE', 'label': 'Nam'},
                            { value: 'FEMALE', 'label': 'Nữ'}
                        ]}
                        value={'MALE'}
                    />

                    <p className='field-label'>Ngày sản xuất <span className='require-icon'>*</span></p>
                    <DatePicker 
                        placeholder='Chọn ngày sản xuất'
                        style={{ width: '100%' }}
                    />

                    <p className='field-label'>Trạng thái sản phẩm <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'STOCK', 'label': 'Còn hàng'},
                            { value: 'SOLD_OUT', 'label': 'Hết hàng'}
                        ]}
                        value={'STOCK'}
                    />

                    <p className='field-label'>Loại da phù hợp <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'STOCK', 'label': 'Còn hàng'},
                            { value: 'SOLD_OUT', 'label': 'Hết hàng'}
                        ]}
                        value={'STOCK'}
                    />
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Tên <span className='require-icon'>*</span></p>
                    <Input value={name} onChange={((e) => setName(e.target.value))} placeholder='Nhập tên'></Input>

                    <p className='field-label'>Danh mục sản phẩm <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'STOCK', 'label': 'Còn hàng'},
                            { value: 'SOLD_OUT', 'label': 'Hết hàng'}
                        ]}
                        value={'STOCK'}
                    />

                    <p className='field-label'>Hạn sử dụng <span className='require-icon'>*</span></p>
                    <DatePicker 
                        placeholder='Chọn hạn sử dụng'
                        style={{ width: '100%' }}
                    />

                    <p className='field-label'>Xuất xứ <span className='require-icon'>*</span></p>
                    <Input placeholder='Nhập xuất xứ'></Input>

                    <ImgCrop rotationSlider className='upload-img'>
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
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
            <Row>
                <p className='field-label'>Mô tả</p>
                <TextArea rows={3} placeholder='...'></TextArea>
            </Row>
            <hr className='mg-t-20'/>
            <Row className='mg-t-20'>
            <Col span={10}>
                    <p className='field-label'>Giá nhập <span className='require-icon'>*</span></p>
                    <Input type='number' prefix='VND' defaultValue={0} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Số lượng nhập <span className='require-icon'>*</span></p>
                    <Input type='number' defaultValue={0} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Đơn vị đo </p>
                    <Input placeholder='Nhập đơn vị đo'></Input>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Giá bán <span className='require-icon'>*</span></p>
                    <Input type='number' prefix='VND' defaultValue={0} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Số lượng bán <span className='require-icon'>*</span></p>
                    <Input type='number' defaultValue={0} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Trạng thái sản phẩm <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'STOCK', 'label': 'Còn hàng'},
                            { value: 'SOLD_OUT', 'label': 'Hết hàng'}
                        ]}
                        value={'STOCK'}
                    />
                </Col>
            </Row>
            
            <Row className='admin-btn-container'>
                <Button onClick={back} className='btn-back' size='large' icon={<ArrowLeftOutlined />}>Quay lại</Button>
                <Button onClick={onSubmit} type='primary' size='large' icon={<CheckOutlined />}>Lưu</Button>
            </Row>
        </div>
    );
};

export default ProductItem;
