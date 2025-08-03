from pydantic import BaseModel

class Creature(BaseModel):
    name: str
    threat_level: str
    description: str = ''
    location: str = ''
    status: str

class CreatureOut(Creature):
    id: int
