import React, { useEffect, useRef, useState } from 'react'
import './product.css';
import { useDispatch } from 'react-redux'
import { updateimage, updatename, updateprice } from '../../redux/actp';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navabar/navbar';
const Search = () => {
    let input = useRef(null)
    let naviagte=useNavigate()
    let dispatch = useDispatch()
    let url = 'http://localhost:3001'
    let [results, setresults] = useState([])
    let handleclick = () => {
        let product_name = input.current.value
        console.log(product_name.trim().split(/\s+/).filter(word => word))
        let product = product_name.trim().split(/\s+/).filter(word => word)
        fetch(`${url}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({ product })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                console.log('searched results', data.new_arr)
                setresults(data.new_arr)
            })
        input.current.value = ''
    }
    useEffect(() => {
        console.log(results)
    }, [results])

    useEffect(() => {
      fetch(`${url}/all_products`)
            .then(res => res.json())
            .then(data => {
                console.log('Initial products:', data.products);
                setresults(data.products); // Ensure same shape
            });
    }, [])
    

    let select = (e) => {
        let id = e.currentTarget.getAttribute('id');
        let userid = e.currentTarget.getAttribute('userid');
        let price = e.currentTarget.getAttribute('price');
        let desc = e.currentTarget.getAttribute('desc');
        let quantity = e.currentTarget.getAttribute('quantity');
        let image=e.currentTarget.getAttribute('image');
        let name=e.currentTarget.getAttribute('name');
        console.log({ id, userid, price, desc, quantity,image,name });
        naviagte('/product', {
        state: {
            id,
            userid,
            price,
            desc,
            quantity,
            image,
            name
        }})




    }
    return (
        <>
        <Navbar/>
            <div id='search'>
                <div id='sub_s'><input type='text' placeholder='search' id='inp' ref={input}></input>
                    <button id='btn_s' onClick={handleclick}>search</button></div>
            </div>
           <div className="product-grid">
  {results.map((value, index) => {
    const product = value.product || value;
    return (
      <div
        key={product._id}
        className="product-card"
        onClick={select}
        name={product.name}
        id={product._id}
        userid={product.userid}
        price={product.price}
        desc={product.description}
        quantity={product.quantity}
        image={product.image}
      >
        <div className='product'>
          <img
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
            src={`${url}${product.image}`}
            alt="product"
          />
          <div className='details'>
            <div><strong>{product.name}</strong></div>
            <div><price>${product.price}</price></div>
            <div>
  {product.description.length > 30 
    ? product.description.substring(0, 30) + '...' 
    : product.description}
</div>

          </div>
        </div>
      </div>
    );
  })}
</div>

        </>
    )
}

export default Search