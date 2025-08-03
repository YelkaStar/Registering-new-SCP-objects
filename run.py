import subprocess
import time
import os
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/submit-form")
async def submit_form(
    scp_designation: str = Form(...),
    nickname: str = Form(...),
    object_class: str = Form(...),
    containment_zone: str = Form(...),
    discovery_date: str = Form(...),
    peculiarities: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None)
):
    print("Получены данные формы:")
    print(f"   SCP Designation: {scp_designation}")
    print(f"   Nickname: {nickname}")
    print(f"   Object Class: {object_class}")
    print(f"   Containment Zone: {containment_zone}")
    print(f"   Discovery Date: {discovery_date}")
    print(f"   Peculiarities: {peculiarities}")
    print(f"   Description: {description}")
    print(f"   Image: {image.filename if image else 'None'}")
    
    image_path = None
    if image:
        image_path = f"uploads/{image.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        print(f"Изображение сохранено: {image_path}")
    
    conn = sqlite3.connect('MainBase.sqlite')
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO anomalies (name, nickname, object_class, containment_zone, 
                                 date_of_discovery, peculiarities, description, img)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scp_designation, nickname, object_class, containment_zone,
            discovery_date, peculiarities, description, image_path
        ))
        
        conn.commit()
        print("Данные успешно сохранены в базу!")
        
    except Exception as e:
        print(f"Ошибка при сохранении в базу: {e}")
        conn.rollback()
        raise
    
    finally:
        conn.close()
    
    return {"message": "Данные успешно сохранены!"}

@app.get("/get-all-scp")
async def get_all_scp():
    conn = sqlite3.connect('MainBase.sqlite')
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT id, name, nickname, object_class, containment_zone, 
                   date_of_discovery, peculiarities, description, img
            FROM anomalies
            ORDER BY id ASC
        """)
        
        rows = cursor.fetchall()
        scp_objects = []
        
        for row in rows:
            scp_objects.append({
                "id": row[0],
                "name": row[1],
                "nickname": row[2],
                "object_class": row[3],
                "containment_zone": row[4],
                "date_of_discovery": row[5],
                "peculiarities": row[6],
                "description": row[7],
                "img": row[8]
            })
        
        print(f"Получено {len(scp_objects)} SCP объектов")
        return {"scp_objects": scp_objects}
        
    except Exception as e:
        print(f"Ошибка при получении данных: {e}")
        return {"error": str(e)}
    
    finally:
        conn.close()

def find_npm():
    possible_paths = [
        "npm",
        "C:\\Program Files\\nodejs\\npm.cmd",
        "C:\\Program Files (x86)\\nodejs\\npm.cmd",
        os.path.expanduser("~\\AppData\\Roaming\\npm\\npm.cmd"),
    ]
    
    for path in possible_paths:
        try:
            result = subprocess.run([path, "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                return path
        except:
            continue
    
    return None

def run_frontend():
    frontend_path = os.path.join(os.getcwd(), "frontend")
    
    if not os.path.exists(frontend_path):
        print(f"Папка {frontend_path} не найдена!")
        print("Создай папку frontend с React проектом")
        return
    
    npm_path = find_npm()
    if not npm_path:
        print("npm не найден!")
        print("Установи Node.js с https://nodejs.org/")
        print("Или запусти фронтенд вручную:")
        print(f"cd {frontend_path}")
        print("npm run dev")
        return
    
    print(f"Найден npm: {npm_path}")
    
    try:
        package_json = os.path.join(frontend_path, "package.json")
        if not os.path.exists(package_json):
            print(f"package.json не найден в {frontend_path}")
            print("Убедись что это React проект")
            return
        
        print("Запускаю React фронтенд...")
        subprocess.run([npm_path, "run", "dev"], cwd=frontend_path, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"Ошибка запуска фронтенда: {e}")
        print("Попробуй:")
        print(f"cd {frontend_path}")
        print("npm install")
        print("npm run dev")

def run_backend():
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    print("Запускаю SCP Foundation Backend и Frontend...")
    print("Backend будет на: http://localhost:8000")
    print("Frontend будет на: http://localhost:5173")
    print("=" * 50)
    
    print("Запускаю бекенд...")
    backend_process = subprocess.Popen([
        "python", "-c", 
        "import uvicorn; from run import app; uvicorn.run(app, host='127.0.0.1', port=8000)"
    ])
    
    time.sleep(2)
    
    print("Запускаю React фронтенд...")
    run_frontend() 