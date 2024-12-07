import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import brandService from '../../service/brand.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Input, Row, Col, Upload, Checkbox } from 'antd';

import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const { TextArea } = Input;

const BrandItem = () => {
    // toast.configure()
    const { id, type } = useParams();
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [country, setCountry] = useState('');
    const [mall, setMall] = useState(false);
    const [description, setDes] = useState('');
    const [image, setImage] = useState('');

    const processData = (data) => {
        setCode(data.code);
        setName(data.name);
        setSlogan(data.slogan);
        setCountry(data.country);
        setMall(data.mall);
        setDes(data.description);
        setImage(data.logo);
        if (data.logo != '' && data.logo != null) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'data:image/jpeg;base64,'+data.logo
            }])
        }
    }

    const initBrand = async () => {
        if ( type == 'add' )
            return;
        try {
            const response = await brandService.getById(id);
            if (response.status) {
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    
    useEffect(() => {
        initBrand();
    }, []);

    const save = async (data) => {
        try {
            if (type === 'add') {
                const response = await brandService.create(data);
                if (response.status) {
                    toast.success(`Thêm mới thương hiệu ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/brand');
                    }, 1000)
                } else {
                    toast.error('Thêm mới thương hiệu thất bại', 'FAIL');
                }
            } else {
                const response = await brandService.update(id, data);
                console.log(response);
                if (response.status) {
                    console.log(response.data.name);
                    toast.success(`Cập nhật thương hiệu ${response.data.name} thành công`);
                    setTimeout(() => {
                        navigate('/admin/brand');
                    }, 1000)
                } else {
                    toast.error('Cập nhật thương hiệu thất bại');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const onCheckMall = (e) => {
        setMall(e.target.checked);
    }

    const onSubmit = () => {
        var data = {
            code: code,
            name: name,
            logo: image,
            country: country,
            mall: mall,
            slogan: slogan,
            description: description,
            status: 'ACTIVE'
        }
        save(data);
    };

    const back = () => {
        navigate("/admin/brand")
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
                {type == 'add' ? 'THÊM MỚI THƯƠNG HIỆU SẢN PHẨM' : 'CẬP NHẬT THƯƠNG HIỆU SẢN PHẨM'}
            </div>
            <Row className='brand-account'>
                <Col span={10}>
                    <p className='field-label'>Ký hiệu <span className='require-icon'>*</span></p>
                    <Input value={code} onChange={((e) => setCode(e.target.value))} placeholder='Nhập ký hiệu'></Input>

                    <p className='field-label'>Quốc gia</p>
                    <Input value={country} onChange={((e) => setCountry(e.target.value))} placeholder='Nhập Quốc gia'></Input>

                    <p className='field-label'>Mô tả</p>
                    <TextArea value={description} onChange={((e) => setDes(e.target.value))} rows={3} placeholder='...'></TextArea>

                    <Checkbox className='mg-t-15' checked={mall} onClick={onCheckMall}>Brand Mall</Checkbox>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Tên <span className='require-icon'>*</span></p>
                    <Input value={name} onChange={((e) => setName(e.target.value))} placeholder='Nhập tên'></Input>

                    <p className='field-label'>Slogan</p>
                    <Input value={slogan} onChange={((e) => setSlogan(e.target.value))} placeholder="Nhập slogan"></Input>

                    <ImgCrop rotationSlider className='upload-img'>
                        <Upload
                            customRequest={customRequest}
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

export default BrandItem;
