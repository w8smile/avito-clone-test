import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface BaseItem {
    id: number;
    name: string;
    description: string;
    location: string;
    type: "Недвижимость" | "Авто" | "Услуги";
    image?: string;
}

interface RealEstateItem extends BaseItem {
    type: "Недвижимость";
    propertyType: string;
    area: number;
    rooms: number;
    price: number;
}

interface CarItem extends BaseItem {
    type: "Авто";
    brand: string;
    model: string;
    year: number;
    mileage?: number;
}

interface ServiceItem extends BaseItem {
    type: "Услуги";
    serviceType: string;
    experience: number;
    cost: number;
    workSchedule?: string;
}

type ItemType = RealEstateItem | CarItem | ServiceItem;

export const Item = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<ItemType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`http://localhost:3000/items/${id}`)
            .then(res => {
                setItem(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Ошибка загрузки объявления");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!item) return <div>Объявление не найдено</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>{item.name}</h1>
            {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", borderRadius: "10px" }} />}
            <p><strong>Описание:</strong> {item.description}</p>
            <p><strong>Локация:</strong> {item.location}</p>
            <p><strong>Тип:</strong> {item.type}</p>

            {item.type === "Недвижимость" && (
                <>
                    <p><strong>Тип недвижимости:</strong> {item.propertyType}</p>
                    <p><strong>Площадь:</strong> {item.area} м²</p>
                    <p><strong>Комнат:</strong> {item.rooms}</p>
                    <p><strong>Цена:</strong> {item.price} ₽</p>
                </>
            )}

            {item.type === "Авто" && (
                <>
                    <p><strong>Марка:</strong> {item.brand}</p>
                    <p><strong>Модель:</strong> {item.model}</p>
                    <p><strong>Год выпуска:</strong> {item.year}</p>
                    {item.mileage && <p><strong>Пробег:</strong> {item.mileage} км</p>}
                </>
            )}

            {item.type === "Услуги" && (
                <>
                    <p><strong>Тип услуги:</strong> {item.serviceType}</p>
                    <p><strong>Опыт:</strong> {item.experience} лет</p>
                    <p><strong>Стоимость:</strong> {item.cost} ₽</p>
                    {item.workSchedule && <p><strong>График работы:</strong> {item.workSchedule}</p>}
                </>
            )}

            {/* Кнопка редактирования */}
            <Link to={`/edit/${item.id}`}>
                <button style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "20px"
                }}>
                    Редактировать
                </button>
            </Link>
        </div>
    );
};