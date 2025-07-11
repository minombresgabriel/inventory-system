import { useEffect, useState } from 'react';
import api from '../services/api';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then((response) => setProducts(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Productos</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.price} - {product.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
