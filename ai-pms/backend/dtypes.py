from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequest(BaseModel):
    text: str

class TaskItem(BaseModel):
    task: str = "Unknown Task"
    assignee: str = "Unassigned"
    deadline: str = "Not specified"
    priority: int = 5

class ConflictItem(BaseModel):
    task: str = "System Flag"
    description: str = "No description provided"

class TaskExtractionResponse(BaseModel):
    tasks: List[TaskItem] = []
    conflicts: List[ConflictItem] = []
