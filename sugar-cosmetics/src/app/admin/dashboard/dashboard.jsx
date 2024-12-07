import React, { useState, useEffect } from 'react';

export default function AdminDashboard(){
    const [statProduct, setStatProduct] = useState([
        {name: 'AA', value: 200},
        {name: 'BB', value: 500},
        {name: 'CC', value: 800},
        {name: 'DD', value: 10},
        {name: 'EE', value: 80},
        {name: 'FF', value: 660},
        {name: 'GG', value: 700},
        {name: 'HH', value: 200},
        {name: 'II', value: 450},
    ]);

    const getTotalValue = (data) => {
        return data.reduce((total, slice) => total + slice.value, 0);
    };

    const fortmatLabel1 = (labelname) => {
        const totalValue = getTotalValue(statProduct);
        const datapoint = statProduct.find(x => x.name === labelname);
        const degrees = (datapoint.value / totalValue) * 100;
        return `${degrees.toFixed(2)}%`;
    };

    useEffect(() => {
    // Bất kỳ logic nào thay thế cho ngOnInit
    }, []);

    return (
        <div className="container" style={{ margin: '30px' }}>
            <div className="row">
                <div className="col-md-6">
                    {/* Hiển thị OrderItem */}
                    {/* <OrderItem /> */}
                </div>
            </div>
            <div className="row">
                {statProduct.length === 0 ? (
                    <div className="col-md-6">
                        <span>Không có dữ liệu</span>
                    </div>
                ) : (
                    <div className="col-md-6">
                        <div className="row">
                            {/* Chỗ cho pie chart */}
                        </div>
                    </div>
                )}
            </div>
            <div>
                abcd
            </div>
        </div>
    );
}