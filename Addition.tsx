import React, { useState } from 'react';
import './MaterialDarkMental.css';
import { useNavigate } from 'react-router-dom';

export default function SCPObjectRegistration() {
  const navigate = useNavigate();
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>('/object-placeholder.png');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isReady = agree1 && agree2;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageSrc(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [scpName, setScpName] = useState('');
  const [nickname, setNickname] = useState('');
  const [objectClass, setObjectClass] = useState('');
  const [zone, setZone] = useState('');
  const [discoveryDate, setDiscoveryDate] = useState('');
  const [peculiarities, setPeculiarities] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("scp_designation", scpName);
    formData.append("nickname", nickname);
    formData.append("object_class", objectClass);
    formData.append("containment_zone", zone);
    formData.append("discovery_date", discoveryDate);
    formData.append("peculiarities", peculiarities);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/submit-form", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Ответ сервера:", data);
      alert("Объект отправлен!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при отправке данных.");
    }
  };

  return (
    <div className="form-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <div className="form-container">
        <div className="scp-header centered-text">
          <h2 className="scp-title">РЕГИСТРАЦИЯ ОБЪЕКТА</h2>
          <div className="scp-subtitle">SCP FOUNDATION</div>
        </div>

        <div className="security-level">
          Уровень доступа к объекту:
          <div className="levels-inline">
            <label><span>Level 0</span> <input type="radio" name="level" /></label>
            <label><span>Level 1</span> <input type="radio" name="level" /></label>
            <label><span>Level 2</span> <input type="radio" name="level" /></label>
            <label><span>Level 3</span> <input type="radio" name="level" /></label>
            <label><span>Level 4</span> <input type="radio" name="level" /></label>
          </div>
        </div>

        <div className="section row-section">
          <div className="field-column">
            <div className="form-group">
              <label>Обозначение SCP:</label>
              <input type="text" value={scpName} onChange={(e) => setScpName(e.target.value)} placeholder="SCP-XXX" />
            </div>
            <div className="form-group">
              <label>Прозвище:</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Например: Чумной доктор" />
            </div>
            <div className="form-group">
              <label>Класс объекта:</label>
              <select value={objectClass} onChange={(e) => setObjectClass(e.target.value)}>
                <option disabled value="">Выберите класс</option>
                <option>Safe</option>
                <option>Euclid</option>
                <option>Keter</option>
                <option>Thaumiel</option>
              </select>
            </div>
            <div className="form-group">
              <label>Зона содержания:</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)}>
                <option disabled value="">Выберите зону</option>
                <option>Зона-1</option>
                <option>Зона-2</option>
                <option>Зона-3</option>
                <option>Зона-4</option>
                <option>Зона-5</option>
                <option>Зона-6</option>
                <option>Зона-7</option>
                <option>Зона-8</option>
                <option>Зона-9</option>
                <option>Зона-10</option>
                <option>Зона-11</option>
                <option>Зона-12</option>
                <option>Зона-13</option>
                <option>Зона-14</option>
                <option>Зона-15</option>
                <option>Зона-16</option>
                <option>Зона-17</option>
                <option>Зона-18</option>
                <option>Зона-19</option>
                <option>Зона-20</option>
                <option>Зона-21</option>
                <option>Зона-22</option>
                <option>Зона-23</option>
                <option>Зона-24</option>
                <option>Зона-25</option>
                <option>Зона-26</option>
                <option>Зона-27</option>
                <option>Зона-28</option>
                <option>Зона-29</option>
                <option>Зона-30</option>
                <option>Зона-31</option>
                <option>Зона-32</option>
                <option>Зона-33</option>
                <option>Зона-34</option>
                <option>Зона-35</option>
                <option>Зона-36</option>
                <option>Зона-37</option>
              </select>
            </div>
            <div className="form-group">
              <label>Дата обнаружения:</label>
              <input type="text" value={discoveryDate} onChange={(e) => setDiscoveryDate(e.target.value)} placeholder="дд.мм.гггг" />
            </div>
            <div className="form-group">
              <label>Особенности:</label>
              <input type="text" value={peculiarities} onChange={(e) => setPeculiarities(e.target.value)} placeholder="Например: Опасен при контакте" />
            </div>
            <div className="form-group">
              <label>Описание объекта:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подробное описание SCP-объекта..." />
            </div>
          </div>

          <div className="image-column">
            <div className="image-upload">
              <div className="image-preview">
                <img src={imageSrc} alt="SCP Object" />
              </div>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="file-input-label">
                  Выберите файл
                </label>
                <span className="file-name">
                  {imageFile ? imageFile.name : 'Файл не выбран'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!isReady}
        >
          Отправить SCP на утверждение
        </button>
      </div>
    </div>
  );
}
