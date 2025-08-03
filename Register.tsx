import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Material.module.css';          // ← импорт CSS-модуля

/* -------------------------------------------------------------------------- */
/* справочные массивы                                                          */
/* -------------------------------------------------------------------------- */
const zones      = Array.from({ length: 37 }, (_, i) => `Зона-${i + 1}`);
const levels     = ['Уровень доступа 1', 'Уровень доступа 2', 'Уровень доступа 3', 'Уровень доступа 4', 'Уровень доступа 5'];
const positions  = [
  'Агент разведки', 'Исследователь', 'Аналитик', 'Инженер по безопасности', 'Технический специалист',
  'Сотрудник наблюдения', 'Научный ассистент', 'Архивариус', 'Медицинский эксперт', 'Психолог',
  'Руководитель отдела', 'Связист', 'Специалист по допросам', 'Эксперт по аномалиям', 'Куратор объекта',
  'Оператор Базы Данных', 'Специалист по зачистке', 'Логист', 'Куратор зоны', 'Контроль качества'
];

/* -------------------------------------------------------------------------- */
/* компонент                                                                   */
/* -------------------------------------------------------------------------- */
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    id: '',
    level: '',
    zone: '',
    position: '',
    agreeConfidentiality: false,
    agreeData: false,
    error: '',
  });

  /* ---------- быстрые проверки ввода ------------------------------------- */
  const isValidId   = form.id.length >= 7 && /^\d+$/.test(form.id);
  const isValidName = /^[а-яА-ЯёЁa-zA-Z\s]+$/.test(form.name);

  const isComplete =
    isValidId &&
    isValidName &&
    form.level &&
    form.zone &&
    form.position &&
    form.agreeConfidentiality &&
    form.agreeData;

  /* ---------- обновление состояния --------------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      error: '',
    }));
  };

  /* ---------- submit ------------------------------------------------------ */
  const handleSubmit = () => {
    if (!isValidId) {
      setForm(prev => ({ ...prev, error: 'Айди должен содержать минимум 7 цифр' }));
    } else if (!isValidName) {
      setForm(prev => ({ ...prev, error: 'ФИО должно содержать только буквы' }));
    } else {
      navigate('/queue', { state: form });              // ✅ переход на очередь
    }
  };

  /* ---------- разметка ---------------------------------------------------- */
  return (
    <div className={styles.container}>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="/scp.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay}>
        <div className={styles.badge}>
          <h2>РЕГИСТРАЦИЯ&nbsp;СОТРУДНИКА&nbsp;SCP</h2>

          {/* --------- ФИО -------------------------------------------------- */}
          <div className={styles.field}>
            <label>ФИО:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* --------- Айди ------------------------------------------------- */}
          <div className={styles.field}>
            <label>Айди:</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
            />
          </div>

          {/* --------- Уровень доступа ------------------------------------- */}
          <div className={styles.field}>
            <label>Уровень доступа:</label>
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="">---</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* --------- Зона ------------------------------------------------- */}
          <div className={styles.field}>
            <label>Выберите зону:</label>
            <select name="zone" value={form.zone} onChange={handleChange}>
              <option value="">---</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* --------- Должность ------------------------------------------- */}
          <div className={styles.field}>
            <label>Должность в Фонде:</label>
            <select name="position" value={form.position} onChange={handleChange}>
              <option value="">---</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* --------- Чек-1 ----------------------------------------------- */}
          <div className={`${styles.field} ${styles.checkbox}`}>
            <label>
              <input
                type="checkbox"
                name="agreeConfidentiality"
                checked={form.agreeConfidentiality}
                onChange={handleChange}
              />
              <span>
                Я подтверждаю соблюдение политики конфиденциальности и неразглашения информации Фонда&nbsp;SCP.
              </span>
            </label>
          </div>

          {/* --------- Чек-2 ----------------------------------------------- */}
          <div className={`${styles.field} ${styles.checkbox}`}>
            <label>
              <input
                type="checkbox"
                name="agreeData"
                checked={form.agreeData}
                onChange={handleChange}
              />
              <span>
                Я разрешаю передачу своих персональных данных и местоположения сотрудникам Фонда&nbsp;SCP и
                уполномоченным организациям.
              </span>
            </label>
          </div>

          {/* --------- Ошибка --------------------------------------------- */}
          {form.error && <p className={styles.error}>{form.error}</p>}

          {/* --------- Кнопка --------------------------------------------- */}
          <button
            className={`${styles.submitButton} ${isComplete ? styles.submitButtonEnabled : ''}`}
            disabled={!isComplete}
            onClick={handleSubmit}
          >
            Отправить заявку на рассмотрение
          </button>
        </div>
      </div>
    </div>
  );
}
