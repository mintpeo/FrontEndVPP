import React, {useEffect, useState} from 'react';
import './cart.css';

import {Link, useNavigate} from "react-router-dom";
import { MdLocalShipping } from "react-icons/md";
import {API_URL, QUANTITY_CART} from "../service/API_URL.jsx";
import {GetStoredUser} from "../service/GetStoredUser.jsx";
import useFetch from "../hooks/useFetch.js";

const Cart = () => {
    const user = GetStoredUser();
    // Load list carts
    const {data: serverCarts} = useFetch(`${API_URL}/cart?userId=${user.id}`);
    const [carts, setCarts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const navigate = useNavigate();

    // Clone list carts
    useEffect(() => {
        if (serverCarts && serverCarts.length > 0) {
            const clone = serverCarts.map(item => ({...item}))
            setCarts(clone);
        }
    }, [serverCarts])

    // Selected Item
    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(selectedId => selectedId !== id)); // Co Roi Thi Loai Bo
        } else {
            setSelectedItems([...selectedItems, id]); // Chua Thi Them Vao
        }
    };

    // Total Price In Cart
    const totalPrice = () => {
        const selected = carts.filter(item => selectedItems.includes(item.id))

        if (selected.length === 0) return "0";

        const {total, cur} = selected.reduce((acc, item) => {
            const product = item.product;
            acc.total += product.price * item.quantity;

            if (!acc.cur) acc.cur = product.currency;

            return acc;
            // return acc mean {total: ..., cur: ...}
        }, {total: 0, cur: ""});

        return total.toLocaleString() + cur; // ko return acc -> undefined
    };

    // Update Quantity Cart In Navbar
    useEffect(() => {
        if (carts && carts.length > 0) {
            let quantity = carts.length;
            localStorage.setItem(QUANTITY_CART, quantity);
        } else if (carts.length < 0) localStorage.setItem(QUANTITY_CART, 0);
    });

    // Add or Sub Quantity
    const updateQuantity = async (num, id, quantity) => {
        let newQuantity = num + quantity;

        if (newQuantity < 1) return;

        // for each phai F5 moi update
        const upNewQuan = carts.map(item => {
            if (item.id === id) return {...item, quantity: newQuantity};
            return item;
        })

        setCarts(upNewQuan);

        try {
            await fetch(`${API_URL}/cart/quantity?id=${id}&quantity=${newQuantity}`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"quantity": newQuantity}),
            });
        } catch (e) {
            console.log("ERROR UPDATE_QUANTITY ", e);
        }
    };

    // Remove Product In Cart
    const removeProduct = async (id) => {
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");

        if (isConfirm) {
            try {
                const res = await fetch(`${API_URL}/carts/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    window.location.reload();
                }
            } catch (e) {
                console.log("ERROR REMOVE_FROM_CART ", e);
            }
        }
    };

    console.log(carts)

    //  Calculate Dis %
    const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
        let savings = originalPrice - discountedPrice;
        let percentage = (savings / originalPrice) * 100;

        return Math.trunc(percentage);
    }

    // Click Check Out
    const clickCheckOut = () => {
      if (selectedItems && selectedItems.length === 0) alert("Vui lòng chọn sản phẩm để tiến hành đặt hàng!");
      else navigate("/cart/checkout", {state: {products: selectedItems}});
    };

    return (
        <div id="cart">
            <div className="container">
                <div className="title">Giỏ hàng</div>
                {
                    carts && carts.length > 0 ? (
                        <div className="main-cart">
                            <div className="container-left">
                                {carts.slice().sort((a, b) => a.id - b.id)
                                    .map(item => (
                                        <div className="list-cart">
                                            <input
                                                type="checkbox"
                                                style={{cursor: "pointer"}}
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />

                                            <img src={item.image} alt="" className="item-img"/>

                                            <div className="item-cart">
                                                <div className="item-left">
                                                    <div className="name" title="222">{item.product.name}</div>
                                                    {item.type && item.type.length > 0 ? (<div className="type">Loại: {item.type}</div>) : ("")}
                                                </div>

                                                <div className="item-middle">
                                                    <div className="price-dis">{item.product.price.toLocaleString()} {item.product.currency}</div>
                                                    <div className="price-noDis">{item.product.originalPrice.toLocaleString()} {item.product.currency}</div>
                                                    <div className="price-percent">-{calculateDiscountPercentage(item.product.originalPrice, item.product.price)}%</div>
                                                </div>

                                                <div className="item-right">
                                                    <button onClick={() => updateQuantity(-1, item.id, item.quantity)} className="btn">-</button>
                                                    <div className="quantity">{item.quantity}</div>
                                                    <button onClick={() => updateQuantity(+1, item.id, item.quantity)} className="btn" style={{borderRadius: "0 4px 4px 0"}}>+</button>
                                                </div>

                                                <button onClick={() => removeProduct(item.id)} className="btn-remove" title="Xoá">X</button>
                                            </div>
                                        </div>))
                                }
                            </div>
                            <div className="container-right">
                                <div className="total-price">
                                    <div>Tổng tiền</div>
                                    <div className="price">{totalPrice()}</div>
                                </div>

                                <div className="note">
                                    <div className="title-note">Ghi chú đơn hàng <span>(Không hỗ trợ đổi hàng và màu sắc liên quan đơn hàng sản phẩm giao ngẫu nhiên)</span></div>
                                    <textarea className="input-note" rows="8"></textarea>
                                    <button onClick={clickCheckOut} className="btn-cart" title="Tiến hành đặt hàng">Tiến hành đặt hàng</button>
                                </div>
                            </div>

                            <div className="free-ship"><i><MdLocalShipping /></i>Miễn phí vận chuyển cho đơn hàng từ 100,000₫</div>
                        </div>
                    ) : (
                        <p>Chưa có sản phẩm nào trong giỏ hàng - quay về <Link to="/" style={{textDecoration: "none", color: "#007bff"}}>Trang Chủ</Link> để mua hàng</p>
                    )
                }
            </div>
        </div>
    );
};

export default Cart;