import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Item {
    id: number;
    name: string;
    description: string;
    location: string;
    type: string;
}

export const List = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get('http://localhost:3000/items')
            .then(res => {
                setItems(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Ошибка загрузки объявлений');
                setLoading(false);
            });
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Загрузка...</div>;

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>{item.location}</p>
                    <p>{item.type}</p>
                    <Link to={`/item/${item.id}`}>
                        <button>Открыть</button>
                    </Link>
                </li>
            ))}
        </ul>
    );
};
