import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import userService from '../../service/user.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button, Input, Row, Col, Select, DatePicker } from 'antd';

import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'

const CreateUser = () => {
    const { id, type } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(true);
    const [user, setUser] = useState(null);

    const [username, setUserName] = useState('');
    const [password, setPass] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [familyName, setFname] = useState('');
    const [givenName, setGname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [userRank, setUserRank] = useState('');
    const [dob, setDOB] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        initUser();
    }, []);

    const processData = (data) => {
        setUserName(data.username);
        setPass(data.password);
        setDOB(data.dob);
        setFname(data.familyName);
        setGname(data.givenName);
        setIdentifier(data.citizenNumber);
        setGender(data.gender);
        setCountry(data.country);
        setEmail(data.email);
        setPhone(data.phone);
        setUserRank(data.userRank);
    }

    const initUser = async () => {
        if (type == 'add') 
            return;
        try {
            const response = await userService.getById(id);
            if (response.status) {
                setUser(response.data);
                processData(response.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const save = async (data) => {
        try {
            if (type === 'add') {
                const response = await userService.create(data);
                if (response.status) {
                    toast.success(`Thêm mới người dùng ${response.data.username} thành công`);
                    navigate('/admin/user');
                } else {
                    toast.error('Thêm mới người dùng thất bại', 'FAIL');
                }
            } else {
                const response = await userService.update(data);
                if (response.status) {
                    toast.success(`Cập nhật người dùng ${response.data.username} thành công`);
                    navigate('/admin/user');
                } else {
                    toast.error('Cập nhật người dùng thất bại');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const onSubmit = (data) => {
        if (data) {
            save(data);
        }
    };

    const back = () => {
        navigate("/admin/user")
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
                {type == 'add' ? 'THÊM MỚI NGƯỜI DÙNG' : 'CẬP NHẬT NGƯỜI DÙNG' }
            </div>
            <Row className='user-account'>
                <Col span={10}>
                    <p className='field-label'>Tên đăng nhập <span className='require-icon'>*</span></p>
                    <Input value={username} placeholder='Nhập tên đăng nhập'></Input>

                    <p className='field-label'>Mật khẩu <span className='require-icon'>*</span></p>
                    <Input value={password} placeholder='Nhập mật khẩu'></Input>

                    <p className='field-label'>Chức vụ <span className='require-icon'>*</span></p>
                    <Input placeholder='Nhập tên chức vụ'></Input>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Cấp bậc <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'MEMBER', 'label': 'Thành viên'},
                            { value: 'PRIORITY', 'label': 'Ưu tiên'}
                        ]}
                        value={userRank}
                    />

                    <p className='field-label'>Nhập lại mật khẩu <span className='require-icon'>*</span></p>
                    <Input value={confirmPassword} placeholder="Nhập lại mật khẩu"></Input>
                </Col>
            </Row>
            <hr/>
            <Row className='user-info'>
            <Col span={10}>
                    <p className='field-label'>Họ <span className='require-icon'>*</span></p>
                    <Input value={familyName} placeholder="Nhập họ"></Input>

                    <p className='field-label'>Email <span className='require-icon'>*</span></p>
                    <Input value={email} placeholder='Nhập email'></Input>

                    <p className='field-label'>Số CMND/CCCD <span className='require-icon'>*</span></p>
                    <Input value={identifier} placeholder='Nhập số CMND/CCCD'></Input>

                    <p className='field-label'>Ngày sinh <span className='require-icon'>*</span></p>
                    <DatePicker 
                        style={{ width: '100%' }}
                        value={dob}
                    />
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    <p className='field-label'>Tên <span className='require-icon'>*</span></p>
                    <Input value={givenName} placeholder='Nhập tên'></Input>

                    <p className='field-label'>Số điện thoại <span className='require-icon'>*</span></p>
                    <Input value={phone} placeholder="Nhập số điện thoại"></Input>

                    <p className='field-label'>Giới tính <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'MALE', 'label': 'Nam'},
                            { value: 'FEMALE', 'label': 'Nữ'}
                        ]}
                        value={gender}
                    />

                    <p className='field-label'>Quốc gia <span className='require-icon'>*</span></p>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'VN', 'label': 'VietNam'},
                            { value: 'EN', 'label': 'England'}
                        ]}
                        value={country}
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

export default CreateUser;
