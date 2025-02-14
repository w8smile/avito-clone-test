import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";


interface BaseItem {
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


type Item = RealEstateItem | CarItem | ServiceItem;


type Errors<T> = {
    [K in keyof T]?: { message: string };
};

interface FormProps {
    isEdit?: boolean; // Режим редактирования
}

export const Form: React.FC<FormProps> = ({ isEdit = false }) => {
    const { id } = useParams<{ id: string }>(); // Получаем id из URL
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<Item>();

    const [response, setResponse] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const type = watch("type");

    // Загрузка данных объявления для редактирования
    useEffect(() => {
        if (isEdit && id) {
            axios.get(`http://localhost:3000/items/${id}`)
                .then((res) => {
                    const item = res.data;
                    Object.keys(item).forEach((key) => {
                        setValue(key as keyof Item, item[key as keyof Item]);
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Ошибка загрузки данных объявления");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [isEdit, id, setValue]);

    const onSubmit: SubmitHandler<Item> = async (data) => {
        try {
            const url = isEdit && id ? `http://localhost:3000/items/${id}` : "http://localhost:3000/items";
            const method = isEdit && id ? "put" : "post";
            const res = await axios[method]<Item>(url, data);
            setResponse(res.data);
            setError(null);
            if (!isEdit) reset(); // Сброс формы только в режиме создания
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || "Ошибка при сохранении объявления");
        }
    };

    const typedErrors = errors as Errors<Item>;

    if (loading) return <div>Загрузка...</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                {isEdit ? "Редактировать объявление" : "Создать объявление"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Общие поля */}
                <input
                    type="text"
                    {...register("name", { required: "Название обязательно" })}
                    placeholder="Название"
                    style={{ padding: "10px", fontSize: "16px" }}
                />
                {typedErrors.name && <span style={{ color: "red" }}>{typedErrors.name.message}</span>}

                <textarea
                    {...register("description", { required: "Описание обязательно" })}
                    placeholder="Описание"
                    style={{ padding: "10px", fontSize: "16px", minHeight: "100px" }}
                />
                {typedErrors.description && <span style={{ color: "red" }}>{typedErrors.description.message}</span>}

                <input
                    type="text"
                    {...register("location", { required: "Локация обязательна" })}
                    placeholder="Локация"
                    style={{ padding: "10px", fontSize: "16px" }}
                />
                {typedErrors.location && <span style={{ color: "red" }}>{typedErrors.location.message}</span>}

                <select
                    {...register("type", { required: "Тип объявления обязателен" })}
                    style={{ padding: "10px", fontSize: "16px" }}
                >
                    <option value="">Выберите тип</option>
                    <option value="Недвижимость">Недвижимость</option>
                    <option value="Авто">Авто</option>
                    <option value="Услуги">Услуги</option>
                </select>
                {typedErrors.type && <span style={{ color: "red" }}>{typedErrors.type.message}</span>}

                <input
                    type="text"
                    {...register("image")}
                    placeholder="Ссылка на изображение"
                    style={{ padding: "10px", fontSize: "16px" }}
                />

                {/* Поля для недвижимости */}
                {type === "Недвижимость" && (
                    <>
                        <select
                            {...register("propertyType", { required: "Тип недвижимости обязателен" })}
                            style={{ padding: "10px", fontSize: "16px" }}
                        >
                            <option value="">Выберите тип недвижимости</option>
                            <option value="Квартира">Квартира</option>
                            <option value="Дом">Дом</option>
                            <option value="Коттедж">Коттедж</option>
                            <option value="Офис">Офис</option>
                        </select>
                        {(typedErrors as Errors<RealEstateItem>).propertyType && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<RealEstateItem>).propertyType?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("area", { required: "Площадь обязательна", valueAsNumber: true })}
                            placeholder="Площадь"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<RealEstateItem>).area && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<RealEstateItem>).area?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("rooms", { required: "Количество комнат обязательно", valueAsNumber: true })}
                            placeholder="Комнаты"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<RealEstateItem>).rooms && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<RealEstateItem>).rooms?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("price", { required: "Цена обязательна", valueAsNumber: true })}
                            placeholder="Цена"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<RealEstateItem>).price && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<RealEstateItem>).price?.message}
                            </span>
                        )}
                    </>
                )}

                {/* Поля для авто */}
                {type === "Авто" && (
                    <>
                        <select
                            {...register("brand", { required: "Марка обязательна" })}
                            style={{ padding: "10px", fontSize: "16px" }}
                        >
                            <option value="">Выберите марку</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="BMW">BMW</option>
                            <option value="Audi">Audi</option>
                        </select>
                        {(typedErrors as Errors<CarItem>).brand && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<CarItem>).brand?.message}
                            </span>
                        )}

                        <input
                            type="text"
                            {...register("model", { required: "Модель обязательна" })}
                            placeholder="Модель"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<CarItem>).model && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<CarItem>).model?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("year", { required: "Год выпуска обязателен", valueAsNumber: true })}
                            placeholder="Год выпуска"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<CarItem>).year && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<CarItem>).year?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("mileage", { valueAsNumber: true })}
                            placeholder="Пробег"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                    </>
                )}

                {/* Поля для услуг */}
                {type === "Услуги" && (
                    <>
                        <select
                            {...register("serviceType", { required: "Тип услуги обязателен" })}
                            style={{ padding: "10px", fontSize: "16px" }}
                        >
                            <option value="">Выберите тип услуги</option>
                            <option value="Ремонт">Ремонт</option>
                            <option value="Уборка">Уборка</option>
                            <option value="Доставка">Доставка</option>
                            <option value="Консультация">Консультация</option>
                        </select>
                        {(typedErrors as Errors<ServiceItem>).serviceType && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<ServiceItem>).serviceType?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("experience", { required: "Опыт обязателен", valueAsNumber: true })}
                            placeholder="Опыт (лет)"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<ServiceItem>).experience && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<ServiceItem>).experience?.message}
                            </span>
                        )}

                        <input
                            type="number"
                            {...register("cost", { required: "Стоимость услуги обязательна", valueAsNumber: true })}
                            placeholder="Стоимость"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                        {(typedErrors as Errors<ServiceItem>).cost && (
                            <span style={{ color: "red" }}>
                                {(typedErrors as Errors<ServiceItem>).cost?.message}
                            </span>
                        )}

                        <input
                            type="text"
                            {...register("workSchedule")}
                            placeholder="График работы"
                            style={{ padding: "10px", fontSize: "16px" }}
                        />
                    </>
                )}

                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    {isEdit ? "Сохранить изменения" : "Создать"}
                </button>
            </form>

            {response && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    <strong>Объявление {isEdit ? "обновлено" : "создано"}:</strong> {JSON.stringify(response)}
                </div>
            )}
            {error && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#ffebee", color: "red", borderRadius: "5px" }}>
                    <strong>Ошибка:</strong> {error}
                </div>
            )}
        </div>
    );
};