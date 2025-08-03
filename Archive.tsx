import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import './MaterialDark.css';

interface SCPObject {
  id: number;
  name: string;
  nickname: string;
  object_class: string;
  containment_zone: string;
  date_of_discovery: string;
  peculiarities: string;
  description: string;
  img: string | null;
}

export default function Archive() {
  const [open, setOpen] = useState(false);
  const [scpObjects, setScpObjects] = useState<SCPObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<SCPObject | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state;

  useEffect(() => {
    fetchAllSCP();
  }, []);

  const fetchAllSCP = async () => {
    try {
      const response = await fetch('http://localhost:8000/get-all-scp');
      const data = await response.json();
      
      if (data.scp_objects) {
        setScpObjects(data.scp_objects);
        console.log(`Загружено ${data.scp_objects.length} SCP объектов`);
      }
    } catch (error) {
      console.error('Ошибка при загрузке SCP объектов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleObjectClick = (object: SCPObject) => {
    setSelectedObject(object);
  };

  const closeDetails = () => {
    setSelectedObject(null);
  };

  if (!form) return <Navigate to="/" />;

  return (
    <>
      <div className="spotlight" />
      <video className="logo-top-left" src="/scp-logo.mp4" autoPlay loop muted playsInline />

      <div className="left-sidebar">
        <button
          className="add-object-btn"
          onClick={() => navigate('/addition')}
        >
          Добавить объект
        </button>

        <div className="scp-sidebar-list">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : scpObjects.length === 0 ? (
            <div className="no-objects">
              <p>SCP объектов пока нет</p>
            </div>
          ) : (
            scpObjects.map((object) => (
              <div
                key={object.id}
                className={`scp-sidebar-item ${selectedObject?.id === object.id ? 'selected' : ''}`}
                onClick={() => handleObjectClick(object)}
              >
                <div className="scp-sidebar-header">
                  <span className="scp-sidebar-designation">{object.name}</span>
                  <span className={`scp-sidebar-class class-${object.object_class.toLowerCase()}`}>
                    {object.object_class}
                  </span>
                </div>
                <div className="scp-sidebar-nickname">{object.nickname}</div>
                <div className="scp-sidebar-zone">{object.containment_zone}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={`personal-slide ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="folder-tab">Личное Дело</div>
        <div className="personal-card">
          <dl className="doc-list">
            <dt>ФИО</dt><dd>{form?.name || '—'}</dd>
            <dt>ID</dt><dd>{form?.id || '—'}</dd>
            <dt>Доступ</dt><dd>{form?.level || '—'}</dd>
            <dt>Зона</dt><dd>{form?.zone || '—'}</dd>
            <dt>Должность</dt><dd>{form?.position || '—'}</dd>
          </dl>
        </div>
      </div>

      <div className="tab-menu">
        <input className="path-input" defaultValue="\\Person\\mitn\\smit\\Secret\\SCP-134" spellCheck={false} />
      </div>
      <div className="tab-menu2" />
      <div className="search-wrapper"><input className="search-input" placeholder="..." /></div>

      <div className="main-content-area">
        {selectedObject ? (
          <div className="scp-details-main">
            <div className="details-main-header">
              <h2>{selectedObject.name}</h2>
              <button className="close-details-btn" onClick={closeDetails}>✕</button>
            </div>
            
            <div className="details-main-content">
              <div className="detail-main-row">
                <label>Прозвище:</label>
                <span>{selectedObject.nickname}</span>
              </div>
              
              <div className="detail-main-row">
                <label>Класс объекта:</label>
                <span className={`class-${selectedObject.object_class.toLowerCase()}`}>
                  {selectedObject.object_class}
                </span>
              </div>
              
              <div className="detail-main-row">
                <label>Зона содержания:</label>
                <span>{selectedObject.containment_zone}</span>
              </div>
              
              <div className="detail-main-row">
                <label>Дата обнаружения:</label>
                <span>{selectedObject.date_of_discovery}</span>
              </div>
              
              <div className="detail-main-row">
                <label>Особенности:</label>
                <span>{selectedObject.peculiarities}</span>
              </div>
              
              <div className="detail-main-row full-width">
                <label>Описание объекта:</label>
                <div className="description-main-text">{selectedObject.description}</div>
              </div>
              
              {selectedObject.img && (
                <div className="detail-main-row">
                  <label>Изображение:</label>
                  <img 
                    src={`http://localhost:8000/uploads/${selectedObject.img.split('/').pop()}`} 
                    alt={selectedObject.name}
                    className="scp-main-image"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <h2>SCP Foundation</h2>
            <p>Выберите объект из списка слева для просмотра детальной информации</p>
          </div>
        )}
      </div>
    </>
  );
}
